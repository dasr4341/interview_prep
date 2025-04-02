import { fork, put, takeEvery } from 'redux-saga/effects';
import { userApi } from '../../Api/Fake';
import { ForgetPasswordPayload, LoginPayload } from '../../Api/Fake/Users/users.interface';
import routes from '../../Routes/Routes';
import { helperSliceActions } from '../Helper/Helper.Slice';
import { userSliceActions } from './User.Slice';

function* loginMiddleWare({ payload }: { payload: LoginPayload }): any {
    try {
      const { user } = yield userApi.getCurrentUser();
      yield console.log(user, payload);
      yield put(userSliceActions.setUser(user));
      yield put(helperSliceActions.setRedirectUrl(routes.dashboard.children.me.fullPath));
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
