import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import counterReducer from './Counter/Counter';
import rootSaga from './rootsaga';
import userReducer from './User/User.Slice';
import helperSlice from './Helper/Helper.Slice';
import PostSlice from './Post/Post.slice';
import OrderSlice from './Order/Order.slice';
import CategoryReducer from './Menu/Category/Category.Slice';
import CartSlice from './Cart/Cart.slice';
import MenuEditorSlice from './Menu/MenuEdiotor/MenuEditor.Slice';
import ItemHelperSlice from './ItemHelper/ItemHelper.Slice';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const appStateStore = localStorage.getItem('app_state');

let appState: any = {};

if (appStateStore) {
  appState = false ? {} : JSON.parse(appStateStore);
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    helper: helperSlice,
    post: PostSlice,
    order: OrderSlice,
    category: CategoryReducer,
    cart: CartSlice,
    menueditor: MenuEditorSlice,
    ItemHelper: ItemHelperSlice
  },
  preloadedState: appState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(middleware),
});


sagaMiddleware.run(rootSaga);

function handleChange() {
  const state = store.getState();
  console.log('app state', state);
}

store.subscribe(handleChange);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
