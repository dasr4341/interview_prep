const createSlice = require("@reduxjs/toolkit").createSlice;

const initialState = {
  numOfCakes: 10,
};

// // creating the reducer and action creator
// // action are created by createSlice function automatically 
const cakeSlice = createSlice({
  name: "cake",
  initialState,
  reducers: {
    ordered: (state) => {
      state.numOfCakes--;
    },
    restocked: (state, action) => {
      state.numOfCakes += action.payload;
    },
  },
  extraReducers: {
    ["icecream/orderIceCream"]: (state, action) => {
      state.numOfCakes--;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cakeActions.ordered, (state) => {
      state.numOfIcecreams--;
    });
  },
});

module.exports = cakeSlice.reducer;
module.exports.cakeActions = cakeSlice.actions;