import { GetPretaaAdminUser_pretaaHealthAdminCurrentUser, GetUser } from 'health-generatedTypes';
import { Impersonation } from 'lib/set-app-data';

export enum UserType  {
  pretaaAdmin = 'pretaaAdmin',
  superAdmin = 'superAdmin',
  facilityAdmin = 'facilityAdmin',
  facilityUser = 'facilityUser',
  patient = 'patient',
  supporter = 'supporter',
}

export interface AuthState {
  facilityId: null | string;
  facilitySourceSystem: null | string[];
  user: GetUser | null;
  pretaaAdmin: GetPretaaAdminUser_pretaaHealthAdminCurrentUser | null;
  impersonate: Impersonation[];
  selectedRole: null | string | undefined;
  impersonateInProgress: boolean;
}

export enum ImperSonationLocation  {
  forWard = 'forWard',
  goBack = 'goBack',
}
export interface ImpersonationState {
  pretaaAdmin?: GetPretaaAdminUser_pretaaHealthAdminCurrentUser | null,
  user?: GetUser | null,
  impersonationLocation?: ImperSonationLocation,
  prevUserType?: UserType | null,
  currentUserType?: UserType,
  pretaaAdminImpersonation?: {
    state: boolean,
    parentName: string | null
  };
  superAdmin?: {
    state: boolean,
    parentName: string | null
  };
  facilityAdmin?: {
    state: boolean,
    parentName: string | null
  };
  facilityUser?: {
    state: boolean,
    parentName: string | null
  };
}