/* eslint-disable react-hooks/exhaustive-deps */
import { GetUser_pretaaGetCurrentUserPermission, UserPermissionNames } from 'generatedTypes';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { routes } from 'routes';
import { RootState } from './store/app-store';

export default function usePermission(permissionName: UserPermissionNames) {
  const [permission, setPermission] = useState<GetUser_pretaaGetCurrentUserPermission | null>(null);
  const currentPermissions = useSelector((state: RootState) => state.auth.user?.pretaaGetCurrentUserPermission);

  // Do not delete this code 
  // if (process.env.NODE_ENV === 'development') {
  //     const privileges = currentPermissions?.map(p => p.name);
  //     const diff = _.difference(privileges, Object.keys(UserPermissionNames).map(key => key));
  //     console.log('warning: this privileges not used yet ', diff);
  // }
  

  useEffect(() => {
    if (currentPermissions && permissionName) {
      const permissionObj = currentPermissions.find((p) => p.name === permissionName);
      setPermission(permissionObj || null);
    }
  }, [currentPermissions, permissionName]);

  return permission;
}


export function useAdminLinks() {
  const [links, setLinks] = useState<Array<string>>([]);
  const currentPermissions = useSelector((state: RootState) => state.auth.user?.pretaaGetCurrentUserPermission);

  const linksList = [
    {
      privileges: UserPermissionNames.THRESHOLDS,
      routes: routes.thresholdScreen.match
    },
    {
      privileges: UserPermissionNames.INTEGRATIONS,
      routes: routes.thresholdScreen.match
    },
    {
      privileges: UserPermissionNames.ROLE_MANAGEMENT,
      routes: routes.roleList.match
    },
    {
      privileges: UserPermissionNames.USER,
      routes: routes.userListGrid.match,
    },
    {
      privileges: UserPermissionNames.GROUPS,
      routes: routes.groupList.match
    },
    {
      privileges: UserPermissionNames.LISTS,
      routes: routes.companyGroupList.match
    },
    {
      privileges: UserPermissionNames.DATA_OBJECT_COLLECTIONS,
      routes: routes.dataObjects.match
    }
  ];

  useEffect(() => {
    if (currentPermissions) {
      const list: Array<string> = [];

      linksList.forEach(l => {
        const permissionObj = currentPermissions.find((p) => p.name === l.privileges);
        if (permissionObj?.capabilities.VIEW) {
          list.push(l.routes);
        }
      });

      setLinks(list);
    }
  }, [currentPermissions]);

  return links;
}
