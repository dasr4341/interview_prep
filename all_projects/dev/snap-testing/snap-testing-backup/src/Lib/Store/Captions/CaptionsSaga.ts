import { fork, put, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import { snapActionsApi } from './../../Api/snap-actions-api';
import { captionsActions } from './CaptionsSlice';

function* getCaptionsMiddleWare(): any {
  try {
    const captions = yield snapActionsApi.getCaptionList();
    console.log('prev cap length', captions.length);
    yield put(captionsActions.setCaptions([]));
  } catch (e: any) {
    toast.error(e.message);
  }
}
function* getCaptionsSagas() {
  yield takeEvery(captionsActions.getCaptions, getCaptionsMiddleWare);
}

export default function* captionsSagas() {
  yield fork(getCaptionsSagas);
}
