import { takeEvery, fork, put } from 'redux-saga/effects';
import orderApi from '../../Api/Order/order';
import { orderSliceActions } from './Order.slice';
import { helperSliceActions } from '../Helper/Helper.Slice';
import routes from '../../Routes/Routes';
import { PayloadSetNoOfItems } from '../../Interface/Order/Order.Interface';
import { apiErrorHandler } from '../../Api/Axios/axios';
import { ItemHelperSliceActions } from '../ItemHelper/ItemHelper.Slice';
import { OrderPage, STATUS } from '../../Helper/constants';

function* getOrdersByStatus({ payload }: { payload: { orderStatus: STATUS } }): any {
  // get all orders on basis of orderStatus
  try {
    const orders = yield orderApi.getOrderByStatus(payload.orderStatus);
    yield put(orderSliceActions.addOrders(orders));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}

function* getOrderById({ payload }: { payload: { orderId: string } }): any {
  // get all orders on basis of orderId
  try {
    const orders = yield orderApi.getOrderById(payload.orderId);
    yield put(orderSliceActions.addOrdersById(orders));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  }
}
function* setNoOfItems({ payload }: { payload: PayloadSetNoOfItems }): any {
  // change no of items
  try {
    if (!!payload.itemId && !!payload.orderId) {
      if (payload.noOfItems === 0) {
        const { result, ...orderDeleteStatus } = yield orderApi.deleteOrderItems(
          String(payload.itemId),
          String(payload.orderId)
        );

        if (
          Object.keys(orderDeleteStatus.orderDeleteStatus).length > 0 &&
          orderDeleteStatus.orderDeleteStatus.success
        ) {
          // the order from the order table has been deleted as all the items related has been deleted
          yield put(helperSliceActions.setToastMessage({ ...orderDeleteStatus.orderDeleteStatus }));
          yield put(
            helperSliceActions.setRedirectUrl(
              routes.dashboard.children.order.children.pages.fullPath(OrderPage.NEW_ORDER)
            )
          );
        } else {
          yield put(helperSliceActions.setToastMessage({ ...orderDeleteStatus.orderDeleteStatus }));
        }
      } else {
        const result = yield orderApi.setNoOfItems(String(payload.itemId), payload.noOfItems);
        if (result.success !== true) {
          yield put(helperSliceActions.setToastMessage({ ...result }));
        }
      }
      yield put(ItemHelperSliceActions.getLeftAllItemsLeftOverQuantity());
    } else {
      yield put(helperSliceActions.setToastMessage({ message: 'payload is undefined ', success: false }));
    }
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  } finally {
    // for order, we can only set the no of items in ---> 1. New Order (here in New Order section , orderStatus ==== STATUS.PENDING) section
    // so after setting the number , we will load again that section
    yield getOrdersByStatus({ payload: { orderStatus: STATUS.PENDING } });
  }
}

function* setOrderStatus({ payload }: { payload: { orderId: string; status: string; orderStatus: STATUS } }): any {
  // change order status
  try {
    const result = yield orderApi.updateOrderStatus(payload.orderId, payload.status);
    const { data, ...filteredResult } = result;
    yield put(helperSliceActions.setToastMessage(filteredResult));
  } catch (error: any) {
    apiErrorHandler({ error: error, toastMessage: true });
  } finally {
    yield put(orderSliceActions.getOrders({ orderStatus: payload.orderStatus }));
  }
}

function* orderListQuery() {
  yield takeEvery(orderSliceActions.getOrders, getOrdersByStatus);
  yield takeEvery(orderSliceActions.getOrderById, getOrderById);
  yield takeEvery(orderSliceActions.setNoOfItems, setNoOfItems);
  yield takeEvery(orderSliceActions.setOrderStatus, setOrderStatus);
}

export default function* orderSaga() {
  yield fork(orderListQuery);
}
