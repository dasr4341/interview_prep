import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Card from './Card';

afterEach(cleanup);

test('Card Basic features', () => {
  render(<Card className="bg-primary">
    <h1>Card content</h1>
  </Card>);
  const card = screen.getByTestId('card');
  expect(card.getAttribute('class')).toContain('bg-primary');
  expect(card.getElementsByTagName('h1')[0].textContent).toBe('Card content');
});

