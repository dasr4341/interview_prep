import { fork, put, takeEvery } from 'redux-saga/effects';
import { ForgetPasswordPayload, LoginPayload } from '../../Api/Fake/Users/users.interface';
import routes from '../../Routes/Routes';
import { helperSliceActions } from '../Helper/Helper.Slice';
import { userSliceActions } from './User.Slice';
import { notifications } from '@mantine/notifications';
import userApi from 'Lib/Api/Fake/Users/users';

function* loginMiddleWare({ payload }: { payload: LoginPayload }): any {
    try {
      const { user } = yield userApi.getCurrentUser();
      yield console.log(user, payload);
      notifications.show({
        title: 'Logged in',
        message: 'Successfully logged in',
      });
      yield put(userSliceActions.setUser(user));
      yield put(helperSliceActions.setRedirectUrl(routes.dashboard.me.fullPath));
    } catch (e) {
      console.trace(e);
      console.log(e);
    }
}

function* loginSaga() {
  yield takeEvery(userSliceActions.login as any, loginMiddleWare);
}

function* forgetPasswordMiddleWare({ payload }: { payload: ForgetPasswordPayload }) {
  console.log('forgetPasswordMiddleWare payload', payload);
  const { token } = yield userApi.forgetPassword();
  yield console.log({ token });
  yield put(userSliceActions.updateForgetPassword({ token, loading: false }));
}

function* forgetPasswordSaga() {
  yield takeEvery(userSliceActions.forgetPassword as any, forgetPasswordMiddleWare);
}

function* logOutMiddleWare() {
  yield put(helperSliceActions.setRedirectUrl(routes.login.path));
}

function* logOutSaga() {
  yield takeEvery(userSliceActions.logout as any, logOutMiddleWare);
}

export default function* userSaga() {
  yield fork(loginSaga);
  yield fork(forgetPasswordSaga);
  yield fork(logOutSaga);
}
