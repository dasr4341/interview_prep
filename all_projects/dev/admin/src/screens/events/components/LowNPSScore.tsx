import React, { FC } from 'react';

interface Props {
  customer: string;
  npsScore: string;
  variable: string;
}

const LowNPSScore: FC<Props> = ({ customer, npsScore, variable }) => {
  return (
    <div
      className="bg-white text-primary px-5 py-6 border border-gray-200 rounded-xl">
      The NPS Score of {npsScore} for {customer} is in the bottom {variable}% of customers.
    </div>
  );
};

export default LowNPSScore;
