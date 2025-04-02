import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import counterReducer from './Counter/Counter';
import rootSaga from './rootsaga';
import userReducer from './User/User.Slice';
import helperSlice from './Helper/Helper.Slice';
import PostSlice from './Post/Post.slice';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// const appStateStore = localStorage.getItem('app_state');
const appState: any = {};
// if (appStateStore) {
//   // appState = JSON.parse(appStateStore);
// }

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    helper: helperSlice,
    post: PostSlice
  },
  preloadedState: appState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});
sagaMiddleware.run(rootSaga);

function handleChange() {
  // const state = store.getState();
  // console.log('app state', state);
  // localStorage.setItem('app_state', JSON.stringify(state));
}

store.subscribe(handleChange);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;