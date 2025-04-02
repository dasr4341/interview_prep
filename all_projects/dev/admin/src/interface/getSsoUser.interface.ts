import { SSOSettings } from './SsoSettings.interface';

export interface GetSsoUser {
  data: SSOSettings;
}

export interface PretaaGetSSOUserPayload {
  email: string;
}
