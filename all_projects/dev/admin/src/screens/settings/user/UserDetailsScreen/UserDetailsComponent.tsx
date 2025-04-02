/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from '@apollo/client';
import {
  AddUpdateRoleVariables,
  RemoveUserGroupVariables,
  UserDetails,
  UserDetailsVariables,
  ViewAllRoles,
  UserDetails_pretaaGetUserDetails,
  RemoveUserGroup,
  GetUserInheritedPermissions,
  GetUserInheritedPermissionsVariables,
  UserDetails_pretaaGetUserDetails_groups,
  UserPermissionNames,
} from 'generatedTypes';
import { getUserDetails } from 'lib/query/user/user-details';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { ViewAllRolesQuery } from 'lib/query/role-management/get-all-roles';
import { AddUpdateRoleMutation } from 'lib/mutation/role-management/update-user-role';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import GroupAccess from './GroupAccess';
import UserDetail from './UserDetail';
import { FaChevronRight } from 'react-icons/fa';
import { RemoveUserGroupMutation } from 'lib/mutation/groups/remove-user-group';
import ConfirmationBox from 'components/ConfirmationDialog';
import { range } from 'lodash';
import { GetUserInheritedPermissionsQuery } from 'lib/query/user/user-permissions';
import { useDispatch } from 'react-redux';
import usePermission from 'lib/use-permission';
import { successList } from '../../../../lib/message.json';
import { userManagementActions } from 'lib/store/slice/user-management';
import { TrackingApi } from 'components/Analytics';

function Loading() {
  return (
    <>
      {range(0, 4).map((i) => (
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

export default function UserDetailsComponent() {
  const userPermission = usePermission(UserPermissionNames.USER);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { register, setValue, getValues } = useForm();
  const { data: allRole } = useQuery<ViewAllRoles>(ViewAllRolesQuery);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetails_pretaaGetUserDetails>();
  const [groupList, setGroupList] = useState<UserDetails_pretaaGetUserDetails_groups[]>();
  const { data, loading } = useQuery<UserDetails, UserDetailsVariables>(getUserDetails, {
    variables: {
      userId: String(params.id),
      take: 10000,
    },
  });
  const { data: userPermissions } = useQuery<GetUserInheritedPermissions, GetUserInheritedPermissionsVariables>(GetUserInheritedPermissionsQuery, {
    variables: {
      userCase: {
        default: {
          equals: true,
        },
      },
      dataObject: {
        default: {
          equals: true,
        },
      },
    },
  });
  // Hooks for updating new role
  const [updateUserRole] = useMutation(AddUpdateRoleMutation);
  // Hooks for remove existing user group
  const [deleteGroupAction, { loading: loadingDeleteGroup }] = useMutation<RemoveUserGroup, RemoveUserGroupVariables>(RemoveUserGroupMutation, {
    onCompleted: (response) => {
      toast.success(successList.groupRemoved);
      if (groupList?.length) {
        setGroupList(groupList.filter((g) => g.groupId !== response.pretaaUpdateGroup.id));
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    if (data?.pretaaGetUserDetails) {
      setUserDetail(data?.pretaaGetUserDetails);
      setGroupList(data?.pretaaGetUserDetails.groups);
      setValue('roleType', data?.pretaaGetUserDetails?.roles[0]?.role?.name);
    }
  }, [data]);

  function redirectToUserEdit() {
    navigate(routes.updateUser.build(String(userDetail?.id)));
  }

  function redirectToGroupEdit() {
    dispatch(userManagementActions.addUserGroup(groupList?.map((x) => x.groupId) || []));
    navigate(routes.groupList.build({ canSelect: true, userId: String(params.id) }));
  }

  async function redirectToGroupRemoveAccess(groupId: number) {
    setSelectedGroup(groupId);
  }

  const saveUserRole = async () => {
    if (userPermission?.capabilities.EDIT) {
      try {
        const selectedRole = allRole?.pretaaViewAllRoles?.find((x) => x.name === getValues('roleType'));
        const updateVariables: AddUpdateRoleVariables = {
          roles: [selectedRole?.id as string],
          userId: String(params.id),
        };
        await updateUserRole({
          variables: updateVariables,
        });
        toast.success(successList.userRoleUpdate);
      } catch (e) {
        catchError(e, true);
      }
    }
  };

  function onConfirm(groupId: string) {
    if (userPermission?.capabilities.EDIT) {
      const removeVariables: RemoveUserGroupVariables = {
        groupId: groupId,
        users: {
          delete: [
            {
              groupId_userId: {
                groupId: groupId,
                userId: String(params.id),
              },
            },
          ],
        },
      };
      deleteGroupAction({
        variables: removeVariables,
      });
    }

    setSelectedGroup(null);
  }

  function onCancel() {
    setSelectedGroup(null);
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.UserDetails.name,
    });
  }, []);

  return (
    <>
      <div>
        {/* User Info */}
        {loading && !userDetail && <Loading />}
        {userDetail && <UserDetail userDetail={userDetail} onRedirectToUserEdit={redirectToUserEdit} />}

        {userDetail && (
          <form>
            <div className="flex flex-col space-y-2">
              <h3 className="h3 mb-2 mt-7 text-base">Role</h3>
              <select
                {...register('roleType')}
                name="roleType"
                id="roleType"
                onChange={(e) => {
                  setValue('roleType', e.target.value);
                  saveUserRole();
                }}
                className="w-full lg:w-72 rounded-lg border-gray-300 h-14 capitalize">
                {allRole?.pretaaViewAllRoles?.map((role) => {
                  return (
                    <option value={role?.name} key={role?.name}>
                      {role?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </form>
        )}

        {/* Group Access */}
        <GroupAccess groups={groupList} onRedirectToGroupEdit={redirectToGroupEdit} onRedirectToGroupRemoveAccess={redirectToGroupRemoveAccess} />

        {/* Access */}
        {userPermissions && (
          <>
            <h3 className="h3 mb-2 mt-7 text-base">Inherited Permissions</h3>
            <p
              className="italic text-xs
          text-gray-150 mt-1">
              Inherited Permissions are managed through the data object section & can only be changed on a company basis
            </p>
            <div className="bg-white rounded rounded-xl mb-24 mt-3">
              <div className="border-b flex items-center p-4">
                <div className="flex-1">
                  <label className="block font-bold">Default_</label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Data Object Access</p>
                  <label className="block">{userPermissions?.pretaaListDataObjectCollections[0]?.name} Access</label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Use Case Access</p>
                  <label className="block">{userPermissions?.pretaaGetUseCaseCollections[0].name} Access</label>
                </div>
                <Link
                  to={routes.userInheritedPermission.build({
                    useCaseId: userPermissions?.pretaaGetUseCaseCollections[0]?.id as string,
                    dataObjectId: userPermissions?.pretaaListDataObjectCollections[0].id as string,
                    userId: String(params?.id),
                  })}>
                  <FaChevronRight className="text-base text-gray-400" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <ConfirmationBox
        modalState={selectedGroup ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeleteGroup}
        onConfirm={() => onConfirm(String(selectedGroup))}
        onCancel={() => onCancel()}>
        Do you want to remove user from this group?
      </ConfirmationBox>
    </>
  );
}
