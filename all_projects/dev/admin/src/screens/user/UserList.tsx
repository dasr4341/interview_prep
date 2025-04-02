/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './UserList.scss';
import usersApi from 'lib/api/users';
import {
  PretaaChangeManyUserStatus,
  PretaaChangeManyUserStatusVariables,
  PretaaGetUserList_pretaaGetUserList,
  UserFields_pretaaDynamicUserFields,
  UserPermissionNames,
} from 'generatedTypes';
import { GridReadyEvent, GridApi, ColDef, ColumnApi } from '@ag-grid-enterprise/all-modules';
import UserActiveCell from './components/UserActiveCell';
import RoleCell from './components/RoleCell';
import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from '../../components/SearchField';
import Popover, { PopOverItem } from 'components/Popover';
import { BsChevronDown } from 'react-icons/bs';
import Button from 'components/ui/button/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import catchError from 'lib/catch-error';
import NameCell from './components/NameCell';
import AgGrid, { isFirstColumn } from 'components/ui/ag-grid/AgGrid';
import { useDispatch, useSelector } from 'react-redux';
import { userManagementActions } from '../../lib/store/slice/user-management';
import queryString from 'query-string';
import ConfirmationBox from 'components/ConfirmationDialog';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { DeactivateUserMutation } from 'lib/mutation/user/deactivate-user';
import _ from 'lodash';
import usePermission from 'lib/use-permission';
import { CRMRender, CSMRender } from './components/CSMCRMRender';
import { successList } from '../../lib/message.json';
import { config } from 'config';
import { TrackingApi } from 'components/Analytics';
import { RootState } from 'lib/store/app-store';

let selectedUsersID: Array<string> = [];
let deletedUsers: Array<string> = [];

