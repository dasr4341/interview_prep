import { ContentFrame } from 'components/content-frame/ContentFrame';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { routes } from 'routes';
import StatusDropdown, { CustomUserType, Status } from '../StatusDropdown';
import './EmployeeList.scss';
import AgGrid from 'components/ag-grid/AgGrid';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  DeleteFacilityUsersForFacilityAdmin,
  DeleteFacilityUsersForFacilityAdminVariables,
  FacilityUserDeletionRoles,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  ListStaff,
  ListStaffVariables,
  ListStaff_pretaaHealthListStaffUser,
  SourceSystemTypes,
  UserInvitationOptions,
  UserStaffTypes,
  UserTypeRole
} from 'health-generatedTypes';
import { LazyQueryExecFunction, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { config } from 'config';
import useQueryParams from 'lib/use-queryparams';
import EditCellPopOver from '../EditCellPopOver';
import LastLogin from '../LastLogin';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { useAppSelector } from 'lib/store/app-store';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from '@ag-grid-community/core';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import catchError from 'lib/catch-error';
import { debounce } from 'lodash';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import { toast } from 'react-toastify';
import useDeleteFacilityUsersByFacilityAdmin from 'customHooks/useDeleteFacilityUsersByFacilityAdmin';
import { ImSpinner7 } from 'react-icons/im';
import ConfirmationDialog from 'components/ConfirmationDialog';
import messagesData from 'lib/messages';
import { DeletePatientOrStaffStateInterfaceByFacilityAdmin } from 'screens/Settings/interface/DeletePatientOrStaffStateInterfaceByFacilityAdmin';
import { AgGridCheckboxContextData } from './AgGridCheckboxContext';
import { CommonColumnConfig } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { listStaffQuery } from 'graphql/listStaff.query';
import useSelectedRole from 'lib/useSelectedRole';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import { titleCase } from 'humanize-plus';
import { fullNameController } from 'components/fullName';
export interface PretaaHealthEHRSearchCareTeamsNew extends ListStaff_pretaaHealthListStaffUser {
  status: boolean;
  lastLogin: string;
}

const formattedEhrCell = (props: string | null) => {
  if (props) {
    return (props === SourceSystemTypes.ehr ? 'Manual' : titleCase(props))
  }
}

function LinkCellRenderer({
  data,
  deletePatientState,
  setDeletePatientState,
  loading
}: {
  data: any;
  deletePatientState: DeletePatientOrStaffStateInterfaceByFacilityAdmin;
  setDeletePatientState: React.Dispatch<React.SetStateAction<DeletePatientOrStaffStateInterfaceByFacilityAdmin>>;
  loading: boolean;
}) {
  const isSuperAdmin = useSelectedRole({ roles : [UserTypeRole.SUPER_ADMIN] });
  const isFacilityAdmin = useSelectedRole({ roles : [UserTypeRole.FACILITY_ADMIN ] });
  const query: { staffType?: UserTypeRole } = useParams();


  return (
    <div className="flex flex-row items-center staff-name-container cursor-pointer justify-between ">
      <Link
        to={routes.admin.employeeDetailsScreen.build(data.id, { employeeId: data.id })}
        className={`${query.staffType !== UserTypeRole.SUPER_ADMIN && 'staffName'} capitalize`}>
        {data.name}
      </Link>
      {((isSuperAdmin ||isFacilityAdmin) && (query.staffType === UserTypeRole.COUNSELLOR || query.staffType === UserTypeRole.FACILITY_ADMIN)
       ) && (
      <button
        disabled={loading || deletePatientState.modalState}
        className=" edit-btn ml-1 flex flex-row items-center  cursor-pointer px-2 py-1 bg-gray-300 rounded text-xss"
        onClick={() => {
          if (loading) {
            return;
          }
          setDeletePatientState(() => ({
            modalState: true,
            selectedPatient: [data.id],
          }));
        }}>
        Delete
        {deletePatientState?.selectedPatient?.includes(data.id) && loading ? (
          <ImSpinner7 className="animate-spin ml-2" />
        ) : (
          ''
        )}
      </button>
       )}
    </div>
  );
}

function deleteStaff(
  userIds: string[],
  callBack: LazyQueryExecFunction<DeleteFacilityUsersForFacilityAdmin, DeleteFacilityUsersForFacilityAdminVariables>,
  staffType: FacilityUserDeletionRoles
) {
  callBack({
    variables: {
      userType: staffType,
      all: false,
      userIds,
    },
  });
}

export default function EmployeeList({
  setSelectedEmployee,
  trigger,
  setInvitationButtonOff,
  userStaffType,
  setIsRegisteredStaff
}: {
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string[]>>;
  trigger: any;
  setInvitationButtonOff: React.Dispatch<React.SetStateAction<boolean>>;
  userStaffType: UserStaffTypes;
  setIsRegisteredStaff: (e: boolean) => void;
}) {
  const [rowData, setRowData] = useState<PretaaHealthEHRSearchCareTeamsNew[]>([]);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const query = useQueryParams();
  const appData = getAppData();
  const [isFilter, setIsFilter] = useState(false);
  const [noOfPage, setNoOfPage] = useState(1);
  const [selectedEmployeeList, setSelectedEmployeeList] = useState<string[]>([]);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });
  const [paginationLoading, setPaginationLoading] = useState({
    prevLoad: false,
    nextLoad: false,
  });
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [deleteStaffState, setDeleteStaffState] = useState<DeletePatientOrStaffStateInterfaceByFacilityAdmin>({
    modalState: false,
    selectedPatient: null,
  });

  // Needed while impersonation -> on change of user the page should reload
  const impersonationUserState = useAppSelector((state) => state.auth.impersonate);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.STAFF_MANAGEMENT,
    },
    onError: (e) => catchError(e, true),
  });

  function getSelectedRowData(e: { data: any; isSelected: boolean | undefined; agGridApi: GridApi }) {
    const rows = gridApi?.api.getSelectedRows() as any[];

    if (rows.length > 0) {
      const getNonRegisteredPatients = rows?.filter((each) => {
        return each.invitationStatus !== UserInvitationOptions.REGISTERED;
      });

      if (getNonRegisteredPatients && getNonRegisteredPatients.length > 0) {
        const selectedList = getNonRegisteredPatients?.map((emp) => emp.id as string);
        setSelectedEmployee(selectedList);
        setSelectedEmployeeList(selectedList);
        setInvitationButtonOff(true);
      } else {
        setInvitationButtonOff(false);
      }
    } else {
      setInvitationButtonOff(false);
    }
  }

  const { callApi: callDeleteStaffApi, loading: deleteFacilityUsersLoadingState } =
    useDeleteFacilityUsersByFacilityAdmin((d) => {
      toast.success(d.pretaaHealthFacilityDeleteUsersForFacilityAdmins);
      setRowData((prevState) =>
        prevState.filter((row) => row?.id && !deleteStaffState.selectedPatient?.includes(row.id))
      );
      setDeleteStaffState(() => ({ modalState: false, selectedPatient: null }));
    });

    // to get ag grid filtered data
    const {
      filterData,
      setFilterData,
      isFilterChanged
    } = useContext(AgGridCheckboxContextData);

    useEffect(() => {
      if (
        selectedEmployeeList.length > 0 &&
        isFilterChanged && ((filterData.length === 0) || (filterData.length === 1 &&
          filterData.find((e) => e === UserInvitationOptions.REGISTERED))
        )
      ) {
        setIsFilter(true);
        setIsRegisteredStaff(true);
      } else if (selectedEmployeeList.length > 0 && !isFilterChanged) {
        setIsFilter(false);
        setFilterData([]);
        setIsRegisteredStaff(false);
      }else {
        setIsFilter(false);
        setIsRegisteredStaff(false);
      }
    }, [filterData, isFilterChanged, selectedEmployeeList.length]);

  function nameCellRenderer({ data }: { data: any }) {
    return (
      <LinkCellRenderer
        loading={deleteFacilityUsersLoadingState}
        data={data}
        deletePatientState={deleteStaffState}
        setDeletePatientState={setDeleteStaffState}
      />
    );
  }

  function editCellRenderer(d: ICellRendererParams) {
    return (
      <EditCellPopOver
        rowData={d}
        userStaffType={userStaffType}
        deleteStaff={{
          loading: deleteFacilityUsersLoadingState,
          deleteStaffState,
          setDeleteStaffState,
        }}
      />
    );
  }

  function updatedStatus(props: CustomUserType) {
    return (
      <StatusDropdown
        updatedRow={setRowData}
        props={props}
        userStaffType={userStaffType}
      />
    );
  }

  useEffect(() => {
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        cellRenderer: nameCellRenderer,
        cellClass: 'text-pt-blue-300 lock-pinned',
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        width: 230,
        headerCheckboxSelection: isFilter ? false : true,
        ...CommonColumnConfig
      },
      { field: 'email', sortable: true, minWidth: 250, filter: 'agTextColumnFilter', filterParams: {
        buttons: ['clear'],
      }, },
      { field: 'phone', sortable: true, filter: 'agTextColumnFilter', filterParams: {
        buttons: ['clear'],
      }, },
      {
        field: 'status',
        sortable: true,
        cellRenderer: updatedStatus,
        filter: 'agSetColumnFilter',
        valueGetter: (params: any) => {
          if (params?.data?.statusCol) {
            return params?.data?.statusCol;
          }
        },
      },
      {
        field: 'lastLogin',
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        },
        cellRenderer: LastLogin,
      },
      {
        field: 'invitationStatus',
        filter: 'agSetColumnFilter',
        width: 220
      },
      { field: 'ehrType', headerName: 'EHR Type', filter: 'agSetColumnFilter' },
      { field: 'facilityName', filter: 'agTextColumnFilter', filterParams: {
        buttons: ['clear'],
      }, hide: appData.selectedFacilityId?.length === 1, suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1},
      {
        field: '',
        headerName: '',
        sortable: false,
        filter: false,
        enable: true,
        pinned: 'left',
        width: 90,
        hide: userStaffType === UserStaffTypes.SUPER_ADMIN,
        cellRenderer: editCellRenderer,
        suppressColumnsToolPanel: true,
        lockPinned : window.innerWidth >= 640,
        lockVisible : window.innerWidth >= 640,
      },
    ];

    //visibility save options need to implement again
    setColumnDefs(columns);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnOrder, deleteFacilityUsersLoadingState, deleteStaffState, filterData, isFilter, isFilterChanged, rowData]);

  const [getEmployeeList, { loading: listLoading, data: listData }] = useLazyQuery<ListStaff,
   ListStaffVariables
   >(listStaffQuery, {
    onCompleted: (data) => {
      if (data.pretaaHealthListStaffUser) {
        setGridPagination({
          next: data.pretaaHealthListStaffUser.length === config.pagination.defaultAgGridTake,
          prev: true
        });
        const employeeRow = data.pretaaHealthListStaffUser.map((emp) => {
          return {
            id: emp.id,
            name: fullNameController(emp.firstName, emp.lastName),
            email: emp.email || 'N/A',
            phone: emp.mobilePhone || 'N/A',
            status: emp.active,
            statusCol: emp.active ? Status.ACTIVE : Status.INACTIVE,
            lastLogin: emp.lastLoginTime === "N/A" ? null : formatDate({ date: emp.lastLoginTime, formatStyle: 'agGrid-date'}) || null,
            userId: emp.id,
            invitationStatus: emp.invitationStatus || 'N/A',
            ehrType: formattedEhrCell(emp.ehrType) || 'N/A',
            facilityName: emp.facilityName || 'N/A'
          };
        }) as unknown as PretaaHealthEHRSearchCareTeamsNew[];
        setRowData(employeeRow);
      }
    },
    onError: (e) => catchError(e, true)
   });

  const isRowSelectable = useMemo(() => {
    return (params: any) => {
      return (!!params.data && params.data.invitationStatus === UserInvitationOptions.INVITE) || 
      (!!params.data && params.data.invitationStatus === UserInvitationOptions.RESEND) ||
      (!!params.data && params.data.invitationStatus === 'N/A');
    };
  }, []);

  function getEmployeeData(skip: number) {
    getEmployeeList({
      variables: {
        userType: userStaffType,
        search: query.searchedPhase,
        skip,
        take: config.pagination.defaultAgGridTake,
      },
    });
  }

  function loadMore(type: 'prev' | 'next', e: any) {
    if (gridApi !== null) {
      // eslint-disable-next-line
      let gridAPI = gridApi;
      gridAPI.api = e;
      setGridApi(gridAPI);
    }
    if (type === 'next') {
      getEmployeeData(noOfPage * config.pagination.defaultAgGridTake);
      setNoOfPage((p) => p + 1);
      setPaginationLoading({ prevLoad: false, nextLoad: true });
    } else {
      getEmployeeData((noOfPage - 2) * config.pagination.defaultAgGridTake);
      setNoOfPage((p) => p - 1);
      setPaginationLoading({ prevLoad: true, nextLoad: false });
    }
  }

  useEffect(() => {
    setSelectedEmployee([])
    getEmployeeData(0);
  }, [query.searchedPhase, impersonationUserState, userStaffType]);

  useEffect(() => {
    if (trigger) {
      gridApi?.api.deselectAll();
    }
  }, [trigger]);

  function handleGridReady(e: GridReadyEvent) {
    setGridApi(e);
  }

  useAgGridOverlay({ detailsLoading: listLoading, gridApi, list: listData?.pretaaHealthListStaffUser });

  const [updateStaffColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation
  );

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateStaffColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.STAFF_MANAGEMENT,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  return (
    <>
      <ContentFrame className="h-screen lg:h-full grid-item">
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          handleRowSelection={(e: { data: any; isSelected: boolean | undefined; agGridApi: GridApi }) =>
            getSelectedRowData(e)
          }
          updateColumnOrder={debounceUpdateState}
          changeVisibility={debounceUpdateState}
          isRowSelectable={isRowSelectable}
          pagination={
            rowData.length >= config.pagination.defaultAgGridTake || noOfPage > 1
              ? {
                  onNextPage: (e) => loadMore('next', e),
                  onPrevPage: (e) => loadMore('prev', e),
                  page: noOfPage,
                  prevEnabled: noOfPage > 1 && gridPagination.prev,
                  nextEnabled: gridPagination.next,
                  prevLoading: listLoading && paginationLoading.prevLoad,
                  nextLoading: listLoading && paginationLoading.nextLoad,
                }
              : null
          }
        />
      </ContentFrame>
      <ConfirmationDialog
        modalState={deleteStaffState.modalState}
        disabledBtn={deleteFacilityUsersLoadingState}
        confirmBtnText={'Delete'}
        onConfirm={() => {
          if (!deleteStaffState.selectedPatient) {
            toast.error(messagesData.errorList.deleteStaff);
            return;
          }
          deleteStaff(deleteStaffState.selectedPatient, callDeleteStaffApi, userStaffType as any);
        }}
        loading={deleteFacilityUsersLoadingState}
        onCancel={() => setDeleteStaffState({ modalState: false, selectedPatient: null })}
        className="max-w-sm rounded-xl">
         Are you sure you want to delete this staff ?
      </ConfirmationDialog>
    </>
  );
}
