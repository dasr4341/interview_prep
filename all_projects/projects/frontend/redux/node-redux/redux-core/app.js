const legacy_createStore = require('redux').legacy_createStore;
// action
const addAction = (data) => {
    return {
        type: 'add',
        payLoad: data
    }
}

// reducer
const initialState = {
    noOfApples: 10,
    sam: 10,
    ram: 2,
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add':
            state.noOfApples = action.payLoad;
            return state
        default:
            return state;
    }
}

// store
const store = legacy_createStore(reducer)

console.log('initial state', store.getState());
const unsubscribe = store.subscribe(() => {
    console.log('Updated state',store.getState());
})

store.dispatch(addAction(100));
store.dispatch(addAction(100));
store.dispatch(addAction(100));