import { takeEvery, fork, put } from 'redux-saga/effects';
import postApi from '../../Api/Placeholder/post';
import { postSliceAction } from './Post.slice.Action';
import { postSliceActions } from './Post.slice';

function* postQueryMiddleWare(): any {
  const posts = yield postApi.getPostList();
  yield put(postSliceActions.addPosts(posts));
  // yield put(userSliceAction.setUserAction(user));
  // yield put(helperSliceAction.redirectLinkAction(routes.dashboard.children.me.fullPath));
}

function* postListQuery() {
  yield takeEvery(postSliceAction.getPosts as any, postQueryMiddleWare);
}

export default function* postSaga() {
  yield fork(postListQuery);
}
