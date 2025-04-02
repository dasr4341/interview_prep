import { GetUser, LoginUserVariables, PretaaGetData, VerifyTwoFactorAuthenticationVariables } from '../../../../generatedTypes';
import { config } from 'config';
import { fork, put, takeEvery, select } from 'redux-saga/effects';
import { storeActions } from '../../store-actions';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { AnalyticsEvents, TrackingApi } from 'components/Analytics';
import userApi from 'lib/api/users';
import { RootState } from '../../app-store';
import faker from 'faker';
import { getGraphError } from 'lib/catch-error';

function* getUser() {
  try {
    const user: GetUser = yield userApi.getCurrentUser();
    Sentry.setUser({ id: user.currentUser.id });
    TrackingApi.identify(user.currentUser.id, user.currentUser.customerId);
    
    yield put(storeActions.auth.setUserAction(user));
    const sessionId = select((state: RootState) => state.auth.sessionId);

    if (!sessionId) {
      const id = faker.datatype.uuid();
      yield put(storeActions.auth.setSessionIdAction(id));
      TrackingApi.track(AnalyticsEvents.SessionStart, { sessionId: id });
    }

    const appData: PretaaGetData = yield userApi.getAppData();
    yield put(storeActions.dataSource.setDateRange(appData.pretaaGetDateRangeTypes));
    yield put(storeActions.dataSource.setSalesStage(appData.pretaaGetSalesStages));
  } catch (e) {
    console.error('Auth Middle ware ', e);
    yield put(storeActions.auth.setUserAction(null));
  }

 
}

function* getSuperAdmin() {
  try {
    const { data } = yield userApi.getSuperAdmin();
    yield put(storeActions.auth.setAdminAction(data));
  } catch (e) {
    yield put(storeActions.auth.setAdminAction(null));
  }
}



function setTokensForUser({ token, refreshToken }: { token: string; refreshToken: string }) {
  localStorage.setItem(config.storage.token, token);
  localStorage.setItem(config.storage.refreshToken, refreshToken);
  localStorage.setItem(config.storage.loginTime, JSON.stringify(moment().format('HH:mm')));
}

function* loginMiddleWare({ payload }: { payload: LoginUserVariables }) {
  const { data: result, errors } = yield userApi.sendLoginRequest(payload);
  yield put({
    type: storeActions.auth.setLoginError,
    payload: null,
  });
  if (errors) {
    yield put({
      type: storeActions.auth.setLoginError,
      payload: getGraphError(errors).join(','),
    });
  } else if (result?.pretaaLogin?.loginToken) {
    setTokensForUser({ token: result?.pretaaLogin?.loginToken, refreshToken: result?.pretaaLogin?.refreshToken });
    yield getUser();
  } else if (result?.pretaaLogin?.twoFactorAuthToken) {
    toast.success(result?.pretaaLogin?.message);
    yield put({
      type: storeActions.auth.updateTwoFactorAuthToken,
      payload: result?.pretaaLogin?.twoFactorAuthToken,
    });
  }
}

function* loginSaga() {
  yield takeEvery(storeActions.auth.loginAction as any, loginMiddleWare);
}


function* verifyOtpMiddleWare({ payload }: { payload: VerifyTwoFactorAuthenticationVariables }) {
  try {
    yield put({
      type: storeActions.auth.setLoginError,
      payload: null,
    });
    const { data, errors } = yield userApi.verifyOtpRequest(payload);
    if (errors && errors.length) {
      yield put({
        type: storeActions.auth.setLoginError,
        payload: getGraphError(errors).join(', '),
      });
    } else if (data) {
      setTokensForUser({ token: data?.pretaaVerifyTwoFactorAuthentication?.loginToken, refreshToken: data?.pretaaVerifyTwoFactorAuthentication?.refreshToken });
    }
    yield getUser();
  } catch (e: any) {
    toast.error(e.message);
  }
}

function* verifyOtpSaga() {
  yield takeEvery(storeActions.auth.verifyOtp as any, verifyOtpMiddleWare);
}

function* getCurrentUser() {
  yield getUser();
}

function* getCurrentUserSaga() {
  yield takeEvery(storeActions.auth.getCurrentUser, getCurrentUser);
}

function* getCurrentSuperAdmin() {
  yield getSuperAdmin();
}

function* getCurrentSuperAdminSaga() {
  yield takeEvery(storeActions.auth.getCurrentSuperAdmin, getCurrentSuperAdmin);
}

export default function* authSagas() {
  yield fork(loginSaga);
  yield fork(verifyOtpSaga);
  yield fork(getCurrentUserSaga);
  yield fork(getCurrentSuperAdminSaga);
}
