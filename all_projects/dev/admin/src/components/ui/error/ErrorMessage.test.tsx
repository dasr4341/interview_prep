import React from 'react';
import { screen, render, cleanup } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

afterEach(cleanup);

test('render message in component', () => {
  render(<ErrorMessage message="There is an error in component" data-testid="error-id" />);
  const errorMsg = screen.getByTestId('error-id');
  expect(errorMsg).toHaveTextContent('There is an error in component');
});