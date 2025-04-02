import './App.css';
import { add } from './state/action-creators/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// import { v4 as uuid } from "uuid";

function App() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.basicCal);
  console.log(data);
  return (
    <div className="App">
      <button onClick={() => dispatch(add(Math.random(0, 3)))}>ADD</button>
    </div>
  );
}

export default App;
