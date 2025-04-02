import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Checkout from "./components/Checkout";
import Cancel from "./components/Cancel";
import Success from "./components/Success";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
// );

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Checkout />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;


