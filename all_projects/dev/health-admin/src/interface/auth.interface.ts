import { UserTypeRole } from 'health-generatedTypes';

export interface LoginPayload {
  email: string;
  password: string;
  otp: number;
}

export interface LoginResponse {
  loginToken?: string;
  refreshToken?: string;
  message?: string;
  fitbitTokenInvalid: boolean;
  twoFactorAuthToken?: null | string;
  twoFactorAuthentication?: null | boolean;
}

export const userRolesOptions = [
  {
    roleSlug: UserTypeRole.SUPER_ADMIN,
    name: 'Super Admin',
  },
  {
    roleSlug: UserTypeRole.FACILITY_ADMIN,
    name: 'Facility Admin',
  },
  {
    roleSlug: UserTypeRole.COUNSELLOR,
    name: 'Care Team',
  },
  {
    name: 'Patient',
    roleSlug: UserTypeRole.PATIENT,
  },
  {
    name: 'Supporter',
    roleSlug: UserTypeRole.SUPPORTER,
  },
];
