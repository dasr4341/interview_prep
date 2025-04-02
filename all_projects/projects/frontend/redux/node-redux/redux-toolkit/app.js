const configureStore = require('@reduxjs/toolkit').configureStore;
const action = require("./feature/icecream/icecreamSlice").action;
const reducer = require('./feature/icecream/icecreamSlice');


const store = configureStore({
    reducer: reducer
})

console.log('Initial state', store.getState());
const unsubscribe = store.subscribe(() => {
    console.log("updated state",store.getState());
})

store.dispatch(action.orderIceCream());
store.dispatch(action.orderIceCream());
store.dispatch(action.orderIceCream());
store.dispatch(action.restocked(1));
store.dispatch(action.orderIceCream());