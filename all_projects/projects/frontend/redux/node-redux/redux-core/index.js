const redux = require('redux');
const legacy_createStore = redux.legacy_createStore;
const combineReducer = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;
const thunkMiddleware = require("redux-thunk").default;
const produce = require("immer").produce;
const reduxLogger = require('redux-logger');
const logger = reduxLogger.logger;
const axios = require('axios');
// -----------------------------------------------------------------------
// action
const addNum = (data) => {
  return {
    type: "addpen",
    data,
  };
};
const addToy = (data) => {
  return {
    type: "addtoy",
    data,
  };
};
// -----------------------------------------------------------------------
// reducer
const reducerToy = (state=0, action) => {
    switch (action.type) {
        case 'addtoy': {
            return state + action.data;
        }
        default: {
            return state;
        }
    }
}
const reducerPen = (state = 0, action) => {
  switch (action.type) {
    case "addpen": {
    //   return state + action.data;
          return produce(state, (draft) => {
            draft = action.data + state;
          });
    }
    default: {
      return state;
    }
  }
};
const rootReducer = combineReducer({
  reducerToy,
  reducerPen,
});
// -----------------------------------------------------------------------
// async
const fetchUsers = () => {
  return function (dispatch) {
    axios
      .get("http://localhost:3001/order/details/1")
      .then((response) => {
        // response.data is the users
        // const users = response.data.map((user) => user.id);
        console.log(response.data);
        dispatch(addNum(10));
      })
        .catch((error) => {
          console.log(error);
        // error.message is the error message
        // dispatch(fetchUsersFailure(error.message));
      });
  };
};
// -----------------------------------------------------------------------
// store
// const store = legacy_createStore(rootReducer, applyMiddleware(logger));
const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

console.log('Initial State', store.getState());

const unsubscribe = store.subscribe(() => {
  console.log("Updated state ", store.getState());
});

store.dispatch(fetchUsers());
// store.dispatch(addNum(10));
// store.dispatch(addNum(10));
// store.dispatch(addToy(10));
// store.dispatch(addNum(10));
// store.dispatch(addNum(10));

// unsubscribe is not needed during async function call
// unsubscribe(); 


