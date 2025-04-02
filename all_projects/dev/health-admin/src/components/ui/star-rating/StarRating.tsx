import Star from 'components/icons/Star';
import { range } from 'lodash';
import React, { useEffect, useState } from 'react';

export default function StarRating({
  onStarChange,
  defaultValue,
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
      {range(1, 6).map((e) => {
        return (
          <button
          data-test-id={e <= rating ? 'rating-active' : 'rating-inactive'}
            type="button"
            key={e}
            className={`mr-3 ${
              e <= rating ? 'text-yellow-900' : 'text-gray-400'
            }`}
            onClick={() => {
              setRating(e);
              onStarChange(e);
            }}>
            <Star className='w-9 h-9' />
          </button>
        );
      })}
    </div>
  );
}
