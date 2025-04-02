import { takeEvery, put } from 'redux-saga/effects';
import { apiErrorHandler } from '../../Api/Axios/axios';
import { itemHelperApi } from '../../Api/ItemHelper/ItemHelper';
import { ItemHelperInterface, ItemHelperSliceActions } from './ItemHelper.Slice';

function* getLeftAllItemsLeftOverQuantity() {
  try {
    const response: ItemHelperInterface[] = yield itemHelperApi.getAllItemsLeftOverQuantity();
    yield put(ItemHelperSliceActions.setLeftOverAllItemsLeftOverQuantity(response));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

export default function* ItemHelperSaga() {
  yield takeEvery(ItemHelperSliceActions.getLeftAllItemsLeftOverQuantity, getLeftAllItemsLeftOverQuantity);
}