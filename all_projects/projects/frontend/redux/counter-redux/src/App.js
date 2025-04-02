import './App.css';
import { increaseCounter, decreaseCounter, testCounter } from "./state/action-creator/index";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { v4 as uuid } from "uuid";

function App() {
  const res = useSelector((state) => state);
  console.log(res);
  // console.log(`Price : ${res.countI.price} || ID : ${res.product}`);
  

  const dispatch = useDispatch();
  const data = {
    product: uuid(),
    price : 200
  };
  return (
    <div className="App">
      <button onClick={() => dispatch(increaseCounter(data))}>+</button>
      Cart
      <button onClick={() => dispatch(decreaseCounter(data))}>-</button>
      test
      <button onClick={() => dispatch(testCounter(data))}>**</button>
    </div>
  );
}

export default App;
