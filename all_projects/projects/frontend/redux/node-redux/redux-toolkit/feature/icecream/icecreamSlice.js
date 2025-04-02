const createSlice = require('@reduxjs/toolkit').createSlice;

const initialState = { 
    noOfIceCream : 10
}

const icecreamSlice = createSlice({
  name: "icecream",
  initialState,
  reducers: {
    orderIceCream: (state, action) => {
      state.noOfIceCream--;
    },
    restocked: (state, action) => {
      state.noOfIceCream += action.payload;
    },
  },
});

module.exports = icecreamSlice.reducer;
module.exports.action = icecreamSlice.actions;
