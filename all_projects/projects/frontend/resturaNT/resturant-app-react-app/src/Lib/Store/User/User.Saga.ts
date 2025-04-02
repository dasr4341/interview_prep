/* eslint-disable @typescript-eslint/no-unused-vars */
import { fork, put, takeEvery } from 'redux-saga/effects';
import routes from '../../Routes/Routes';
import { toast } from 'react-toastify';
import { userSliceActions } from './User.Slice';
import ResetPasswordApi from '../../Api/User/ResetPasswordApi';
import ForgetPasswordApi from '../../Api/User/ForgetPassword/ForgetPasswordApi';
import updateForgetPassword from '../../Api/User/ForgetPassword/UpdateForgetPassword';

import {
  RegisterInterface,
  LoginInterface,
  GetProfileInterface,
  UpdateProfileInterface,
  CurrentUserInterface,
  RegisterUserInterface,
  ResetPasswordPayLoad,
  ForgetPasswordPayload,
  UpdateForgetPasswordPayload
} from '../../Interface/User/UserInterface';
import RegisterApi, { RegisterUserApi } from '../../Api/User/RegisterApi';

import LoginApi from '../../Api/User/LoginApi';
import GetProfileApi from '../../Api/User/GetProfileApi';
import UpdateProfileApi from '../../Api/User/UpdateProfileApi';
import { helperSliceActions } from '../Helper/Helper.Slice';
import { apiErrorHandler } from '../../Api/Axios/axios';
import { cartSliceActions } from '../Cart/Cart.slice';

function* registerMiddleWare(data: any) {
  try {
    const registerResponse: RegisterInterface = yield RegisterApi(data.payload);
    toast.success(registerResponse.message);
    yield put(helperSliceActions.setRedirectUrl(routes.login.path));
    yield put(userSliceActions.setRegisterError(null));
  } catch (error: any) {
    apiErrorHandler({ error: error });
    yield put(userSliceActions.setRegisterError(error.response.data.message));
  }
}
function* registerUserMiddleWare(data: any) {
  // user register
  try {
    const registerResponse: RegisterUserInterface = yield RegisterUserApi(data.payload);
    yield put(cartSliceActions.setUser(registerResponse.data));
    yield put(helperSliceActions.setToastMessage({
      message: registerResponse.message,
      success: registerResponse.success
    }));
  } catch (error: any) {
     apiErrorHandler({ error: error, toastMessage: true });
 }
}

function* loginMiddleWare(data: any) {
  try {
    const loginResponse: LoginInterface = yield LoginApi(data.payload);
    localStorage.setItem('authToken', String(loginResponse.data?.authToken));
    const currentUser = {
      id: loginResponse.data?.id,
      name: loginResponse.data?.name,
      email: loginResponse.data?.email,
      phone: loginResponse.data?.phone,
      address: loginResponse.data?.address,
    };
    yield put(userSliceActions.setCurrentUser(currentUser as CurrentUserInterface));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    toast.success(loginResponse.message);
    yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.me.fullPath));
    yield put(userSliceActions.loginError(null));
  } catch (error: any) {
    apiErrorHandler({ error: error });
    yield put(userSliceActions.loginError(error.response.data.message));
  }
}

function* getProfileMiddleware() {
  try {
    const getProfileResponse: GetProfileInterface = yield GetProfileApi();
    yield put(userSliceActions.setCurrentUser(getProfileResponse.data));
    localStorage.setItem('currentUser', JSON.stringify(getProfileResponse.data));
    yield put(userSliceActions.setGetProfileError(null));
  } catch (error: any) {
    yield put(userSliceActions.setCurrentUser(null));
    apiErrorHandler({ error: error, toastMessage: true });
    yield put(userSliceActions.setGetProfileError(error.response.data.message));
  }
}

function* updateProfileMiddleware(data: any) {
  try {
    const updateProfileResponse: UpdateProfileInterface = yield UpdateProfileApi(data.payload);
    yield put(userSliceActions.setCurrentUser(updateProfileResponse.data));
    localStorage.setItem('currentUser', JSON.stringify(updateProfileResponse.data));
    toast.success(updateProfileResponse.message);
    yield put(userSliceActions.setUpdateProfileError(null));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
    yield put(userSliceActions.setUpdateProfileError(error.response.data.message));
  }
}

function* logoutMiddleWare() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  yield put(userSliceActions.setCurrentUser(null));
  yield put(helperSliceActions.setRedirectUrl(routes.login.path));
}

function* resetPasswordMiddleWare({ payload }: { payload: ResetPasswordPayLoad }) {
  const { data, ...response } = yield ResetPasswordApi(payload);
  yield put(helperSliceActions.setToastMessage(response));
}

function* forgetPasswordMiddleWare({ payload }: { payload: ForgetPasswordPayload }) {
  // we are sending the email to backend
  // &&
  // showing the response(whether the email is registered or not) from the server side 
  try {
    const { data, message, success } = yield ForgetPasswordApi(payload);
    yield put(userSliceActions.setForgetPassword({ loading: false }));
    yield put(helperSliceActions.setToastMessage({ message, success }));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }

}
function* UpdateForgetPasswordMiddleWare({ payload }: { payload: UpdateForgetPasswordPayload }) {
  // we are sending the token and new password (which have the email and timeout token )  to backend 
  // &&
  // showing the response(whether password is changed or not) from the server side
  try {
    const { data, message, success } = yield updateForgetPassword(payload);
    yield put(userSliceActions.setUpdateForgetPassword({ loading: false }));
    yield put(helperSliceActions.setToastMessage({ message, success }));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* registerSaga() {
  yield takeEvery(userSliceActions.register as any, registerMiddleWare);
  yield takeEvery(userSliceActions.registerUser as any, registerUserMiddleWare);
}
function* loginSaga() {
  yield takeEvery(userSliceActions.login as any, loginMiddleWare);
}
function* getProfileSaga() {
  yield takeEvery(userSliceActions.getProfile as any, getProfileMiddleware);
}
function* updateProfileSaga() {
  yield takeEvery(userSliceActions.updateProfile as any, updateProfileMiddleware);
}
function* logoutSaga() {
  yield takeEvery(userSliceActions.logout as any, logoutMiddleWare);
}
function* forgetPasswordSaga() {

  yield takeEvery(userSliceActions.forgetPassword as any, forgetPasswordMiddleWare);
  yield takeEvery(userSliceActions.updateForgetPassword as any, UpdateForgetPasswordMiddleWare);
}
function* resetPasswordSaga() {
  yield takeEvery(userSliceActions.resetPassword as any, resetPasswordMiddleWare);
}

export default function* userSaga() {
  yield fork(registerSaga);
  yield fork(loginSaga);
  yield fork(getProfileSaga);
  yield fork(updateProfileSaga);
  yield fork(logoutSaga);
  yield fork(forgetPasswordSaga);
  yield fork(resetPasswordSaga);
  yield fork(updateProfileSaga);
}
