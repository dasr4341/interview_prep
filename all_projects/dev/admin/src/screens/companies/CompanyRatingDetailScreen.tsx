/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useLocation } from 'react-router-dom';
import HappyFaceIcon from '../../assets/images/happy_face.svg';
import UnHappyFaceIcon from '../../assets/images/unhappy_face.svg';
import NeutralFaceIcon from '../../assets/images/neutral_face.svg';
import { GetCompanyRating } from 'generatedTypes';
import { useLazyQuery } from '@apollo/client';
import DateFormat from 'components/DateFormat';
import { useEffect } from 'react';
import { GetCompanyRatingQuery } from 'lib/query/company/company-rating';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import 'scss/modules/_company-rating.scss';
import queryString from 'query-string';
import Card from 'components/ui/card/Card';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-6 empty"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CompanyRatingDetailScreen(): JSX.Element {
  const location = useLocation();
  const { companyId } = queryString.parse(location.search);

  const [getRating, { data: companyRating, error }] = useLazyQuery<GetCompanyRating>(GetCompanyRatingQuery, {
    variables: {
      companyId: companyId,
    },
  });

  useEffect(() => {
    getRating();
  }, []);

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

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyDetailRating.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Rating Detail" disableGoBack={false} />
      <ContentFrame>
        {error && <ErrorMessage message={error.message} />}

        {companyRating?.pretaaGetCompanyRating && (
          <Card className="border pt-5 px-5">
            <div className="border-b-2 border-gray-200 mb-4">
              <div className="grid grid-cols-8 space-x-4 mb-4 items-center">
                <div className="col-start-1 col-end-3">
                  <h3 className="ml-2 text-base lg:text-xmd font-semibold text-gray-600">Rating:</h3>
                </div>
                <div className="col-start-3 col-span-2">
                  <div className="flex flex-row items-center">
                    <img
                      src={getFaceIcon(companyRating?.pretaaGetCompanyRating?.rating?.status as string)}
                      alt={`${companyRating?.pretaaGetCompanyRating?.rating?.status as string}`}
                      className="w-6 h-6"
                    />
                    <h3 className="ml-2 text-xmd  mt-1 text-black">{companyRating?.pretaaGetCompanyRating?.rating?.status as string}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 sm:grid-cols-1">
              <div className="flex flex-col w-full">
                {companyRating?.pretaaGetCompanyRating?.comment && (
                  <div className="p-1 mb-5">
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Comment:</h3>
                    <h3 className="text-base text-black mb-1" data-testid="rating_comments">
                      {companyRating?.pretaaGetCompanyRating?.comment}
                    </h3>
                  </div>
                )}

                {companyRating?.pretaaGetCompanyRating?.rating?.status && (
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="p-1 mb-5">
                      <h3 className="text-gray-600 text-sm font-medium mb-1">Rating Submitted On:</h3>
                      <h3 className="text-base text-black mb-1">
                        <DateFormat date={companyRating?.pretaaGetCompanyRating?.createdAt} />
                      </h3>
                    </div>
                    <div className="p-1 mb-5">
                      <h3 className="text-gray-600 text-sm font-medium mb-1">Submitted By</h3>
                      <h3 className="text-base text-black mb-1">
                        {companyRating?.pretaaGetCompanyRating?.user?.firstName} {companyRating?.pretaaGetCompanyRating?.user?.lastName}
                      </h3>
                    </div>
                  </div>
                )}

                <div className="p-1 mb-5">
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Team</h3>
                  <h3 className="text-base text-black mb-1">{companyRating?.pretaaGetCompanyRating?.user?.department}</h3>
                </div>
              </div>
            </div>
          </Card>
        )}
      </ContentFrame>
    </>
  );
}
