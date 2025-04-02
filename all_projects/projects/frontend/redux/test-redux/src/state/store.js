// import { legacy_createStore } from "redux";
import reducers from "./reducer/index";
import { configureStore } from "@reduxjs/toolkit";
import reduxSaga from "./reducer/reduxSaga";
import createSagaMiddleware from "redux-saga";

// const Store = legacy_createStore(reducers);
const sagaMiddleWare = createSagaMiddleware();
const Store = configureStore({
  reducer: reducers,
  middleware: () => [sagaMiddleWare],
});

sagaMiddleWare.run(reduxSaga);
export default Store;
