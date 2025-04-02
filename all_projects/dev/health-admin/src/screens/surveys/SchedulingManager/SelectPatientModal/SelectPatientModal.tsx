import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useDebouncedState } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { AgGridReact } from '@ag-grid-community/react';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from '@ag-grid-community/core';
import { Skeleton } from '@mantine/core';
import Humanize from 'humanize-plus';

import { ContentFooter } from 'components/content-footer/ContentFooter';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { getPatientsForMobileTemplate } from 'graphql/getPatientsMobileTemplate.query';
import {
  GetOnlyNamedPatientsForCampaign,
  GetOnlyNamedPatientsForCampaignVariables,
  GetOnlyNamedPatients_pretaaHealthGetOnlyNamedPatients_PatientContactList_careTeams,
  GetSurveyTemplateForPatient,
  GetSurveyTemplateForPatientVariables
} from 'health-generatedTypes';
import { config } from 'config';
import catchError from 'lib/catch-error';
import SearchField from 'components/SearchField';
import { getSurveyTemplateForPatientQuery } from 'graphql/getSurveyTemplateForPatient.query';
import AgGrid from 'components/ag-grid/AgGrid';
import { fullNameController } from 'components/fullName';
import CloseIcon from 'components/icons/CloseIcon';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';
import FirstNameRowRenderer from './FirstNameRowRenderer';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import HeaderRowRenderer from './HeaderRowRenderer';
import { removeRowSelection } from 'components/ag-grid/remove-row-selection';
import './_select-patient-modal.scoped.scss';

export interface RowInterface {
  id: string;
  firstName: string;
  lastName: string;
}

export function selectRowsOfAgGrid(gridApiRef: GridApi | null, list: RowInterface[]) {
  // selecting the row
  let selectedRowCount = 0;
  if (gridApiRef) {
    gridApiRef?.forEachNode((node) => {
      if (selectedRowCount === list.length) {
        return;
      }
      if (!!list.find((row) => row.id === node.data.id)) {
        node.setSelected(true);
        selectedRowCount++;
      }
    });
  }
}

