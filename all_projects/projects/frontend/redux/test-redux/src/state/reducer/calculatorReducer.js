const calculatorReducer = (state = 0, action) => {
  switch (action.type) {
      case "add": {
           console.log("reducer is called");
      return state + action.data;
    }
    default: {
      return state;
    }
  }
};
export default calculatorReducer;
