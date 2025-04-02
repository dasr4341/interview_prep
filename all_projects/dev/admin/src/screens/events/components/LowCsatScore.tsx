import React, { FC } from 'react';

interface Props {
  csatScore: string;
  customer: string;
  variable: string;
  client: string;
}

const LowCsatScore: FC<Props> = ({ csatScore, customer, variable, client }) => {
  return (
    <div
      className="bg-white text-primary px-5
 py-6 border border-gray-200 rounded-xl">
      {`The CSAT score of ${csatScore} for ${customer} is in the bottom ${variable}% of CSAT scores for ${client}.`}
    </div>
  );
};

export default LowCsatScore;
