import React from 'react';
import { render, screen } from '@testing-library/react';
import NameInitials from './NameInitials';

test('Show User Name', () => {
  render(<NameInitials name="Jhon Doe" />);
  const nameInitials = screen.getByTestId('nameInitials-span');
  expect(nameInitials.querySelector('span')?.innerHTML).toContain('JD');
});

test('Classes for wrapper', async () => {
  render(<NameInitials name="" className="test-class"></NameInitials>);
  const nameInitials = screen.getByTestId('nameInitials-span');
  expect(nameInitials.getAttribute('class')).toContain('test-class');
});
