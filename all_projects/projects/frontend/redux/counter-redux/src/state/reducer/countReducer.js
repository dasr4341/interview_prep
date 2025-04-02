const reducer = (state = [],action) => {
  console.log("count reducer is called ", action.type);
  switch (action.type) {
    case "increase": {
      console.log("in reducer - > increase",action);
          return [action.data, ...state];
    }
    case "decrease": {
          console.log("in reducer - > decrease", action);
          if (state.length > 0) {
              state.length = state.length - 1
          } 
       return [...state];
      }
      case 'test': {
          console.log('reducer from count');
          return [action.data,...state];
    }
    default: {
      return state;
    }
  }
};
export default reducer;