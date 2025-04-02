const store = require('./app/store')
const cakeAction = require("./feature/cake/cakeSice").cakeActions;
const icecreamAction = require("./feature/icecream/icecreamSlice").action;

console.log('initial stage', store.getState());

const unsubscribe = store.subscribe(() => {
    console.log('updated state',store.getState());
})

store.dispatch(icecreamAction.orderIceCream());
// store.dispatch(cakeAction.ordered());


unsubscribe();