import { takeEvery, put } from 'redux-saga/effects';
import { apiErrorHandler } from '../../Api/Axios/axios';
import cartApi from '../../Api/Cart/cart';
import { PlaceOrderApiResponseInterface, PlaceOrderPayload } from '../../Interface/Cart/CartInterface';
import { helperSliceActions } from '../Helper/Helper.Slice';
import { cartSliceActions } from './Cart.slice';

function* placeOrder({ payload }: { payload: PlaceOrderPayload }) {
  try {
    const { data, ...response }: PlaceOrderApiResponseInterface = yield cartApi.placeOrder(payload);
    yield put(helperSliceActions.setToastMessage(response));
    if (response.success) {
      yield put(cartSliceActions.deleteAllItems());
    } 
  } catch (error: any) {
     apiErrorHandler({ error: error, toastMessage: true });
  }
}

export default function* cartSaga() {
  yield takeEvery(cartSliceActions.placeOrder, placeOrder);
}
