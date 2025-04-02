import React, { FC } from 'react';

interface Props {
  customer: string;
  client: string;
  csatScore: number;
  variable: number;
}

const HighCsatScore: FC<Props> = ({ customer, client, csatScore, variable }) => {
  return (
    <div
      className="bg-white text-primary 
  px-5 py-6 border border-gray-200 rounded-xl">
      {`The CSAT score of ${csatScore} for ${customer} is in the top ${variable}% of CSAT scores for ${client}.`}
    </div>
  );
};

export default HighCsatScore;
