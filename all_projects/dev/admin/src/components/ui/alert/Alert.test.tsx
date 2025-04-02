import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Alert from './Alert';

afterEach(cleanup);

test('Alert close on button click', () => {
  const onClose = jest.fn();
  render(
    <Alert onClose={onClose}>
      <h1>Alert</h1>
      <button>close</button>
    </Alert>
    );
  fireEvent.click(screen.getByTestId('btn-close'));
  expect(onClose).toHaveBeenCalled();
});

