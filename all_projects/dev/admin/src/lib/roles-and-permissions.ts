import { GetUser_pretaaGetCurrentUserPermission, UserPermissionNames } from 'generatedTypes';

export function findCurrentPermission(
  permissionName: UserPermissionNames,
  permissions?: GetUser_pretaaGetCurrentUserPermission[]
): GetUser_pretaaGetCurrentUserPermission | undefined {
  if (permissions && permissions.length) {
    return permissions.find((permission) => permission.name === permissionName);
  } else {
    console.error('Permission not found', { permissionName, permissions });
  }
}