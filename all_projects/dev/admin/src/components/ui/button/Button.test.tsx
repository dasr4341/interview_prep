import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Button from './Button';

afterEach(cleanup);

test('Button render with style transparent', () => {
  render(<Button style="bg-none" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('hover:opacity-60 justify-center');
});

test('Button render with style danger', () => {
  render(<Button style="danger" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('btn-danger');
});

test('Button render with style no outline', () => {
  render(<Button style="no-outline" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('underline');
});

test('Button render with style other', () => {
  render(<Button style="other" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('justify-center');
});

test('Button render with style outline', () => {
  render(<Button style="outline" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('btn-light hover:border-primary');
});

test('Button render with style primary', () => {
  render(<Button style="primary" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('btn hover:border-primary');
});

test('Button type submit', () => {
  render(<Button type="submit" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('type')).toContain('submit');
});

test('Button type button', () => {
  render(<Button type="button" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('type')).toContain('button');
});

test('Button size large', () => {
  render(<Button size="lg" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('px-18 h-14');
});

test('Button size medium', () => {
  render(<Button size="md" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('py-2 px-6');
});

test('Button size small', () => {
  render(<Button size="xs" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('p-0');
});

test('Button text alignment left', () => {
  render(<Button align="left" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('justify-start');
});

test('Button text alignment right', () => {
  render(<Button align="right" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('justify-end');
});

test('Button disable', () => {
  render(<Button disabled testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('cursor-not-allowed');
});

test('Button add classes', () => {
  render(<Button classes="test" testId="button" />);
  const button = screen.getByTestId('button');
  expect(button.getAttribute('class')).toContain('test');
});

test('Button click handler check', () => {
  const showIcon = jest.fn();
  render(<Button testId="button" onClick={showIcon} />);
  const button =  screen.getByTestId('button');
  fireEvent.click(button);
  expect(showIcon).toHaveBeenCalledTimes(1);
});

test('Button loading state', () => {
  render(<Button testId="button" loading={true} />);
  expect(screen.getByTestId('loading')).toBeVisible();
});



