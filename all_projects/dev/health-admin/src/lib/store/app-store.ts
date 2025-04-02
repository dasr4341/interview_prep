
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth/auth.slice';
import appSlice from './slice/app/app.slice';
import assessmentReport from './slice/assessment-report/assessment.slice';
import campaignSlice from './slice/campaings/campaigns.slice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootsaga';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { config } from 'config';
import counsellorReportingSlice from './slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.slice';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const appStateStore = localStorage.getItem(config.storage.app_debug);
let appState: any = {};
if (appStateStore) {
  appState = false ? {} : JSON.parse(appStateStore);
}

function enableDevTool() {
  if (localStorage.getItem(config.storage.app_debug)) {
    return true;
  } else {
    return process.env.NODE_ENV === 'development';
  }
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appSlice,
    campaign: campaignSlice,
    assessmentReport: assessmentReport,
    counsellorReportingSlice: counsellorReportingSlice
  },
  preloadedState: appState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  devTools: enableDevTool(),
});
sagaMiddleware.run(rootSaga);

export default store;

function handleChange() {
  const state = store.getState();
  if (localStorage.getItem(config.storage.app_debug)) {
    localStorage.setItem(config.storage.app_debug, JSON.stringify(state));
  }
}

store.subscribe(handleChange);


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
