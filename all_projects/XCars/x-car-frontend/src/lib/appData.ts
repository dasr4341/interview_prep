import { config } from '@/config/config';
import { AppStorageData } from '@/interface/AppStorageData.interface';
import { appSliceActions, IAppState } from '@/store/app/app.slice';
import { ApolloError } from '@apollo/client';
import { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import setCookieAuthToken from '@/components/account/helper/cookie';

export function setAppData(data: AppStorageData) {
  localStorage.setItem(config.storage.app_data, JSON.stringify(data));
  if (data.token) {
    setCookieAuthToken(data.token);
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

export function resetState() {
  localStorage.removeItem(config.storage.app_data);
}

const errorCodes = ['FORBIDDEN', 'UNAUTHORIZED'];
export function openLoginModal(
  dispatch: ThunkDispatch<
    {
      app: IAppState;
    },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
  e: ApolloError
) {
  const code = e?.graphQLErrors[0]?.extensions?.code as string;
  if (errorCodes.includes(code)) dispatch(appSliceActions.setLoginModel(true));
}
