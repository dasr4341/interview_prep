import React, { useEffect, useState } from 'react';
import { Select } from '@mantine/core';
import { getAppData, setAppData } from 'lib/set-app-data';
import {  useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { UserTypeRole } from 'health-generatedTypes';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';

export default function RoleSwitcher() {
  const roles = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser.userRoles);
  const [selectedUserRole, setSelectedUserRole] = useState<string>();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(state => state.auth.pretaaAdmin);

  useEffect(() => {
    if (roles?.length) {
      const data = getAppData();

      const currentRoles = data.selectedRole;
      setSelectedUserRole(currentRoles || '');
      dispatch(authSliceActions.setSelectedRole(currentRoles || ''));
  
      if (currentRoles === UserTypeRole.PATIENT || currentRoles === UserTypeRole.SUPPORTER || isAdmin) {
        setShowRoleSwitcher(false);
      }
    }
  }, [roles]);

  function updateSelectedRoles(v: any) {
    setSelectedUserRole(v);
    const d = getAppData();
    setAppData({ ...d, selectedRole: v, roleSwitching: true });
    dispatch(authSliceActions.getCurrentUser());
  }


  return (
    <div className='mb-6'>
      {showRoleSwitcher && selectedUserRole && (
        <Select
          className="pt-0 mt-0"
          placeholder="Select Role"
          value={selectedUserRole as any}
          data={
            roles?.map((e) => {
              return { label: e.name, value: e.roleSlug };
            }) || []
          }
          onChange={updateSelectedRoles}
          styles={{
            wrapper: {
              borderRadius: '10px',
              overflow: 'hidden',
            },
            input: {
              border: 'none',
              color: '#000000',
              height: '40px'
            },
            rightSection: {
              position: 'absolute',
              width: '0',
              height: '0',
              borderTop: '6px solid #000000',
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              top: '50%',
              right: '15px',
              transform: 'translateY(-50%)',
            },
            dropdown: {
              padding: '0',
              margin: '0',
              width: '100%',
            },
            item: {
              color: '#4B4C4E',
              borderBottom: '1px solid gray',
              borderRadius: '0',
            },
          }}
        />
      )}
    </div>
  );
}
