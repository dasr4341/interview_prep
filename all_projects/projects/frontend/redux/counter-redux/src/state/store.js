// import { legacy_createStore as createStore } from "redux";
import reducer from "./reducer/index";
// toolkit
import { configureStore } from "@reduxjs/toolkit";
// saga
import testSaga from "./reducer/testSaga";
import createSagaMiddleware from 'redux-saga';




const sagaMiddleware = createSagaMiddleware();

// const store = createStore(reducer);
const store = configureStore({
  reducer: reducer,
  middleware : ()=>[sagaMiddleware]
});





sagaMiddleware.run(testSaga);
export default store;
