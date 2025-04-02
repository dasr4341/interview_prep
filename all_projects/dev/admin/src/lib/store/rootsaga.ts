import { all } from 'redux-saga/effects';
import authSaga from './slice/auth/authSagas';

export default function* rootSaga() {
  yield all([
    authSaga()
  ]);
}
