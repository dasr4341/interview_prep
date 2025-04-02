import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { AgGridReact } from '@ag-grid-community/react';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from '@ag-grid-community/core';
import { Skeleton } from '@mantine/core';
import { toast } from 'react-toastify';
import Humanize from 'humanize-plus';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import {
  GetSurveyTemplateForPatient,
  GetSurveyTemplateForPatientVariables,
  GetOnlyNamedPatients,
  GetOnlyNamedPatientsVariables,
  CreateSurveyVariables,
  CreateSurvey,
  SurveyAssignmentCreatePatientSetArgs,
  UpdatePatientListForSurvey,
  UpdatePatientListForSurveyVariables,
  GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams,
} from 'health-generatedTypes';
import { config } from 'config';
import catchError from 'lib/catch-error';
import { getSurveyTemplateForPatientQuery } from 'graphql/getSurveyTemplateForPatient.query';
import AgGrid from 'components/ag-grid/AgGrid';
import { fullNameController } from 'components/fullName';
import CloseIcon from 'components/icons/CloseIcon';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';
import { removeRowSelection } from 'components/ag-grid/remove-row-selection';
import HeaderRowRenderer from '../SchedulingManager/SelectPatientModal/HeaderRowRenderer';
import { getPatientsListForCounsellor } from 'graphql/getPatientListForCounsellor.query';
import {
  RowInterface,
  selectRowsOfAgGrid,
} from '../SchedulingManager/SelectPatientModal/SelectPatientModal';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import { sendPatientSurvey } from 'graphql/send-patient.mutation';
import { AssessmentTemplateContext } from './component/AssessmentTemplateContext';
import { routes } from 'routes';
import messagesData from 'lib/messages';
import useGetAdhocAssessment from './useGetAdhocAssessment';
import FirstNameRowRender from '../Patient/components/FirstNameRowRender';
import { patientListUpdateForSurvey } from 'graphql/patient-update-for-survey.mutation';
import ScheduleAssessmentForm from './component/ScheduleAssessmentForm';
import { useDebouncedState } from '@mantine/hooks';
import SearchField from 'components/SearchField';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';

