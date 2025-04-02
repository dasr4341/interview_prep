import DateFormat from 'components/DateFormat';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

import HappyFaceIcon from '../../../assets/images/happy_face.svg';
import UnHappyFaceIcon from '../../../assets/images/unhappy_face.svg';
import NeutralFaceIcon from '../../../assets/images/neutral_face.svg';
import { useQuery } from '@apollo/client';
import { GetCompanyRatingQuery } from 'lib/query/company/company-rating';
import { GetCompanyRating } from 'generatedTypes';

const getFaceIcon = (activatedFaceStatus: string) => {
  switch (activatedFaceStatus) {
    case 'HAPPY':
      return HappyFaceIcon;
    case 'UNHAPPY':
      return UnHappyFaceIcon;
    case 'NEUTRAL':
      return NeutralFaceIcon;
    default:
      return '';
  }
};

export default function CompanyRating({ companyId, className }: { companyId: string, className?: string }) {

  const { data: companyRating } = useQuery<GetCompanyRating>(GetCompanyRatingQuery, {
    variables: {
      companyId
    },
  });

  return (
    <>
      {companyRating?.pretaaGetCompanyRating?.rating.status && (
        <div className={className ? className : 'px-3'} data-testid="rating_block">
          <label className="block leading-loose text-gray-600 text-xs font-medium">
            Company Rating as of{' '}
            {companyRating?.pretaaGetCompanyRating?.createdAt && (
              <DateFormat date={companyRating?.pretaaGetCompanyRating?.createdAt} />
            )}
          </label>
          <Link
            to={routes.companyDetailRating.build({
              companyId,
            })}>
            {companyRating?.pretaaGetCompanyRating?.rating.status && (
              <img 
                data-test-id="rating-image"
                data-rating={companyRating?.pretaaGetCompanyRating?.rating.status}
                src={getFaceIcon(companyRating?.pretaaGetCompanyRating?.rating.status)}
               className="emoji-face" />
            )}
          </Link>
        </div>
      )}
    </>
  );
}
