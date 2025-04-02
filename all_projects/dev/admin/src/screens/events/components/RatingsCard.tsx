/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { GetRatingDetails, GetRatingDetailsVariables } from 'generatedTypes';
import React, { useEffect } from 'react';
import { LabeledValue } from 'components/LabeledValue';
import DateFormat from 'components/DateFormat';
import { GetRatingQuery } from 'lib/query/company/get-rating';

const RatingsCard = ({ ratingId }: { ratingId: string }) => {
  const [getData, { data: companyRating }] = useLazyQuery<GetRatingDetails, GetRatingDetailsVariables>(GetRatingQuery, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (ratingId) {
      getData({
        variables: {
          ratingId
        }
      });
    }
    
  }, [ratingId]);

  return (
    <>
      <div
        className="bg-white 
        px-5 py-6 border border-gray-200 rounded-xl">
        <LabeledValue label="Comments">{companyRating?.pretaaGetRatingDetails?.comment}</LabeledValue>
        <div className="grid grid-cols-2 gap-6 py-6">
          <LabeledValue label="Rating submitted on:">
            <DateFormat date={companyRating?.pretaaGetRatingDetails?.createdAt} />
          </LabeledValue>
          <LabeledValue label="Submitted by">
            {companyRating?.pretaaGetRatingDetails?.user.firstName}{' '}
            {companyRating?.pretaaGetRatingDetails?.user.lastName}
          </LabeledValue>
        </div>
        <LabeledValue label="Team">{companyRating?.pretaaGetRatingDetails?.user.department}</LabeledValue>
      </div>
    </>
  );
};

export default RatingsCard;
