import { fork, put, takeEvery } from 'redux-saga/effects';

import { snapActionsApi } from '../../../Api/snap-actions-api';
import { compilationActions } from './CompilationSlice';
import { handleError } from 'Lib/Api/api-client';



function* getCompilationListMiddleWare(): any {
  try {
    const compilationList = yield snapActionsApi.getCompilationList();
    yield put(compilationActions.setCompilationList(compilationList));
  } catch (e: any) {
    handleError(e);
  }
}

function* getCompilationListSagas() {
  yield takeEvery(compilationActions.getCompilationList, getCompilationListMiddleWare);
}

export default function* compilationSagas() {
  yield fork(getCompilationListSagas);
}
