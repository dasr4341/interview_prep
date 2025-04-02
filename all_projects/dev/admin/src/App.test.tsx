import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Login Screen should be available', () => {
  render(<App />);
  const email = screen.getByTestId('email');
  expect(email).toBeInTheDocument();
});
