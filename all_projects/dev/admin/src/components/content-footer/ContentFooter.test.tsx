import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentFooter } from './ContentFooter';

test('Content footer element', () => {
  render(
    <ContentFooter className="test" block={false}>
      <div className="block">
        <h1>Footer element</h1>
      </div>
    </ContentFooter>
  );
  const footer = screen.getByTestId('content-footer');
  expect(footer.getAttribute('class')).toContain('test');
  expect(footer.getElementsByTagName('h1')[0].textContent).toBe('Footer element');
  expect(footer.getElementsByTagName('div')[0]).toHaveClass('block');
});

