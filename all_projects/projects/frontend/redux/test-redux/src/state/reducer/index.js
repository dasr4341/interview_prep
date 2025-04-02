import { combineReducers } from 'redux';
import calculatorReducer from './calculatorReducer';

const reducers = combineReducers({
    basicCal : calculatorReducer
 })
export default reducers;