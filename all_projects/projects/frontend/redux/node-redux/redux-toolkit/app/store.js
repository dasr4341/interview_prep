const configureStore = require('@reduxjs/toolkit').configureStore;
// const { getDefaultMiddleware } = require('@reduxjs/toolkit');
const logger = require('redux-logger').logger;
const cakeReducer = require("../feature/cake/cakeSice");
const icecreamReducer = require("../feature/icecream/icecreamSlice");

const store = configureStore({
  reducer: {
    cakeReducer,
    icecreamReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

module.exports = store;