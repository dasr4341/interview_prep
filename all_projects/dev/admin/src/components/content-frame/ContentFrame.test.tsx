import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentFrame } from './ContentFrame';


test('Content frame default style with class', () => {
  render(
    <ContentFrame className="test">
      <div>Frame element</div>
    </ContentFrame>
  );

  const footer = screen.getByTestId('content-frame');
  expect(footer.getAttribute('class')).toContain('test');
  expect(footer.getElementsByTagName('div')[0].textContent).toBe('Frame element');
});

test('Content frame default style type with footer', () => {
  render(
    <ContentFrame type="with-footer">
    </ContentFrame>
  );

  const footer = screen.getByTestId('content-frame');
  expect(footer.getAttribute('class')).toContain('flex-grow h-full overflow-auto');
});
