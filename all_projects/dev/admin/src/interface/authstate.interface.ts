import { GetCurrentAdminUser, GetUser } from 'generatedTypes';

export interface AuthState {
  user: GetUser;
  admin: GetCurrentAdminUser;
  sessionId: null | string;
  twoFactorAuthToken: null | string;
  loginError: string | null;
  lastUrl: string | null;
}
