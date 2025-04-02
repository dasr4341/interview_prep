import Star from 'components/icons/Star';
import React, { useEffect, useState } from 'react';

export default function StarRating({
  onStarChange,
  defaultValue
}: {
  onStarChange: (star: number) => void
  defaultValue?: number;
}) {
  const [rating, setRating] = useState(0);
  useEffect(() => {
    if (defaultValue) {
      setRating(defaultValue);
    } else {
      setRating(0);
    }
  }, [defaultValue]);

  return (
    <div className="star-rating" data-test-id="star-rating">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
          data-test-id={index <= rating ? 'rating-active' : 'rating-inactive'}
            type="button"
            key={index}
            className={`mr-3 ${
              index <= rating ? 'text-yellow' : 'text-gray-400'
            }`}
            onClick={() => {
              setRating(index);
              onStarChange(index);
            }}>
            <Star />
          </button>
        );
      })}
    </div>
  );
}
