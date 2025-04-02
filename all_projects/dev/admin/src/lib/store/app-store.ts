import { configureStore } from '@reduxjs/toolkit';
import userManagement from './slice/user-management';
import companyManagement from './slice/company-management';
import authReducer from './slice/auth/auth.slice';
import integrationReducer from './slice/integration';
import breadCrumbReducer from './slice/breadcrumb.slice';
import dataSourceReducer from './slice/date-source.slice';
import controlPanelReducer from './slice/control-panel';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootsaga';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const appStateStore = localStorage.getItem('app_state');
let appState: any = {};
if (appStateStore) {
  appState = false ? {} : JSON.parse(appStateStore);
}

const store = configureStore({
  reducer: {
    userManagement: userManagement,
    companyManagement: companyManagement,
    auth: authReducer,
    integration: integrationReducer,
    breadCrumb: breadCrumbReducer,
    dataSource: dataSourceReducer,
    controlPanel: controlPanelReducer
  },
  preloadedState: appState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});
sagaMiddleware.run(rootSaga);

export default store;

function handleChange() {
  const state = store.getState();
  if (localStorage.getItem('app_debug')) {
    console.log('state', state);
  }
}

store.subscribe(handleChange);


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
