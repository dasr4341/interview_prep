import { useMutation } from '@apollo/client';
import {
  AddUpdateRoleVariables,
  PretaaGetUserList_pretaaGetUserList,
  UserPermissionNames,
  ViewAllRoles_pretaaViewAllRoles,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { AddUpdateRoleMutation } from 'lib/mutation/role-management/update-user-role';
import usePermission from 'lib/use-permission';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function RoleCell({
  data,
  allRoles,
}: {
  data: PretaaGetUserList_pretaaGetUserList;
  allRoles: ViewAllRoles_pretaaViewAllRoles[];
}) {
  const userPermission = usePermission(UserPermissionNames.USER);
  const { register, setValue, getValues } = useForm();

  useEffect(() => {
    if (data.roles[0]?.role?.name) {
      setValue('roleType', data.roles[0].role.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [updateUserRole] = useMutation(AddUpdateRoleMutation);

  const saveUserRole = async () => {
    if (userPermission?.capabilities.EDIT) {
      try {
        const selectedRole = allRoles?.find((x) => x.name === getValues('roleType'));
        const updateVariables: AddUpdateRoleVariables = {
          roles: [selectedRole?.id as string],
          userId: data.id,
        };
        await updateUserRole({
          variables: updateVariables,
        });
        toast.success('User role updated');
      } catch (e) {
        catchError(e, true);
      }
    }
  };
  return (
    <div>
      <form>
        <select
          {...register('roleType')}
          name="roleType"
          id="roleType"
          onChange={(e) => {
            setValue('roleType', e.target.value);
            saveUserRole();
          }}
          className="w-40">
          {allRoles?.map((role) => {
            return (
              <option value={role?.name} key={role?.name}>
                {role?.name}
              </option>
            );
          })}
        </select>
      </form>
    </div>
  );
}
