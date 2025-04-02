import { config } from 'config';
import { UserTypeRole } from 'health-generatedTypes';

export interface Impersonation {
  userId: string;
  userName: string;
  selectedRole?: string | null;
  selectedFacilityId?: Array<string>;
}
interface AppStorageData {
  buildNo: string | null;
  selectedRole?: UserTypeRole | null;
  selectedFacilityId?: Array<string>;
  impersonate: Impersonation[],
  roleSwitching: boolean;
  impersonateInProgress: boolean;
}

const defaultAppData: AppStorageData = {
  buildNo: null,
  selectedRole: null,
  selectedFacilityId: [],
  impersonate: [],
  roleSwitching: false,
  impersonateInProgress: false,
};

export function setAppData(data: AppStorageData) {
  localStorage.setItem(config.storage.app_data, JSON.stringify(data));
}

export function getAppData(): AppStorageData {
  const data = localStorage.getItem(config.storage.app_data);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultAppData;
    }
  }
  
  return defaultAppData;
}