export default function ScheduleAssessmentPage() {
  const appData = getAppData();
  const isMultipleFacilitySelected = Number(appData.selectedFacilityId?.length) > 1;
  const { templateId, assessmentId } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [inCensus, setInCensus] = useState(true);
  const [discharge, setDischarge] = useState(false);
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact>(null);
  const navigate = useNavigate();
  const [searchFieldData, setSearchFieldData] = useDebouncedState('', 700);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<RowInterface[]>([]);
  const [isRequired, setIsRequired] = useState<boolean>();
  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const selectedRow =
    useAppSelector((state) => state.app.sentToPatient.selectedRows) || [];
  const {
    sendNow,
    scheduleAt,
    campaignAssessmentSignature: campaignSurveySignature
  } = useContext(AssessmentTemplateContext);

  function firstNameRowRenderController(props: ICellRendererParams) {
    return (
      <FirstNameRowRender
        props={props}
        gridApi={gridRef.current?.api}
      />
    );
  }

  function updateSelectedRows(updatedRow: SentToPatientSelectedRows[]) {
    dispatch(appSliceActions.setSelectedPatientRows(updatedRow));
  }

  function updatePatientRows(updatedRow: SentToPatientSelectedRows[]) {
    dispatch(appSliceActions.setAllPatientRows(updatedRow));
  }

  function headerComponentController(gApi: AgGridReact) {
    return <HeaderRowRenderer isEditable={!!templateId} gridApi={gApi} />;
  }

  const { adhocData } = useGetAdhocAssessment();

  const [columnDefs] = useState<ColDef[] | any>([
    {
      maxWidth: 80,
      headerName: '',
      headerComponent: (gApi: AgGridReact) => headerComponentController(gApi),
      cellRenderer: firstNameRowRenderController,
      suppressMovable: true,
      suppressColumnsToolPanel: true,
    },
    {
      field: 'firstName',
      checkboxSelection: false,
      sortable: true,
      headerCheckboxSelectionFilteredOnly: false,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
    },
    {
      field: 'lastName',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
    },
    {
      field: 'email',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
    },
    {
      headerName: 'Care Teams',
      field: 'careTeam',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
    },
    {
      field: 'gender',
      sortable: true,
      filter: 'agSetColumnFilter'
    },
    {
      field: 'genderIdentity',
      sortable: true,
      filter: 'agSetColumnFilter'
    },
  ]);

  function removeBadgeController(
    updatedRow: SentToPatientSelectedRows[],
    gridRowId: string | null,
    patientId: string
  ) {
    updateSelectedRows(updatedRow);
    removeRowSelection(gridApi, gridRowId, patientId);
  }

  function getPatientBadge(
    patientId: string,
    fullName: string,
    gridRowId: string | null
  ) {
    return (
      <div
        data-testid="patient-badge"
        key={patientId}
        className=" flex items-center space-x-2 py-1.5 px-4 rounded-full bg-gray-300 text-sm">
        <span>
          {fullName.substring(0, 30)}
          {`${fullName.length >= 30 ? '...' : ''}`}
        </span>
        {!assessmentId && (
          <button
            type="button"
            className="p-2 bg-gray-100 rounded-full"
            onClick={() => {
              removeBadgeController(
                selectedRow.filter((d) => d.id !== patientId),
                gridRowId,
                patientId
              );
            }}>
            <CloseIcon className=" text-black w-2 h-2" />
          </button>
        )}
      </div>
    );
  }

  function getSelectedPatientBadgeList(
    listData: SentToPatientSelectedRows[],
    callBack: (
      id: string,
      fullName: string,
      gridRowId: string | null
    ) => JSX.Element
  ) {
    const output: JSX.Element[] = [];
    if (!listData.length) {
      return output;
    }
    const len = listData.length > 10 ? 10 : listData.length;
    for (let i = 0; i < len; i++) {
      output.push(
        callBack(
          listData[i].id,
          fullNameController(listData[i].firstName, listData[i].lastName),
          listData[i]?.gridRowId || null
        )
      );
    }
    return output;
  }

  function onPatientStatus(status: boolean | null | undefined) {
    if (status) {
      return 'In';
    } else if (status === false) {
      return 'Discharged';
    } else {
      return 'N/A';
    }
  }

  function careTeamSetup(
    careTeams:
    GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams[]
      | null
  ) {
    if (careTeams && careTeams.length > 0) {
      return careTeams.filter(i => i.firstName)
                  .map(t => t.fullName)
                  .join(', ');
      
    } else {
      return 'N/A';
    }
  }

  const [getPatientsData] = useLazyQuery<
    GetOnlyNamedPatients,
    GetOnlyNamedPatientsVariables
  >(getPatientsListForCounsellor, {
    onCompleted: (d) => {
      if (d?.pretaaHealthGetOnlyNamedPatients) {
        gridApi?.hideOverlay();
        const rowListData = d?.pretaaHealthGetOnlyNamedPatients.map((f) => {
          return {
            id: f.id,
            firstName: f.firstName ? f.firstName : 'N/A',
            lastName: f.lastName ? f.lastName : 'N/A',
            email: f.email || 'N/A',
            careTeam: f.PatientContactList ? careTeamSetup(f.PatientContactList.careTeams) : 'N/A',
            gender: Humanize.capitalize(f.patientDetails?.gender || 'N/A'),
            genderIdentity: f.patientDetails?.genderIdentity || 'N/A',
          };
        });

        setRowData(rowListData);
        updatePatientRows(
          d?.pretaaHealthGetOnlyNamedPatients.map((f, i) => {
            gridApi?.hideOverlay();
            return {
              id: f.id,
              firstName: f.firstName ? f.firstName : 'N/A',
              lastName: f.lastName ? f.lastName : 'N/A',
              email: f.email || 'N/A',
              gridRowId: String(i),
              careTeam: f.PatientContactList ? careTeamSetup(f.PatientContactList.careTeams) : 'N/A',
              patientStatus: onPatientStatus(f.patientDetails?.inPatient),
              gender: Humanize.capitalize(f.patientDetails?.gender || 'N/A'),
              genderIdentity: f.patientDetails?.genderIdentity || 'N/A',
            };
          })
        );

        if (d.pretaaHealthGetOnlyNamedPatients.length === 0) {
          gridApi?.hideOverlay();
          gridApi?.showNoRowsOverlay();
        }
      } else if (gridApi) {
        gridApi?.showNoRowsOverlay();
        gridApi?.hideOverlay();
        setRowData([]);
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [
    getTemplateData,
    { data: templateData, loading: templateDataLoading },
  ] = useLazyQuery<
    GetSurveyTemplateForPatient,
    GetSurveyTemplateForPatientVariables
  >(getSurveyTemplateForPatientQuery, {
    onError: (e) => catchError(e, true),
  });

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e.api);
    e.api?.showLoadingOverlay();
  };

  useEffect(() => {
    selectRowsOfAgGrid(gridApi, selectedRow);
  }, []);

  useEffect(() => {
    getTemplateData({
      variables: {
        templateId: String(templateId),
      },
    });
  }, [templateId]);

  useEffect(() => {

    if (gridApi) {
      gridApi.showLoadingOverlay();
    }
    if (inCensus || discharge) {
      getPatientsData({
        variables: {
          search: searchFieldData,
          facilityId: selectedFacilityId ? selectedFacilityId : null,
          take: config.pagination.defaultAgGridTake,
          inPatient: (inCensus ? true : null) || (discharge ? false : null)
        },
      });
    }
 
  }, [searchFieldData, inCensus, discharge, gridApi, selectedFacilityId]);

  useEffect(() => {
    if (adhocData?.assessmentAssignmentList) {
      dispatch(
        appSliceActions.setSelectedPatientRows(
          adhocData?.assessmentAssignmentList
        )
      );
    }
  }, [adhocData]);

  const { adhocLoading } = useGetAdhocAssessment();

  // Send assessment to the selected patient
  const [createAssessmentForCounsellor, { loading: creatingAssessment }] =
    useMutation<CreateSurvey, CreateSurveyVariables>(sendPatientSurvey);

  const [editAssessmentForCounsellor, { loading: editingAssessment }] =
    useMutation<
      UpdatePatientListForSurvey,
      UpdatePatientListForSurveyVariables
    >(patientListUpdateForSurvey);


    const onSchedulingMsg = () => {
      if (scheduleAt) {
        toast.success(messagesData.successList.assessmentScheduled);
      } else {
        toast.success(messagesData.successList.assessmentSendToPatient);
      }
    };

  const handleSubmit = () => {
    const selectedPatients = selectedRow?.map(
      (v: SentToPatientSelectedRows) => {
        return {
          patientId: v.id,
        };
      }
    ) as SurveyAssignmentCreatePatientSetArgs[];

    const variables = {
      assignmentPatientIds: selectedPatients,
      sendNow: sendNow,
      scheduledAt: sendNow ? null : scheduleAt,
      campaignSurveySignature: campaignSurveySignature,
      facilityId: selectedFacilityId,
    };

    if (assessmentId) {
      editAssessmentForCounsellor({
        variables: {
          ...variables,
          surveyId: String(assessmentId),
        },
        onCompleted: (data) => {
          if (data.pretaaHealthUpdateSurvey) {
            onSchedulingMsg();
            navigate(
              routes.assessmentTemplateDetails.build(String(templateId))
            );
          }
        },
        onError: (e) => catchError(e, true),
      });
    } else {
      createAssessmentForCounsellor({
        variables: {
          ...variables,
          scheduledAt: scheduleAt ? formatDate({ date: scheduleAt }) : null,
          surveyTemplateId: String(templateId),
        },
        onCompleted: (data) => {
          if (data.pretaaHealthCreateSurvey) {
            onSchedulingMsg();
            navigate(
              routes.assessmentTemplateDetails.build(String(templateId))
            );
          }
        },
        onError: (e) => catchError(e, true),
      });
    }
  };

  // to remove error message
  useEffect(() => {
    if (selectedFacilityId) {
      setErrorMessage('');
    } else if (selectedRow.length > 0) {
      setErrorMessage('');
      if (sendNow || scheduleAt || selectedFacilityId) {
        setErrorMessage('');
      }
    }
    
  }, [sendNow, scheduleAt, selectedRow, selectedFacilityId, selectedFacilityId]);

  return (
    <>
      <ContentHeader
        className="lg:py-5"
        link={routes.assessmentTemplateDetails.build(String(templateId))}>
        <div className="flex flex-col">
          <div className="block md:flex justify-between">
            <h1 className="h1 text-primary font-bold text-md lg:text-lg md:w-1/2">Select Patients</h1>
            <div className="overflow-hidden mb-4 md:mb-0 flex flex-col justify-items-start">
              <span className="text-gray-600 mb-1 text-sm font-medium md:flex flex-col items-end">Template Name</span>

              {templateDataLoading && (
                <Skeleton
                  width={window.innerWidth < 640 ? '90%' : 400}
                  height={24}
                  mt={4}
                />
              )}
              {!templateDataLoading && (
                <h2 className="text-primary text-md font-normal truncate break-all capitalize">
                  {templateData?.pretaaHealthGetTemplate?.name || 'N/A'}
                </h2>
              )}
            </div>
          </div>
          <div className={`${isMultipleFacilitySelected ? 'mt-6' : 'mt-0'} flex md:flex-row flex-col md:items-center justify-start items-start md:justify-between`}>
            <div className={`${isMultipleFacilitySelected  ? 'md:space-x-5 2xl:space-x-10' : 'md:space-x-10'} md:flex  items-center `}>
              <div>
                <SearchField
                  defaultValue={searchFieldData}
                  onChange={(e) => setSearchFieldData(e)}
                />
              </div>
              {!assessmentId && (
                <div className=''>

          <SelectedFacilityList
            dropdownHeight={39}
            onInt={setIsRequired}
            labelStyle="font-bold text-pt-primary"
            dropdownStyle="w-58 xl:w-72"
            onChange={(e) => {
              setSelectedFacilityId(e);
              dispatch(appSliceActions.setSelectedPatientRows([]));
            }}
          />
          </div>
        )}

              <div className={`${isMultipleFacilitySelected  ?  'xl:flex' : 'md:flex'} gap-5 whitespace-nowrap lg:gap:2 2xl:gap-10 mt-4 md:mt-0`}>
                <div className={`${isMultipleFacilitySelected  ? 'md:pb-2 xl:pb-0' : 'md:pb-0' } flex items-center pb-2`}>
                  <label>
                    <input
                      checked={inCensus}
                      onChange={(e) => {
                        setInCensus(e.target.checked);
                        setDischarge(false);
                      }}
                      type="checkbox"
                      className={`appearance-none h-5 w-5 border
  border-primary-light
  checked:bg-primary-light checked:border-transparent
  rounded-md form-tick`}
                    />
                    <span className="pl-4 font-medium text-base">In Census</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label>
                    <input
                      checked={discharge}
                      onChange={(e) => {
                        setDischarge(e.target.checked);
                        setInCensus(false);
                      }}
                      type="checkbox"
                      className={`appearance-none h-5 w-5 border
border-primary-light
checked:bg-primary-light checked:border-transparent
rounded-md form-tick`}
                    />
                    <span className="pl-4 font-medium text-base">Discharged</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentHeader>

      <ContentFrame className="h-2/3 overflow-x-scroll pb-48 md:pb-0">

        {selectedRow.length > 0 && (
          <div className="flex flex-row md:mb-3 mt-4 flex-wrap space-x-2 space-y-1 items-center">
            {getSelectedPatientBadgeList(selectedRow, getPatientBadge)}
            {selectedRow.length > 10 && <div>and {selectedRow.length - 10} patients</div>}
          </div>
        )}

        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          rowSearch={() => {
            dispatch(appSliceActions.setSelectedPatientRows(selectedRow.concat([])));
          }}
        />
      </ContentFrame>
      <div className="mt-56 lg:mt-48">
        <ContentFooter className="fixed bottom-0 w-full">
          <div>
            <ScheduleAssessmentForm errorMessage={errorMessage} />
            <div className="flex flex-col w-full md:flex-row md:items-end ">
              <div className="flex flex-col md:flex-row md:items-end">
                {adhocLoading && (
                  <Skeleton
                    width={150}
                    height={28}
                  />
                )}
                {!adhocLoading && (
                  <Button
                    loading={creatingAssessment || editingAssessment}
                    disabled={creatingAssessment || editingAssessment}
                    onClick={() => {
                       if (isRequired && !selectedFacilityId) {
                        setErrorMessage('Please select facility from the dropdown');
                       } else if (selectedRow.length === 0) {
                        setErrorMessage('Please select at least one patient');
                      } else if (!sendNow && !scheduleAt) {
                        setErrorMessage('Please select now or assessment date');
                      } else {
                        handleSubmit();
                      }
                    }}
                    text={`${scheduleAt ? 'Schedule' : 'Send'}`}
                    type="submit"
                    className="mt-3 md:mt-0"
                  />
                )}
              </div>

              <Button
                onClick={() => navigate(routes.assessmentTemplateDetails.build(String(templateId)))}
                text="Cancel"
                type="button"
                buttonStyle="other"
                className="text-gray-700"
              />
            </div>
          </div>
        </ContentFooter>
      </div>
    </>
  );
}
