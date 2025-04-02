/* eslint-disable react-hooks/exhaustive-deps */
import { UserPermissionNames } from 'generatedTypes';
import catchError from 'lib/catch-error';
import usePermission from 'lib/use-permission';
import React, { useEffect, useState } from 'react';
import usersApi from '../../../lib/api/users';
import { toast } from 'react-toastify';

export default function UserActiveCell(props: any) {
  const [active, setActive] = useState<boolean>();
  const userPermission = usePermission(UserPermissionNames.USER);
  useEffect(() => {
    setActive(props.data.active);
  }, [props.data]);

  async function toggleUserStatus(id: string) {
    if (userPermission?.capabilities.EDIT) {
      try {
        const response = await usersApi.updateUserActive(id);
        setActive(response?.pretaaChangeUserStatus.active);
        toast.success(`User ${response?.pretaaChangeUserStatus.active ? 'activated' : 'deactivated'} successfully`);
      } catch (e) {
        console.log(e);
        catchError(e, true);
      }
    }
  }

  return (
    <div>
      <select
        onChange={() => {
          toggleUserStatus(props.data.id);
        }}>
        <option value="Active" selected={active}>
          Active
        </option>
        <option value="Inactive" selected={!active}>
          Inactive
        </option>
      </select>
    </div>
  );
}
