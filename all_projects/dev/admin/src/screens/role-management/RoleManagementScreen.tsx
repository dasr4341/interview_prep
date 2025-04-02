import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { LabeledValue } from 'components/LabeledValue';
import Button from 'components/ui/button/Button';
import { NavigationHeader } from 'components/NavigationHeader';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { DeleteRole, DeleteRoleVariables, UserPermissionNames, ViewAllRoles, ViewAllRoles_pretaaViewAllRoles } from 'generatedTypes';
import { ViewAllRolesQuery } from 'lib/query/role-management/get-all-roles';
import { useMutation, useQuery } from '@apollo/client';
import Popover, { PopOverItem } from 'components/Popover';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { range } from 'lodash';
import { DeleteRoleMutation } from 'lib/mutation/role-management/delete-role';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { useEffect, useState } from 'react';
import ConfirmationBox from 'components/ConfirmationDialog';
import usePermission from 'lib/use-permission';
import { successList } from '../../lib/message.json';
import { TrackingApi } from 'components/Analytics';

export function Loading() {
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

export default function RoleManagementScreen() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [roleList, setRoleList] = useState<ViewAllRoles_pretaaViewAllRoles[]>([]);
  const { error, data: allRole, loading } = useQuery<ViewAllRoles>(ViewAllRolesQuery);
  const rolePermission = usePermission(UserPermissionNames.ROLE_MANAGEMENT);
  const [deleteRoleAction, { loading: loadingDeleteRole }] = useMutation<DeleteRole, DeleteRoleVariables>(DeleteRoleMutation, {
    onCompleted: (response) => {
      toast.success(successList.roleDelete);
      setRoleList(roleList.filter((role) => role.id !== response.pretaaDeleteRole.id));
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    if (allRole?.pretaaViewAllRoles) {
      setRoleList(allRole.pretaaViewAllRoles);
    }
  }, [allRole]);

  function handleDeleteRole(roleId: string) {
    setSelectedGroup(roleId);
  }

  function onConfirm(roleId: string) {
    deleteRoleAction({
      variables: {
        id: roleId,
      },
    });
    setSelectedGroup(null);
  }

  function onCancel() {
    setSelectedGroup(null);
  }

  function RoleItem(role: ViewAllRoles_pretaaViewAllRoles) {
    return (
      <div
        key={role.id}
        className="bg-white border-b border-gray-400 block md:flex gap-4 items-center p-6 data-row
         relative md:static"
        test-data-id="role_data_row">
        <h3 className="flex-1 text-base font-bold capitalize">
          <Link to={`${routes.roleEdit.build(role.id)}`} data-test-id="role-name">{role.name}</Link>
        </h3>
        <LabeledValue label="Role Access" className="flex-1 capitalize">
          {role.isDefault ? 'Default access' : 'Custom access'}
        </LabeledValue>
        {(rolePermission?.capabilities.EDIT || rolePermission?.capabilities.DELETE) && (
          <div className="md:inset-y-1/2 left-0 mt-0 md:transform md:rotate-90">
            <Popover>
              {rolePermission?.capabilities.EDIT && (
                <PopOverItem id="edit-btn">
                  <div onClick={() => navigate(routes.roleEdit.build(role.id))}>Edit</div>
                </PopOverItem>
              )}
              {rolePermission?.capabilities.DELETE && <PopOverItem id='delete-btn' onClick={() => handleDeleteRole(role.id)}>Delete</PopOverItem>}
            </Popover>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.roleList.name,
    });
  }, []);

  return (
    <>
      <ContentHeader disableGoBack={true}>
        <div className="block md:flex lg:flex items-center">
          <NavigationHeader>Role Management</NavigationHeader>
          {rolePermission?.capabilities.CREATE && (
            <div className="flex flex-1 justify-start md:justify-end mb-5 mt-2">
              <Link to={`${routes.roleCreate.match}`}>
                <Button>Add</Button>
              </Link>
            </div>
          )}
        </div>
      </ContentHeader>

      <ContentFrame>
        {error && <ErrorMessage message={error.message} />}
        {loading && roleList.length === 0 && <Loading />}
        {!loading && <h3 className="text-base font-bold mb-3">Default Roles</h3>}

        {roleList.filter((r) => r.isDefault).map(RoleItem)}

        {roleList.filter((r) => !r.isDefault).length > 0 && (
          <>
            <h3 className="text-base font-bold mb-3 mt-4">Custom Roles</h3>
            {roleList.filter((r) => !r.isDefault).map(RoleItem)}
          </>
        )}
        <ConfirmationBox
          modalState={selectedGroup ? true : false}
          className="max-w-sm"
          disabledBtn={loadingDeleteRole}
          onConfirm={() => onConfirm(selectedGroup as string)}
          onCancel={() => onCancel()}>
          Did you want to delete this role?
        </ConfirmationBox>
      </ContentFrame>
    </>
  );
}
