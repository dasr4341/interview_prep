import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import StarRating from './StarRating';

afterEach(cleanup);

test('Star changes on click', async () => {
  const starCount = jest.fn();
  render(<StarRating onStarChange={starCount} />);
  const starRatings = await screen.findAllByTestId('rating-inactive');
  fireEvent.click(starRatings[2]);
  expect(starCount).toHaveBeenCalledWith(3);

  

  starRatings.filter((el, i) => i < 2).forEach((el) => {
    expect(el.getAttribute('class')).toContain('text-yellow');
  });

});


test('Star Default value', async () => {
  const starCount = jest.fn();
  render(<StarRating onStarChange={starCount}  defaultValue={2}/>);
  const starRatings = await screen.findAllByTestId('rating-active');
  expect(starRatings.length).toBe(2);
});