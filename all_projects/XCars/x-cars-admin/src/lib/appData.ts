import setCookie from '@/components/Forms/login/setCookie';
import { config } from '@/config/config';
import { AppStorageData } from '@/interface/AppStorageData.interface';

export async function setAppData(data: AppStorageData) {
  localStorage.setItem(config.storage.app_data, JSON.stringify(data));
  if (data.token) {
    await setCookie('authToken__admin', data.token);
  }
}

const defaultAppData: AppStorageData = {
  token: null,
};

export function getAppData(): AppStorageData {
  const data = localStorage.getItem(config.storage.app_data);
  if (data) {
    return JSON.parse(data);
  }
  return defaultAppData;
}