export default function SelectPatientModal({
  onClose,
  onSubmit,
  patientListData,
  surveyTemplateId,
  isEditable,
  selectedFacilityId
}: {
  onClose?: () => void;
  onSubmit: () => void;
  patientListData?: any;
  surveyTemplateId?: string;
  isEditable?: boolean;
  selectedFacilityId?: string
}) {
  const { templateId, campaignId, duplicateId } = useParams();
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact>(null);
  const { setValue } = useForm();
  const [inCensus, setInCensus] = useState(true);
  const [discharge, setDischarge] = useState(false);
  const [searchFieldData, setSearchFieldData] = useDebouncedState('', 700);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<RowInterface[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedRow =
    useAppSelector((state) => state.app.sentToPatient.selectedRows) || [];
  const selectedPatientRow =
    useAppSelector((state) => state.app.sentToPatient.selectedPatientRow) || [];

  function firstNameRowRenderController(props: ICellRendererParams) {
    return (
      <FirstNameRowRenderer
        props={props}
        gridApi={gridRef.current?.api}
        patientListData={patientListData}
        isEditable={isEditable}
      />
    );
  }

  function updateSelectedRows(updatedRow: SentToPatientSelectedRows[]) {
    dispatch(appSliceActions.setSelectedPatientRows(updatedRow));
  }

  function updatePatientRows(updatedRow: SentToPatientSelectedRows[]) {
    dispatch(appSliceActions.setAllPatientRows(updatedRow));
  }

  function headerComponentController(gApi:AgGridReact) {
    return <HeaderRowRenderer gridApi={gApi} isEditable={isEditable} />;
  }

  const [columnDefs] = useState<ColDef[] | any>([
    {
      maxWidth: 80,
      headerName: '',
      headerComponent: (gApi: AgGridReact) =>  headerComponentController(gApi),
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
        className="flex items-center space-x-1 md:space-x-2 py-1 md:py-1.5 px-1 md:px-4 rounded-full bg-gray-300 text-xxs md:text-sm">
        <span>
          {fullName.substring(0, 30)}
          {`${fullName.length >= 30 ? '...' : ''}`}
        </span>
        {isEditable && (
          <button
            type="button"
            className="p-1 md:p-2 bg-gray-100 rounded-full"
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
  GetOnlyNamedPatientsForCampaign,
  GetOnlyNamedPatientsForCampaignVariables
  >(getPatientsForMobileTemplate, {
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
    setValue('search', searchFieldData);
  }, [setRowData, setValue]);

  useEffect(() => {
    if (gridApi) {
      gridApi.showLoadingOverlay();
    }

    if (!inCensus && !discharge) {
      getPatientsData({
        variables: {
          search: searchFieldData,
          facilityId: selectedFacilityId ? selectedFacilityId : null,
          take: config.pagination.defaultAgGridTake,
        },
      });
    } else {
      getPatientsData({
        variables: {
          search: searchFieldData,
          facilityId: selectedFacilityId ? selectedFacilityId : null,
          take: config.pagination.defaultAgGridTake,
          inPatient: inCensus
        },
      });
    }
 
  }, [searchFieldData, inCensus, discharge, gridApi, selectedFacilityId]);

  useEffect(() => {
    selectRowsOfAgGrid(gridApi, selectedRow);
  }, [patientListData]);

  useEffect(() => {
    getTemplateData({
      variables: {
        templateId: String(templateId || surveyTemplateId),
      },
    });
  }, []);

  // remove error message
  useEffect(() => {
    if (selectedRow.length) {
      setErrorMessage('');
    }
  }, [selectedRow]);

  // set patient state on edit and duplicate campaign
  useEffect(() => {
    if (duplicateId || isEditable) {
      dispatch(appSliceActions.setSelectedPatientRows(selectedPatientRow));
      updateSelectedRows(selectedPatientRow);
    } else if (!isEditable) {
      dispatch(appSliceActions.setSelectedPatientRows(patientListData));
    }
  }, []);

  return (
    <div className="h-full modal-parent">
      <ContentHeader
        className="lg:py-5 pt-0"
        disableGoBack={true}>
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
                <h2 className="text-primary text-xl md:text-md font-normal truncate break-all capitalize">
                  {templateData?.pretaaHealthGetTemplate?.name || 'N/A'}
                </h2>
              )}
            </div>
          </div>

          <div className="flex md:flex-row flex-col md:items-center justify-start items-start md:justify-between">
            <div className="md:flex md:space-x-10 items-center">
              <div>
                <SearchField
                  defaultValue={searchFieldData}
                  onChange={(e) => setSearchFieldData(e)}
                />
              </div>
              <div className="flex gap-5 md:gap-10 mt-4 md:mt-0">
                <div className="flex items-center">
                  <label>
                    <input
                      checked={inCensus}
                      onChange={(e) => {
                        setInCensus(e.target.checked);
                        setDischarge(false);
                      }}
                      type="checkbox"
                      className={`appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent rounded-md form-tick`}
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
                      className={`appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent rounded-md form-tick`}
                    />
                    <span className="pl-4 font-medium text-base">Discharged</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentHeader>
      <ContentFrame className="h-3/5 pb-2 pt-2 overflow-hidden overflow-y-scroll">
        <div className="flex flex-row md:mb-4 flex-wrap space-x-1 md:space-x-2 space-y-1 items-center text-xxs md:text-sm">
          {getSelectedPatientBadgeList(selectedRow, getPatientBadge)}
          {selectedRow.length > 10 && <div>and {selectedRow.length - 10} patients</div>}
        </div>

        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          rowSearch={() => {
            dispatch(appSliceActions.setSelectedPatientRows(selectedRow.concat([])));
          }}
        />
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <div></div>
      </ContentFrame>

      <ContentFooter>
        <div className="flex w-full flex-row items-end">
          <div className="flex flex-col md:flex-row md:items-end">
            <Button
              text={`${!isEditable ? 'Back' : 'Continue'}`}
              type="button"
              className="mt-3 md:mt-0"
              onClick={() => {
                if (!selectedRow.length && !campaignId) {
                  setErrorMessage('Please select a patient');
                } else if (!isEditable) {
                  onSubmit();
                } else {
                  dispatch(appSliceActions.setSelectedPatientList(selectedRow));
                  onSubmit();
                }
              }}
            />
          </div>
          {isEditable && (
            <Button
              text="Cancel"
              type="button"
              buttonStyle="other"
              onClick={onClose}
              className="text-gray-700"
            />
          )}

        </div>
      </ContentFooter>
    </div>
  );
}
