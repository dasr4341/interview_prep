import { takeEvery, fork, put } from 'redux-saga/effects';
import postApi from '../../Api/Placeholder/post';
import { PostQuery } from './Post.query.interface';
import { postSliceActions } from './Post.slice';

function* postQueryMiddleWare({ payload }: { payload: PostQuery }): any {
  const posts = yield postApi.getPostList(payload);
  yield put(postSliceActions.setPostList(posts));
}

function* postListQuery() {
  yield takeEvery(postSliceActions.getPosts, postQueryMiddleWare);
}

function* postDetailsMiddleWare({ payload }: { payload: string }): any {
  const post = yield postApi.getPost(payload);
  yield put(postSliceActions.setPost(post));
}

function* postQuery() {
  yield takeEvery(postSliceActions.getPost, postDetailsMiddleWare);
}

export default function* postSaga() {
  yield fork(postListQuery);
  yield fork(postQuery);
}
