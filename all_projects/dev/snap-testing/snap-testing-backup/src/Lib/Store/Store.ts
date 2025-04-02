import { tilesReducer } from './Page/Tiles/TilesSlice';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { compilationReducer } from './Page/Compilation/CompilationSlice';
import { captionsReducer } from './Captions/CaptionsSlice';
import rootSaga from './rootsaga';
import helperSlice from './Helper/HelperSlice';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const appState: any = {};

export const store = configureStore({
  reducer: {
    helper: helperSlice,
    captions: captionsReducer,
    compilation: compilationReducer,
    tiles: tilesReducer,
  },
  preloadedState: appState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