export default function UserListScreen(): JSX.Element {
  const navigate = useNavigate();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [userList, setUserList] = useState<PretaaGetUserList_pretaaGetUserList[]>([]);
  const [userFields, setUserFields] = useState<UserFields_pretaaDynamicUserFields[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [columnName, setColumnName] = useState<string>('');
  const [columnSearch, setColumnSearch] = useState<string>('');
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageLimit = config.pagination.limit;
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedUList = useSelector((state: RootState) => state.userManagement.group.selectedUsers);
  const query: { groupId?: string; selectedGroup?: string; page?: string; groupCount?: number } = queryString.parse(location.search);

  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log({ selectedUList });
    if (selectedUList && selectedUList.length) {
      selectedUsersID = selectedUList;
    }
  }, []);

  const [openConfirmation, setOpenConfirmation] = useState<boolean | null>(null);
  const userPermission = usePermission(UserPermissionNames.USER);

  // Add selected users to Ag grid UI
  function setSelectedUsers() {
    gridApi?.forEachNode((node) => {
      const user: PretaaGetUserList_pretaaGetUserList = node.data;

      if (
        (user.groups.find((group) => group.groupId === query.groupId) && !deletedUsers.includes(user.id)) ||
        (!user.groups.find((group) => group.groupId === query.groupId) && selectedUsersID.includes(user.id))
      ) {
        // Adding  users in user list if already in group
        // Adding new users in user list
        node.setSelected(true);
      }
    });
    columnApi?.autoSizeAllColumns();
  }

  useEffect(() => {
    if (!query.groupId && !query.groupCount) {
      selectedUsersID = [];
      dispatch(userManagementActions.resetState());
    }
  }, [query.groupId, query.groupCount]);

  // Load first time user data from server and initialize ag-grid

  async function initData() {
    try {
      gridApi?.showLoadingOverlay();
      const allRoles = await usersApi.getAllRoles();
      const fields = await usersApi.getDynamicFields();
      const filteredFields = fields.filter((field) => field.isDefault);

      let users = [];

      if (query.selectedGroup) {
        users = await usersApi.getSelectedUsers({
          fields: filteredFields,
          variables: {
            id: query.groupId || '',
            usersTake: pageLimit,
            where: {
              group: {
                is: {
                  id: {
                    equals: query.groupId,
                  },
                },
              },
            },
          },
        });
      } else {
        users = await usersApi.getUsers({
          fields: filteredFields,
          query: {
            take: pageLimit,
            where: {
              groupId: {
                equals: query.groupId,
              },
            },
          },
        });
      }
      const colDefs: ColDef[] = filteredFields.map((f) => {
        const colDef: ColDef = {
          colId: String(f.id),
          headerName: f.fieldLabel,
          field: f.fieldName,
          hide: f.display ? false : true,
          filter: true,
          filterParams: {
            newRowsAction: 'keep',
            filterOptions: ['contains'],
            defaultOption: 'contains',
            suppressAndOrCondition: true,
          },
          headerCheckboxSelection: isFirstColumn,
          checkboxSelection: isFirstColumn,
        };

        if (f.fieldName === 'role') {
          colDef.cellRenderer = 'roleCellRender';
          colDef.cellRendererParams = { allRoles };
          colDef.filterParams = null;
          colDef.filter = false;
        } else if (f.fieldName === 'active') {
          colDef.filter = false;
          colDef.cellRenderer = 'activeCellRender';
          colDef.filterParams = null;
        } else if (f.fieldName === 'name') {
          colDef.cellRenderer = 'nameCell';
        }
        return colDef;
      });
      setColumnDefs(colDefs);
      setUserList(users);
      gridApi?.setRowData(users);
      setHideLoadMore(users.length < pageLimit);
      gridApi?.hideOverlay();
      setSelectedUsers();
      setUserFields(filteredFields);
    } catch (error) {
      gridApi?.hideOverlay();
      console.log(error);
    }
  }

  /**
   * Deactivate selected user list
   * @param {PretaaChangeManyUserStatus} response - PretaaChangeManyUserStatus
   */
  function deactivateUsers(response: PretaaChangeManyUserStatus) {
    gridApi?.setRowData([]);
    if (selectedUsersID.length > 0) {
      toast.success(successList.usersDeactivate);
    } else {
      toast.success(successList.userDeactivate);
    }

    const data1 = _.cloneDeep(userList).map((x) => {
      if (response.pretaaChangeManyUserStatus.find((u) => u.id === x.id)) {
        x.active = false;
        return x;
      }
      return x;
    });
    setUserList(data1);
    gridApi?.setRowData(data1);
    dispatch(userManagementActions.addSelectedUsers([]));
  }

  const [deactivateUserAction, { loading: loadingDeactivateUser }] = useMutation<PretaaChangeManyUserStatus, PretaaChangeManyUserStatusVariables>(DeactivateUserMutation, {
    onCompleted: (response) => {
      deactivateUsers(response);
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  // Load more user data from server after user end scroll to bottom
  async function loadMore(type: 'prev' | 'next') {
    if (hideLoadMore) {
      return;
    }

    // Do not fetch next page data because next page has no data
    // or Do not fetch prev page data because no prev page exist
    if ((hideLoadMore && type === 'next') || (page - 1 === 0 && type === 'prev')) {
      return;
    }

    setIsLoading(true);
    gridApi?.showLoadingOverlay();
    let phrase = '';
    if (searchText) phrase = searchText;
    if (!searchText && columnName) phrase = columnSearch;

    let skip = 0;
    if (type === 'next') {
      skip = page * pageLimit;
      setPage(page + 1);
    } else {
      skip = (page - 2) * pageLimit;
      setPage(page - 1);
    }

    const users = await usersApi.getUsers({
      fields: userFields,
      query: {
        take: pageLimit,
        skip: skip,
        searchColumn: columnName ? columnName : '',
        searchPhrase: phrase,
      },
    });

    setHideLoadMore(users.length < pageLimit);
    gridApi?.setRowData(users);
    setUserList(users);
    console.log(`total user length: ${users.length}`);
    setSelectedUsers();
    gridApi?.hideOverlay();
    setIsLoading(false);
  }

  // Filter user data by search field from server and set to ag-grid
  async function searchUser(column: string, searchPhrase: string | null) {
    console.log(column, searchPhrase);
    // if (searchPhrase && searchPhrase.length === 0) {
    //   initData();
    //   return;
    // }
    // gridApi?.showLoadingOverlay();
    // api?.showLoadingOverlay();
    // console.log(`searching ${column} with ${searchPhrase}`);
    // setSearchText('');
    // setColumnName(column);
    // setColumnSearch(searchPhrase as string);
    // const users = await usersApi.getUsers({
    //   fields: userFields,
    //   query: {
    //     searchColumn: column,
    //     searchPhrase,
    //     take: pageLimit,
    //   },
    // });
    // hideLoadMore = users.length < pageLimit;
    // api?.setRowData(users);
    // setUserList(users);
    // gridApi?.hideOverlay();
    // api?.hideOverlay();
    // if (users.length === 0) {
    //   gridApi?.showNoRowsOverlay();
    // }
    // console.log(`total user length: ${userList.concat(users).length}`);
  }

  // initialize ag-grid
  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e.api);
    setColumnApi(e.columnApi);
    e.api?.showLoadingOverlay();
    initData();
  };

  // Track user column visibility change and save to server
  async function changeVisibility(id: number, display: boolean) {
    try {
      await usersApi.changeFieldVisibility(id, display);
    } catch (e) {
      catchError(e, true);
    }
  }

  // Track user column order change and save to server
  async function updateColumnOrder(cols: number[]) {
    try {
      await usersApi.changeFieldOrder(cols);
    } catch (e) {
      catchError(e, true);
    }
  }

  function handleFirstRerendered() {
    setSelectedUsers();
  }

  const searchUsers = async (value: string) => {
    // Exit early if search term is same as previous one.
    if (value === searchText) return;

    gridApi?.showLoadingOverlay();
    setSearchText(value);
    setColumnName('');
    setColumnSearch('');
    const users = await usersApi.getUsers({
      fields: userFields,
      query: {
        searchPhrase: value,
        take: pageLimit,
      },
    });
    setHideLoadMore(users.length < pageLimit);
    gridApi?.setRowData(users);
    setUserList(users);
    setSelectedUsers();
    gridApi?.hideOverlay();
    if (users.length === 0) {
      gridApi?.showNoRowsOverlay();
    }
  };

  function deActivateUsers() {
    const selectedUsers = gridApi?.getSelectedRows();
    const activeDataSet = selectedUsers?.filter((u) => u.active);
    const activeIds = activeDataSet?.map((x) => x.id);
    deactivateUserAction({
      variables: {
        userIds: activeIds || [],
      },
    });
    setOpenConfirmation(null);
  }

  function onCancel() {
    setOpenConfirmation(null);
  }

  function updateGroup() {
    const ids = gridApi?.getSelectedRows().map((u) => u.id) as Array<string>;
    dispatch(userManagementActions.updateSelectedUsersForGroup(ids));
    dispatch(userManagementActions.updateDeletedUsers(deletedUsers));
    console.log({ ids, deletedUsers });

    if (query.groupId) {
      navigate(
        routes.userGroupAction.build({
          groupId: query.groupId,
        })
      );
    } else if (ids.length > 0) {
      navigate(
        routes.createUserGroup.build({
          groupCount: ids.length,
        })
      );
    } else {
      toast.error('Please select users');
    }
  }

  function handleRowSelection({ data, isSelected }: { data: PretaaGetUserList_pretaaGetUserList; isSelected: boolean }) {
    setTimeout(() => {
      if (isSelected === false && data.groups.find((g) => g.groupId === query.groupId)) {
        deletedUsers = [...deletedUsers, data.id];
      } else if (isSelected && data.groups.find((g) => g.groupId === query.groupId)) {
        deletedUsers = deletedUsers.filter((x) => x !== data.id);
      } else if (isSelected === true) {
        selectedUsersID = [...selectedUsersID, data.id];
      } else if (isSelected === false) {
        selectedUsersID = selectedUsersID.filter((x) => x !== data.id);
      }
    }, 10);
  }

  function manageUserLists() {
    if (query.groupCount) {
      navigate(
        routes.userListGrid.build({
          groupCount: Number(query.groupCount),
        })
      );
    } else {
      navigate(
        routes.userListGrid.build({
          groupId: String(query.groupId),
        })
      );
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.userListGrid.name,
    });
  }, []);

  return (
    <div className="user-list-detail flex flex-col h-screen">
      <ContentHeader title={query.selectedGroup ? 'Selected User Group' : 'User Management'} disableGoBack={query.selectedGroup ? false : true}>
        <div
          className="flex items-center justify-between gap-4 my-3
        flex-col md:flex-row">
          <div className="flex items-center">
            <SearchField defaultValue={searchText} label={searchText?.length > 0 ? searchText : 'Search user'} onSearch={(value) => searchUsers(value)} />
          </div>
          {query.selectedGroup && <Button classes="md:absolute md:right-4 xl:right-10 2xl:right-16 md:bottom-10" text="Manage Users" type="button" onClick={manageUserLists} />}
          {!query.selectedGroup && (userPermission?.capabilities.CREATE || userPermission?.capabilities.EDIT || userPermission?.capabilities.DELETE) && (
            <Popover
              trigger={
                <Button classes="btn user-button">
                  Manage Users
                  <BsChevronDown size={17} className="ml-1" />
                </Button>
              }>
              <Link to={routes.settingsUserUploadCSVFile.match} className="outline-none">
                <PopOverItem>Upload CSV</PopOverItem>
              </Link>
            </Popover>
          )}
        </div>
      </ContentHeader>

      <ContentFrame type="footer-with-noscroll" className="py-0 lg:py-0 px-0 lg:px-0 flex flex-1">
        <AgGrid
          frameworkComponents={{
            activeCellRender: UserActiveCell,
            roleCellRender: RoleCell,
            nameCell: NameCell,
            csmRender: CSMRender,
            crmRender: CRMRender,
          }}
          rowData={userList}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          changeVisibility={changeVisibility}
          updateColumnOrder={updateColumnOrder}
          rowSearch={searchUser}
          handleRowSelection={(e: any) => handleRowSelection(e)}
          onFirstDataRendered={() => handleFirstRerendered()}
          pagination={{
            onNextPage: () => loadMore('next'),
            onPrevPage: () => loadMore('prev'),
            page,
            prevEnabled: !isLoading,
            nextEnabled: !isLoading,
          }}
        />
      </ContentFrame>

      {query?.groupId ? (
        <ContentFooter>
          <div className="flex-1">
            {query?.groupId && !query.selectedGroup && (
              <Button classes="mx-auto md:mx-0 mb-4 md:mb-0" onClick={() => updateGroup()}>
                Update Group
              </Button>
            )}
            {!query?.groupId && (
              <Button classes="mx-auto md:mx-0 mb-4 md:mb-0" onClick={() => updateGroup()} testId="create-group-btn">
                Create Group
              </Button>
            )}
          </div>
          {userPermission?.capabilities.EDIT && (
            <div className="flex flex-1 justify-end">
              <Button text="Deactivate Users" style="danger" classes="mx-auto md:mx-0" onClick={() => setOpenConfirmation(true)} />
            </div>
          )}
        </ContentFooter>
      ) : (
        <ContentFooter>
          <div className="flex-1">
            <Button classes="mx-auto md:mx-0 mb-4 md:mb-0" onClick={() => updateGroup()} testId="create-group-btn">
              Create Group
            </Button>
          </div>
        </ContentFooter>
      )}
      <ConfirmationBox
        modalState={openConfirmation ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeactivateUser}
        confirmBtnText="Yes"
        onConfirm={() => deActivateUsers()}
        onCancel={() => onCancel()}>
        Are you sure you want to deactivate selected {selectedUsersID.length > 1 ? 'users' : 'user'}?
      </ConfirmationBox>
    </div>
  );
}
