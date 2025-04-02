import { all } from 'redux-saga/effects';
import postSaga from './Post/Post.Saga';
import userSaga from './User/User.Saga';

export default function* rootSaga() {
  yield all([
    userSaga(),
    postSaga(),
  ]);
}
