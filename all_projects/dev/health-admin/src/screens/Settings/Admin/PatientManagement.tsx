import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import { Controller, useForm } from 'react-hook-form';
import { useElementSize, useViewportSize } from '@mantine/hooks';
import { ColDef, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { config } from 'config';
import { RxCross2 } from 'react-icons/rx';
import { FaCopy } from 'react-icons/fa';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  InvitePatients,
  InvitePatientsVariables,
  PatientsForAgGrid,
  PatientsForAgGridVariables,
  UserInvitationOptions,
  PatientsForAgGrid_pretaaHealthGetPatients,
  BulkInvitePatientsVariables,
  BulkInvitePatients,
  GetFacilityId,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  CareTeamTypes,
  ExportPatientList,
} from 'health-generatedTypes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import AgGrid from '../../../components/ag-grid/AgGrid';
import { routes } from 'routes';
import { useNavigate } from 'react-router-dom';
import './PatientManagement.scss';
import { format } from 'date-fns';
import Button from 'components/ui/button/Button';
import { invitePatientMutation } from 'graphql/invitePatient.mutation';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import catchError, { getGraphError } from 'lib/catch-error';
import Popup from 'reactjs-popup';
import { patientManagementQuery } from 'graphql/patient-list.query';
import { fullNameController } from 'components/fullName';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { debounce } from 'lodash';
import {
  ClinicianDetailsInterface,
  ClinicianTypeDropDown,
} from './PatientManagement/components/ClinicianTypeUpdate/ClinicianTypeDropDown';
import { FriendsAndFamilyEnum, PatientManagementRow } from './PatientLIst/PatientManagement.interface';
import { useAppSelector } from 'lib/store/app-store';
import useDeleteFacilityUsersByFacilityAdmin from 'customHooks/useDeleteFacilityUsersByFacilityAdmin';
import { toast } from 'react-toastify';
import ConfirmationDialog from 'components/ConfirmationDialog';
import messagesData from 'lib/messages';
import { DeletePatientOrStaffStateInterfaceByFacilityAdmin } from '../interface/DeletePatientOrStaffStateInterfaceByFacilityAdmin';
import { ErrorMessage, SuccessMessage } from 'components/ui/error/ErrorMessage';
import { bulkInvitePatientsMutation } from 'graphql/bulkInvitePatients.mutation';
import { AgGridCheckboxContextData } from '../Employee/components/EmployeeList/AgGridCheckboxContext';
import { Skeleton } from '@mantine/core';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';
import CustomSearchField from 'components/CustomSearchField';
import { getFacilityId } from 'graphql/get-facility-id.query';
import useSourceSystemPatientField from './PatientManagement/useSourceSystemPatientField';
import PatientGridGenericColumn from './PatientManagement/components/PatientGridGenericColumn';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import EditCellPopOver from './PatientManagement/components/EditCellPopOver';
import {
  BulkEmailInviteStateInterface,
  PatientListHeader,
  PatientNameComponent,
  deletePatient,
  emailSchema,
  onPatientStatus
} from './PatientManagement/helper/PatientManagementHelper';
import StatusDropdown, { CustomPatientType, StatusType } from './PatientManagement/components/StatusDropdown';
import { AgGridHeaderName, updateColumnsAndSetDefs } from './PatientManagement/components/CommonColumnConfig';
import { formatDate } from 'lib/dateFormat';
import { exportPatientList } from 'graphql/exportPatientList.query';
import Humanize from 'humanize-plus';
import { getAppData } from 'lib/set-app-data';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';


