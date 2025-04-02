import { all } from 'redux-saga/effects';
import menuSaga from './Menu/Category/Category.Saga';
import postSaga from './Post/Post.Saga';
import userSaga from './User/User.Saga';
import orderSaga from './Order/Order.saga';
import cartSaga from './Cart/Cart.saga';
import ItemHelperSaga from './ItemHelper/itemHelper.Saga';

export default function* rootSaga() {
  yield all([
    userSaga(),
    orderSaga(),
    postSaga(),
    menuSaga(),
    cartSaga(),
    ItemHelperSaga()
  ]);
}
