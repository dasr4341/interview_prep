import React from 'react';
import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';

afterEach(cleanup);

test('check uncheck test', () => {
  const onChange = jest.fn();
  render(<ToggleSwitch checked={true} onChange={onChange} 
  data-testid="toggle-testid" />);
  const toggleCheck = screen.getByTestId('toggle-testid');
  fireEvent.click(toggleCheck);
  expect(toggleCheck).toBeChecked();
});