export default function PatientManagement() {
  const navigate = useNavigate();
  const [searchedPhase, setSearchedPhase] = useState('');
  const { ref, height } = useElementSize();
  const facilitySourceSystem = useAppSelector((state) => state.auth.facilitySourceSystem);
  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;
  const { height: viewPortHeight } = useViewportSize();
  const appData = getAppData();

  const [isFilter, setIsFilter] = useState(false);
  const [openCopyModal, setOpenCopyModal] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [patientButtonOff, setPatientButtonOff] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState<PatientManagementRow[]>([]);
  const [isRequired, setIsRequired] = useState<boolean>();
  const [deletePatientState, setDeletePatientState] = useState<DeletePatientOrStaffStateInterfaceByFacilityAdmin>({
    modalState: false,
    selectedPatient: null,
  });

  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });
  const [bulkEmailInviteState, setBulkEmailInviteState] = useState<BulkEmailInviteStateInterface>({
    modalState: false,
  });

  const { data: facilityResponse } = useQuery<GetFacilityId, GetFacilityId>(getFacilityId, {
    onError: (e) => catchError(e, true),
  });

  const facilityName = facilityResponse?.pretaaHealthCurrentUser?.employeeMeta?.facilities;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm();

  const { callApi: callDeletePatientApi, loading: deleteFacilityUsersLoadingState } =
    useDeleteFacilityUsersByFacilityAdmin(() => {
      toast.success(messagesData.successList.deletedSuccessful('Patient'));
      setRowData((prevState) => prevState.filter((row) => !deletePatientState.selectedPatient?.includes(row.id)));
      setDeletePatientState(() => ({ modalState: false, selectedPatient: null }));
    });

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.PATIENT_MANAGEMENT,
    },
    onError: (e) => catchError(e, true),
  });


  const [getPatientsData, { data: patients, loading: patientsDataLoading }] = useLazyQuery<
    PatientsForAgGrid,
    PatientsForAgGridVariables
  >(patientManagementQuery, {
    onCompleted: (d) => {
      const list = d?.pretaaHealthGetPatients;
      if (list) {
        setGridPagination({ prev: noOfPage > 1, next: list.length === config.pagination.defaultAgGridTake });
        const row = list.map((el) => {
          return {
            id: el.id,
            name: fullNameController(el.firstName, el.lastName),
            gender: (el.patientDetails?.gender === 'null' || el.patientDetails?.gender === 'undefined' || el.patientDetails?.gender === 'Null') ? 'N/A' : Humanize.capitalize(el.patientDetails?.gender || 'N/A'),
            genderIdentity: el.patientDetails?.genderIdentity || 'N/A',
            patientTimezone: el.patientTimezone ? el.patientTimezone : null,
            dob: formatDate({
              date: el.patientDetails?.dob,
              formatStyle: 'agGrid-date',
            }),
            race: el.patientDetails?.race || 'N/A',
            ethnicity: el.patientDetails?.ethnicity || 'N/A',
            addressStreet: el.patientDetails?.addressStreet || 'N/A',
            addressStreet2: el.patientDetails?.addressStreet2 || 'N/A',
            addressCity: el.patientDetails?.addressCity || 'N/A',
            addressCountry: el.patientDetails?.addressCountry || 'N/A',
            anticipatedDischargeDate: formatDate({
              date: el.patientDetails?.anticipatedDischargeDate,
              formatStyle: 'agGrid-date',
            }),
            state: el.patientDetails?.state || 'N/A',
            addressZip: el.patientDetails?.addressZip || 'N/A',
            email: el.email || 'N/A',
            intakeDate: formatDate({
              date: el.patientDetails?.admissionDate,
              timeZone: el.patientTimezone,
              formatStyle: 'agGrid-date',
            }),
            dischargeType: el.patientDetails?.dischargeType || 'N/A',
            dischargeDate: formatDate({
              date: el.patientDetails?.dischargeDate,
              timeZone: el.patientTimezone,
              formatStyle: 'agGrid-date',
            }),
            inPatient: onPatientStatus(el.patientDetails?.inPatient),
            firstContactName: el.patientDetails?.firstContactName || 'N/A',
            referrerName: el.patientDetails?.referrerName || 'N/A',
            insuranceCompany: el.patientDetails?.insuranceCompany || 'N/A',
            phone: el.patientDetails?.phone || 'N/A',
            levelOfCare: el.patientDetails?.levelOfCare || 'N/A',
            buildingName: el.patientDetails?.building?.name || 'N/A',
            locationName: el.patientDetails?.patientLocation?.locationName || 'N/A',
            maidenName: el.patientDetails?.maidenName || 'N/A',
            dateOfOnboarding: formatDate({ date: el.createdAt, formatStyle: 'agGrid-date' }),
            active: el.active,
            status: el.active ? StatusType.ACTIVE : StatusType.INACTIVE,
            emrSyncTime: formatDate({
              date: el.patientDetails?.emrSyncTime,
              timeZone: el.patientTimezone,
              formatStyle: 'agGrid-date',
            }),
            emergencyContact:
              el.PatientContactList?.patientContacts
                ?.map((i) => i.fullName || null)
                .filter((i) => i?.length)
                .join(', ') || 'N/A',
            friendsAndFamily: el.PatientContactList?.suppoters?.map((x) => x.firstName || null)?.length
              ? FriendsAndFamilyEnum.YES
              : FriendsAndFamilyEnum.NO,
            lastLogin: el.lastLoginTime ? format(new Date(+el.lastLoginTime), config.agGridDateFormat) : null,
            lastSyncTime: el.patientDetails?.lastSyncTime
              ? formatDate({ date: el.patientDetails.lastSyncTime, formatStyle: 'agGrid-date' })
              : null,
            lastDailyReportAt: el.patientDetails?.lastDailyReportAt
              ? formatDate({ date: el.patientDetails.lastDailyReportAt, formatStyle: 'agGrid-date' })
              : null,
            lastWeeklyReportAt: el.patientDetails?.lastWeeklyReportAt
              ? formatDate({ date: el.patientDetails.lastWeeklyReportAt, formatStyle: 'agGrid-date' })
              : null,
            lastMonthlyReportAt: el.patientDetails?.lastMonthlyReportAt
              ? formatDate({ date: el.patientDetails.lastMonthlyReportAt, formatStyle: 'agGrid-date' })
              : null,
            kipuVerified: el.kipuVerified ? formatDate({ date: el.kipuVerified, timeZone: el.patientTimezone, formatStyle: 'agGrid-date' }) : null,
            trackLocation: el?.trackLocation ? el.trackLocation.replaceAll('_', ' ') : 'N/A',
            invitationStatus: el.invitationStatus,
            caseManager: (el.caseManager as ClinicianDetailsInterface) || null,
            caseManagerCol: `${el.caseManager?.firstName || 'N/A'} ${el.caseManager?.lastName || ' '}`,
            primaryTherapists: (el.primaryTherapist as ClinicianDetailsInterface) || null,
            primaryTherapistsCol: `${el.primaryTherapist?.firstName || 'N/A'} ${el.primaryTherapist?.lastName || ' '}`,
            careTeamsCol: el.PatientContactList?.careTeams,
            facilityName: el.facility.name || 'N/A',
          };
        });
        setRowData(row);
      }
    },
  });

  useAgGridOverlay({
    detailsLoading: patientsDataLoading,
    gridApi,
    list: patients?.pretaaHealthGetPatients || undefined,
  });

  // to invite patient
  const [
    invitePatientCallBack,
    { reset: invitePatientResponseReset, loading: invitePatientLoading, data: invitePatientResponse },
  ] = useMutation<InvitePatients, InvitePatientsVariables>(invitePatientMutation, {
    onCompleted: () => setDialogOpen(true),
    onError: (e) => catchError(e, true),
  });

  const [updatePatientColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );

  const [sendBulkInviteCallBack, { loading: sendBulkInviteLoading }] = useMutation<
    BulkInvitePatients,
    BulkInvitePatientsVariables
  >(bulkInvitePatientsMutation, {
    onCompleted: () => {
      setBulkEmailInviteState((prevState) => ({
        ...prevState,
        errorMessage: null,
        successMessage: messagesData.successList.invitationSent,
      }));
      setValue('blkEmail', '  ');
      trigger('blkEmail');
    },
    onError: (e) =>
      setBulkEmailInviteState((prevState) => ({
        ...prevState,
        errorMessage: getGraphError(e.graphQLErrors).join(','),
        successMessage: null,
      })),
  });

  //export patient list
  const [getPatientExcelSheet, { loading: loadingExport }] = useLazyQuery<ExportPatientList>(exportPatientList, {
    onError: (e) => catchError(e, true)
  });

  function getListData(skip: number) {
    getPatientsData({
      variables: {
        search: searchedPhase,
        skip,
        take: config.pagination.defaultAgGridTake,
      },
    });
  }

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const rowSelection = ({
    data,
    isSelected,
  }: {
    data: PatientsForAgGrid_pretaaHealthGetPatients;
    isSelected: boolean;
  }) => {
    const rows = gridApi?.api.getSelectedRows() as any[];
    if (rows.length > 0) {
      const getNonRegisteredPatients = rows?.filter((e) => {
        return e.invitationStatus !== UserInvitationOptions.REGISTERED;
      });
      if (getNonRegisteredPatients && getNonRegisteredPatients.length > 0) {
        setSelectedRows(getNonRegisteredPatients?.map((e) => e.id as string));
        setPatientButtonOff(true);
      } else {
        setPatientButtonOff(false);
      }
    } else {
      setPatientButtonOff(false);
    }
  };

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updatePatientColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.PATIENT_MANAGEMENT,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  const handleCopyClick = (facilityId?: string | null) => {
    const copyString = `${origin}/authenticate-with-fhs?facility=${facilityId}`;
    navigator.clipboard
      .writeText(copyString)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => catchError(err, true));
  };

  const handleOpenCopyModal = () => {
    setOpenCopyModal(!openCopyModal);
  };

  function loadMore(type: 'prev' | 'next', e: any) {
    if (type === 'next') {
      getListData(noOfPage * config.pagination.defaultAgGridTake);
      setNoOfPage((p) => p + 1);
    } else {
      getListData((noOfPage - 2) * config.pagination.defaultAgGridTake);
      setNoOfPage((p) => p - 1);
    }
  }
  const onBtExport = () => {
    getPatientExcelSheet();
    gridApi?.api.exportDataAsExcel({
      fileName: 'patient-list',
      sheetName: 'patient-list'
    });
  };

  const onSubmit = (data: any) => {
    const { blkEmail } = data as unknown as { blkEmail: string | undefined };
    if (!blkEmail?.length) {
      setError('blkEmail', { message: 'Please enter email to continue ', type: 'required' });
      return;
    }

    const inValidEmails: string[] = [];

    const emailList = blkEmail?.split(',').map((email: string) => email.trim());
    emailList?.forEach((email: string) => {
      if (!emailSchema.isValidSync(email)) {
        inValidEmails.push(email);
      }
    });

    if (inValidEmails.length) {
      setError('blkEmail', { message: `Invalid emails - ${inValidEmails.join(',')}`, type: 'pattern' });
      return;
    }
    sendBulkInviteCallBack({
      variables: { emails: emailList, facilityId: getValues('facilityId') },
    });
  };

  function primaryTherapists(props: CustomPatientType) {
    return (
      <ClinicianTypeDropDown
        updateRows={setRowData}
        props={props}
        type={CareTeamTypes.PRIMARY_THERAPIST}
      />
    );
  }

  function caseManager(props: CustomPatientType) {
    return (
      <ClinicianTypeDropDown
        updateRows={setRowData}
        props={props}
        type={CareTeamTypes.PRIMARY_CASE_MANAGER}
      />
    );
  }

  function updatedStatus(props: CustomPatientType) {
    return (
      <StatusDropdown
        updatedRowsValue={setRowData}
        props={props}
      />
    );
  }

  // to get ag grid filtered data
  const { filterData, isFilterChanged, setFilterData } = useContext(AgGridCheckboxContextData);
  const isRegisteredPatient = filterData.find((e) => e === UserInvitationOptions.REGISTERED);

  useEffect(() => {
    if (selectedRows.length > 0 && isFilterChanged && isRegisteredPatient) {
      setIsFilter(true);
    } else if (selectedRows.length > 0 && !isFilterChanged) {
      setIsFilter(false);
      setFilterData([]);
    } else {
      setIsFilter(false);
    }
  }, [filterData, selectedRows.length, isFilterChanged]);

  const { agGridHeaderNames } = useSourceSystemPatientField();

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;

    const columns: any = [];

    agGridHeaderNames.forEach((col) => {
      const colD: any = {
        field: col,
        filter: 'agTextColumnFilter',
        cellRenderer: PatientGridGenericColumn,
        filterParams: {
          buttons: ['clear'],
        }
      };

      if (col === PatientListHeader.name) {
        colD.cellRenderer = ({ data }: { data: any }) => (
          <PatientNameComponent
            data={data}
            loading={deleteFacilityUsersLoadingState}
            deletePatientState={deletePatientState}
            setDeletePatientState={setDeletePatientState}
          />
        );
        colD.headerCheckboxSelection = isFilter ? false : true;
        colD.checkboxSelection = true;
        colD.showDisabledCheckboxes = true;
        colD.sortable = true;
        colD.cellClass = 'text-pt-blue-300 lock-pinned';
        colD.suppressNavigable = true;
        colD.lockPosition = window.innerWidth >= 640 ? 'left' : 'none';
        colD.pinned = window.innerWidth >= 640 ? 'left' : 'none';
        colD.lockPinned = window.innerWidth >= 640;
        colD.lockVisible = window.innerWidth >= 640;
      }

      if (col === PatientListHeader.inPatient) {
        colD.headerName = 'Patient Status'
      }

      if (
        col === PatientListHeader.dischargeDate ||
        col === PatientListHeader.dob ||
        col === PatientListHeader.intakeDate ||
        col === PatientListHeader.anticipatedDischargeDate ||
        col === PatientListHeader.dateOfOnboarding ||
        col === PatientListHeader.emrSyncTime ||
        col === PatientListHeader.lastLogin ||
        col === PatientListHeader.lastSyncTime ||
        col === PatientListHeader.lastDailyReportAt ||
        col === PatientListHeader.lastWeeklyReportAt ||
        col === PatientListHeader.lastMonthlyReportAt ||
        col === PatientListHeader.kipuVerified
      ) {
        colD.filter = 'agDateColumnFilter';
        colD.filterParams = {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        }
      }

      if (col === PatientListHeader.gender || col === PatientListHeader.inPatient
        || col === PatientListHeader.active || col === PatientListHeader.invitationStatus || 
        col === PatientListHeader.trackLocation || col === PatientListHeader.friendsAndFamily) {
        colD.filter = 'agSetColumnFilter'
        colD.filterParams = {
          button: []
        }
      }

      if (col === PatientListHeader.dob) {
        colD.headerName = 'Date of Birth';
      }

      if (col === PatientListHeader.email) {
        colD.width = 260;
      }

      if (col === PatientListHeader.primaryTherapistsCol) {
        colD.cellRenderer = primaryTherapists;
        colD.headerName =
          careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST]?.updatedValue ||
          careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST]?.defaultValue ||
          'Primary Therapist';
        colD.width = 250;
      }

      if (col === PatientListHeader.caseManagerCol) {
        colD.cellRenderer = caseManager;
        colD.headerName =
          careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER]?.updatedValue ||
          careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER]?.defaultValue ||
          'Case Manager';
        colD.width = 250;
      }

      if (col === PatientListHeader.intakeDate) {
        colD.headerName = 'Admission Date';
      }

      if (col === PatientListHeader.dischargeDate) {
        colD.width = 230;
      }

      if (col === PatientListHeader.addressStreet) {
        colD.headerName = 'Street';
      }

      if (col === PatientListHeader.addressStreet2) {
        colD.headerName = 'Street2';
      }

      if (col === PatientListHeader.addressCity) {
        colD.headerName = 'City';
      }

      if (col === PatientListHeader.addressCountry) {
        colD.headerName = 'Country';
      }

      if (col === PatientListHeader.addressZip) {
        colD.headerName = 'Zip';
      }

      if (col === PatientListHeader.dateOfOnboarding) {
        colD.headerName = 'Pretaa Start Date';
      }

      if (col === PatientListHeader.active) {
        colD.headerName = 'Status';
        colD.valueGetter = (params: any) => {
          if (params?.data?.status) {
            return params?.data?.status;
          }
        };
        colD.cellRenderer = updatedStatus;
      }

      if (col === PatientListHeader.lastDailyReportAt) {
        colD.headerName = 'Last Daily Report On';
        colD.width = 250;
      }

      if (col === PatientListHeader.lastWeeklyReportAt) {
        colD.headerName = 'Last Weekly Report On';
        colD.width = 250
      }

      if (col === PatientListHeader.lastMonthlyReportAt) {
        colD.headerName = 'Last Monthly Report On';
        colD.width = 250
      }

      if (col === PatientListHeader.kipuVerified) {
        colD.headerName = 'EMR Verified';
      }

      if (col === PatientListHeader.friendsAndFamily) {
        colD.headerName =  'Friends/Family'
       
      }

      if (col === PatientListHeader.lastSyncTime) {
        colD.headerName =  'Last Device Sync Time';
        colD.width = 250
      }

      if (col === PatientListHeader.facilityName) {
        colD.hide = appData.selectedFacilityId?.length === 1;
        colD.suppressColumnsToolPanel = appData.selectedFacilityId?.length === 1
      }

      columns.push(colD);
    });

    setColumnDefs(columns);

    const mandatoryCol = {
      field: '',
      headerName: '',
      sortable: false,
      filter: false,
      width: 90,
      cellRenderer: mandatoryCellRenderer,
      suppressColumnsToolPanel: true,
      pinned : window.innerWidth >= 640 ? 'left' : 'none',
      lockPinned : window.innerWidth >= 640,
      lockVisible : window.innerWidth >= 640,
    };

    updateColumnsAndSetDefs({
      columns,
      savedColumns,
      setColumnDefs,
      mandatoryCol,
      fieldName: AgGridHeaderName.name,
      facilityName: AgGridHeaderName.facilityName,
    });
  }, [agGridHeaderNames, isFilterChanged, filterData, isFilter]);

  const mandatoryCellRenderer = (props: ICellRendererParams) => {
    if (props) {
      return (
        <EditCellPopOver
          rowData={props}
          deletePatient={{
            loading: deleteFacilityUsersLoadingState,
            deletePatientState,
            setDeletePatientState,
          }}
        />
      );
    }

    return (<div>{'N/A'}</div>);
  };

  const isRowSelectable = useMemo(() => {
    return (params: any) => {
      return (
        (!!params.data && params.data.invitationStatus === UserInvitationOptions.INVITE) ||
        (!!params.data && params.data.invitationStatus === UserInvitationOptions.RESEND) ||
        (!!params.data && params.data.invitationStatus === 'N/A')
      );
    };
  }, []);

  useEffect(() => {
    getListData(0);
  }, [searchedPhase]);

  console.log('filter', filterData);

  return (
    <>
      <div ref={ref}>
        <ContentHeader
          title="Patient Management"
          className="lg:sticky"
          disableGoBack={true}>
          <div className="block xl:flex justify-between items-start">
            <div>
              <CustomSearchField
                defaultValue={searchedPhase}
                onChange={setSearchedPhase}
              />
            </div>

            <div className="flex flex-wrap pt-4 xl:pt-0 pl-1">
              {!facilitySourceSystem?.includes('ehr') && (
                <Button
                  onClick={() => {
                    setBulkEmailInviteState((prevState) => ({
                      ...prevState,
                      modalState: true,
                    }));
                  }}
                  loading={false}
                  disabled={false}
                  size="md"
                  className="mr-2 2xl:mr-4 mb-2 truncate text-sm 2xl:text-base">
                  Bulk Invite
                </Button>
              )}
              <Button
                onClick={onBtExport}
                loading={loadingExport}
                disabled={loadingExport ? loadingExport : patientsDataLoading}
                className="truncate text-sm mb-2 2xl:text-base"
                size="md">
                Export
              </Button>
              {!facilitySourceSystem?.includes('ehr') && (
                <Button
                  size="md"
                  disabled={patientsDataLoading}
                  className="ml-2 2xl:ml-4 mb-2 truncate text-sm 2xl:text-base"
                  onClick={() =>
                    facilityName?.length === 1 ? handleCopyClick(facilityName[0].fitbitIdField) : handleOpenCopyModal()
                  }>
                  <span>{isCopied ? 'Copied!' : 'Copy Invitation link'}</span>
                </Button>
              )}
              <Button
                size="md"
                className="ml-2 2xl:ml-4 mb-2 truncate text-sm 2xl:text-base"
                onClick={() => navigate(routes.admin.addPatient.patientDetails.match)}>
                Add
              </Button>
            </div>
          </div>
          {openCopyModal && (
            <Popup
              className="max-w-sm rounded-xl "
              open={openCopyModal}
              closeOnDocumentClick
              onClose={handleOpenCopyModal}
              modal={openCopyModal}>
              <div className="modal flex gap-5 px-2 py-10  max-h-[620px] overflow-y-auto">
                <RxCross2
                  className="absolute top-[0.6rem] right-[1.2rem] rounded-full"
                  onClick={handleOpenCopyModal}
                />
                <ul className="flex flex-col gap-3 w-full">
                  {facilityName?.map((fieldValue, index) => {
                    return (
                      <>
                        {!(/\s\s/.test(fieldValue.name) || fieldValue.name === '') && (
                          <li
                            className="list-none grid grid-cols-2 items-center p-3 capitalize"
                            key={fieldValue.name}>
                            {fieldValue.name && fieldValue.name.substring(0, 100)}
                            <div className="flex justify-end me-5">
                              <FaCopy
                                size={20}
                                className="text-gray-500 cursor-pointer"
                                onClick={() => {
                                  handleCopyClick(fieldValue.fitbitIdField);
                                  handleOpenCopyModal();
                                }}
                              />
                            </div>
                          </li>
                        )}
                      </>
                    );
                  })}
                </ul>
              </div>
            </Popup>
          )}
        </ContentHeader>
      </div>

      <ContentFrame className="grid-item">
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          isRowSelectable={isRowSelectable}
          gridStyle={{
            height: viewPortHeight - (height + (viewPortHeight > 610 ? 130 : 100)),
            paddingBottom: '10px',
            fontSize: '17px',
          }}
          handleGridReady={handleGridReady}
          onSelectionChanged={(e: any) => rowSelection(e)}
          updateColumnOrder={debounceUpdateState}
          changeVisibility={debounceUpdateState}
          pagination={
            rowData.length < config.pagination.defaultAgGridTake
              ? undefined
              : {
                  onNextPage: (e) => loadMore('next', e),
                  onPrevPage: (e) => loadMore('prev', e),
                  page: noOfPage,
                  prevEnabled: gridPagination.prev,
                  nextEnabled: gridPagination.next,
                }
          }
        />
        {!!selectedRows.length && patientButtonOff && !isFilter && (
          <div className={`${isFilterChanged && filterData.find((e) => e !== UserInvitationOptions.REGISTERED) && 'pt-20'} space-x-2 flex items-center justify-end`}>
            <div className="text-sm font-medium tracking-wide flex justify-end 2xl:mr-1">
              Send invitation to selected patients
            </div>
            <Button
              loading={invitePatientLoading}
              className="text-sm mt-2 2xl:mt-0 float-right"
              disabled={invitePatientLoading}
              onClick={() => invitePatientCallBack({ variables: { userIds: selectedRows } })}>
              Invite Patients
            </Button>
          </div>
        )}
      </ContentFrame>

      <Popup
        open={dialogOpen}
        closeOnDocumentClick={false}
        contentStyle={{
          width: window.innerWidth < 600 ? '80%' : '600px',
        }}
        modal>
        <div className="text-left py-7 px-8">
          <p className="font-bold text-md text-black">Your email was sent</p>
          {!invitePatientLoading && (
            <p className="font-normal text-base text-gray-700 mt-5">
              {invitePatientResponse?.pretaaHealthInvitePatients}
            </p>
          )}
          {invitePatientLoading && <Skeleton height={16} />}
          <div className="pt-8">
            <Button
              onClick={() => {
                invitePatientResponseReset();
                setDialogOpen(false);
              }}>
              Close
            </Button>
          </div>
        </div>
      </Popup>

      <Popup
        open={bulkEmailInviteState.modalState}
        closeOnDocumentClick={false}
        contentStyle={{
          width: window.innerWidth < 600 ? '80%' : '600px',
        }}
        modal>
        <form
          className="text-left p-6"
          onSubmit={handleSubmit(onSubmit)}>
          <p className="font-bold text-md text-black">Enter email to send</p>
          <div className="py-4">
            <label className="text-base">Email</label>
            <textarea
              className="rounded text-sm w-full mt-2"
              {...register('blkEmail', { required: true })}
              onChange={() =>
                (bulkEmailInviteState.errorMessage || bulkEmailInviteState.successMessage) &&
                setBulkEmailInviteState((prevState) => ({ ...prevState, successMessage: null, errorMessage: null }))
              }></textarea>

            {errors.blkEmail?.message && <ErrorMessage message={String(errors.blkEmail.message)} />}
            {errors.blkEmail?.type === 'pattern' && errors.blkEmail?.message && (
              <span className="text-red-800 text-sm mt-1 margin-top-8 sentence-case">
                Please enter emails with comma separated to continue
              </span>
            )}
            {isValid && bulkEmailInviteState?.errorMessage && (
              <ErrorMessage message={bulkEmailInviteState.errorMessage} />
            )}
          </div>
          <div>
            <Controller
              name="facilityId"
              control={control}
              rules={{
                required: isRequired,
              }}
              render={({ field: { onChange } }) => (
                <SelectedFacilityList
                  onInt={setIsRequired}
                  labelStyle="text-base"
                  onChange={(e) => {
                    onChange(e);
                    setValue('facilityId', e);
                    trigger('facilityId');
                  }}
                />
              )}
            />
            {errors.facilityId && <ErrorMessage message={messagesData.errorList.required} />}
          </div>

          {isValid && bulkEmailInviteState?.successMessage && (
            <SuccessMessage message={bulkEmailInviteState.successMessage} />
          )}
          <div className="pt-8 flex flex-row items-center space-x-2 mb-2">
            <Button
              loading={sendBulkInviteLoading}
              disabled={sendBulkInviteLoading}
              type="submit">
              Send
            </Button>
            <Button
              buttonStyle="gray"
              type="button"
              onClick={() => {
                setError('blkEmail', { message: '' });
                setValue('blkEmail', '');
                setBulkEmailInviteState(() => ({ successMessage: null, errorMessage: null, modalState: false }));
              }}>
              Cancel
            </Button>
          </div>
        </form>
      </Popup>

      <ConfirmationDialog
        modalState={deletePatientState.modalState}
        disabledBtn={deleteFacilityUsersLoadingState}
        confirmBtnText={'Delete'}
        onConfirm={() => {
          if (!deletePatientState.selectedPatient) {
            toast.error(messagesData.errorList.deletePatient);
            return;
          }
          deletePatient(deletePatientState.selectedPatient, callDeletePatientApi);
        }}
        loading={deleteFacilityUsersLoadingState}
        onCancel={() => setDeletePatientState({ modalState: false, selectedPatient: null })}
        className="max-w-sm rounded-xl">
        Are you sure you want to delete this patient ?
      </ConfirmationDialog>
    </>
  );
}
