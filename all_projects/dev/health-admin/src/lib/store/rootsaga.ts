import { all } from 'redux-saga/effects';
import authSaga from './slice/auth/authSagas';
import appSaga from './slice/app/app.saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    appSaga()
  ]);
}
