import { UserPermissionNames } from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';

export enum CapabilitiesType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  EXECUTE = 'EXECUTE',
  VIEW = 'VIEW',
}

export default function useGetPrivilege(privilege: UserPermissionNames, capabilityType: CapabilitiesType) {
  const user = useAppSelector((state) => state.auth.user);
  const privilegeData = user?.pretaaHealthGetCurrentUserPermissions.find((e) => e.name === privilege)?.capabilities;
  
  if (privilegeData) {
      return Boolean(privilegeData[capabilityType]);
  } else {
    return false;
  }
}
