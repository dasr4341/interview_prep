import { combineReducers } from 'redux';
import countReducer from "./countReducer";
import testReducer from "./testReducer";

const reducers = combineReducers({
  countI: countReducer,
  countD: testReducer,
});
export default reducers;