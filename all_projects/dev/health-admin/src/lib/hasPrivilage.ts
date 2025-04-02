import { GetUser, UserPermissionNames } from 'health-generatedTypes';
import { CapabilitiesType } from './getPrivilege';

export function hasPrivilege(user: GetUser | null, privilege: UserPermissionNames, capabilityType: CapabilitiesType) {
  const privilegeData = user?.pretaaHealthGetCurrentUserPermissions.find((e) => e.name === privilege)?.capabilities;

  if (privilegeData) {
    return Boolean(privilegeData[capabilityType]);
  } else {
    return false;
  }
}
