import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from '../Breadcrumb';
import {
  Router,
  Route,
  Link,
} from 'react-router-dom';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';


const About = () => (
  <>
  <Breadcrumb />
    <h1>About page</h1>
  </>
);
const Home = () => (
  <>
  <Breadcrumb />
    <h1>Home</h1>
  </>
);

function App() {
  const history = createMemoryHistory();

  return (
    <div>
      <Router history={history}>
      
      <Link to="/">Home</Link>
      <Link to="/help" data-testid="about">About</Link>
        <Route path="/" element={Home} /> 
        <Route path="/help" element={About} /> 
      </Router>
    </div>
  );
}


test('full app rendering/navigating', async () => {
  render(<App />);
  const els = await screen.findAllByTestId('breadcrumb');

  const aboutLink =  screen.getByTestId('about');
  aboutLink.click();

  const newLinks = await screen.findAllByTestId('breadcrumb');
  expect(newLinks[0].childElementCount).toBe(2);
  expect(els[0].innerHTML).toContain('home');

});