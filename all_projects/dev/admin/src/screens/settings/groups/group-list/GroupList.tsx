/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from '@apollo/client';
import ConfirmationBox from 'components/ConfirmationDialog';
import Popover, { PopOverItem } from 'components/Popover';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { PretaaDeleteGroup, PretaaDeleteGroupVariables, PretaaGetFilteredGroups_pretaaGetFilteredGroups, PretaaGetFilteredGroups, UserPermissionNames } from 'generatedTypes';
import { UserGroupRouteInterface } from 'interface/user-group-route.interface';
import catchError from 'lib/catch-error';
import { deleteGroup } from 'lib/mutation/groups/delete-group';
import { PretaaListGroupQuery } from 'lib/query/groups/list-group';
import { range } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'routes';
import queryString from 'query-string';
import { userManagementActions } from 'lib/store/slice/user-management';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import groupApi from 'lib/api/groups';
import usePermission from 'lib/use-permission';
import { successList } from '../../../../lib/message.json';
import EmptyFilter from 'components/EmptyFilter';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';

function Loading() {
  return (
    <>
      {range(0, 5).map((i) => (
        <div className="ph-item" key={i}>
          <div className="ph-col-12">
            <div className="ph-row">
              <div className="ph-col-6"></div>
              <div className="ph-col-4 empty"></div>
              <div className="ph-col-2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function GroupList({ searchText }: { searchText?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const groupsPermission = usePermission(UserPermissionNames.GROUPS);
  const query: UserGroupRouteInterface = queryString.parse(location.search);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState<PretaaGetFilteredGroups_pretaaGetFilteredGroups[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { loading, error } = useQuery<PretaaGetFilteredGroups>(PretaaListGroupQuery, {
    variables: {
      orderBy: {
        updatedAt: 'desc',
      },
    },
  });
  const selectedGroups = useSelector((state: RootState) => state.userManagement.group.selectedUserGroup);
  const [deleteGroupAction, { loading: loadingDeleteGroup }] = useMutation<PretaaDeleteGroup, PretaaDeleteGroupVariables>(deleteGroup, {
    onCompleted: (response) => {
      toast.success(successList.groupDelete);
      setGroups(groups.filter((group) => group.id !== response.pretaaDeleteGroup.id));
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  function onConfirm(groupId: string) {
    deleteGroupAction({
      variables: {
        groupId,
      },
    });
    setSelectedGroup(null);
  }

  function onCancel() {
    setSelectedGroup(null);
  }

  async function getTemplates() {
    try {
      if (searchText) {
        const variable = {
          searchPhrase: searchText,
        };
        const result = await groupApi().getGroups(variable);
        setGroups(result.data.pretaaGetFilteredGroups);
      } else {
        const result = await groupApi().getGroups();
        setGroups(result.data.pretaaGetFilteredGroups);
      }
    } catch (err) {
      catchError(err);
    }
  }

  useEffect(() => {
    getTemplates();
  }, [searchText]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, groupId: string) {
    const checked = e.target.checked;
    dispatch(userManagementActions.updateUserGroup({ id: groupId, selected: checked }));
  }

  function handleEdit(item: PretaaGetFilteredGroups_pretaaGetFilteredGroups) {
    dispatch(userManagementActions.updateName(item.name));
    navigate(routes.editUserGroup.build({ groupId: item.id }));
  }

  const listItem = groups.map((item) => {
    return (
      <div
        key={item.id}
        className="first:border-t border-b border-gray-300 py-3 sm:px-4
         relative flex flex-col md:flex-row items-center"
        test-data-id="group_list">
        <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-1 pl-4 md:pl-0">
          {query.canSelect && (
            <input
              type="checkbox"
              checked={selectedGroups.includes(item.id)}
              onChange={(e) => handleChange(e, item.id)}
              className={`appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light 
              checked:border-transparent rounded-md form-tick absolute left-0 top-5 cursor-pointer`}
            />
          )}
          <div className="ml-3">
            <h3 className="h3 text-primary truncate">{item.name}</h3>
            <p className="text-xs font-semibold uppercase text-gray-600">{item._count?.users} users</p>
          </div>
        </div>
        <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1">
          <h3 className="text-xs font-medium text-gray-600">Use Case Access</h3>
          <p className="text-primary">{item?.useCaseCollections?.name}</p>
        </div>
        <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1">
          <h3 className="text-xs font-medium text-gray-600">Data Object Access</h3>
          <p className="text-primary">{item.dataObjectCollections?.name}</p>
        </div>
        <div
          className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1
           md:pr-5">
          <h3 className="text-xs font-medium text-gray-600">Company Access list</h3>
          <p className="text-primary break-words">{`${item?.lists.length > 0 ? item?.lists[0]?.list?.name : ''}
             ${item?.lists.length - 1 > 0 ? ' +' + (item?.lists.length - 1) + ' More' : ''}`}</p>
        </div>
        {query.canSelect && (
          <Link to={routes.editUserGroup.build({ groupId: item.id })}>
            <DisclosureIcon />
          </Link>
        )}
        {!query.canSelect && (
          <div className="absolute top-2 right-2 md:inset-y-1/2  md:transform md:rotate-90" data-test-id="popup-btn">
            <Popover>
              <PopOverItem>
                <Link to={routes.groupDetails.build(item.id)} className="block outline-none">
                  View
                </Link>
              </PopOverItem>
              {groupsPermission?.capabilities.EDIT && (
                <PopOverItem>
                  <div onClick={() => handleEdit(item)}>Edit</div>
                </PopOverItem>
              )}
              {groupsPermission?.capabilities.DELETE && (
                <PopOverItem
                  onClick={() => {
                    setSelectedGroup(item.id);
                  }}>
                  Delete
                </PopOverItem>
              )}
            </Popover>
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-col flex-1">
        {loading && groups.length === 0 && <Loading />}
        {error && <ErrorMessage message={error.message} />}
        {groups.length > 0 && listItem}
        {!loading && groups.length === 0 && <EmptyFilter />}
      </div>
      <ConfirmationBox
        modalState={selectedGroup ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeleteGroup}
        onConfirm={() => onConfirm(String(selectedGroup))}
        onCancel={() => onCancel()}>
        Did you want to delete this group?
      </ConfirmationBox>
    </>
  );
}
