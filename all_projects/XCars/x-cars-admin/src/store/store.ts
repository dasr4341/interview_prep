import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app/app.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
