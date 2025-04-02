import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { PretaaGetCompanyOpprtunities as PretaaGetCompanyOpprtunitiesQuery } from 'lib/query/company/get-opportunities';
import { routes } from 'routes';
import arrowIconRight from 'assets/icons/icon-arrow-right.svg';
import { GetCompanyOpportunities, GetCompanyOpportunitiesVariables } from 'generatedTypes';
import { TrackingApi } from 'components/Analytics';
import useQueryParams from 'lib/use-queryparams';

const OpportunitiesScreen = () => {
  const params = useParams();
  const queryPage: { count?: string; } = useQueryParams();

  const {
    data: opportunities,
    loading,
    error,
  } = useQuery<GetCompanyOpportunities, GetCompanyOpportunitiesVariables>(PretaaGetCompanyOpprtunitiesQuery, {
    variables: {
      companyId: String(params.companyId),
      take: 200,
    },
  });

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyOpportunities.name,
    });
  }, []);


  return (
    <>
      <ContentHeader title="Opportunities" count={queryPage.count ? Number(queryPage.count) : 0}></ContentHeader>
      <ContentFrame>
        {loading && !opportunities && (
          <div className="ph-item">
            <div className="ph-col-12">
              <div className="ph-row">
                <div className="ph-col-6 big"></div>
                <div className="ph-col-4 empty big"></div>
                <div className="ph-col-2 big"></div>
              </div>
            </div>
          </div>
        )}
        {error && <ErrorMessage message={error.message} />}
        {opportunities?.pretaaGetCompanyOpprtunities ? (
          <div>
            {opportunities.pretaaGetCompanyOpprtunities.map((opportunity) => {
              return (
                <Link
                  key={opportunity.id}
                  to={routes.companyOpportunityDetail.build(params.companyId as string, opportunity.id)}
                  className="bg-white rounded-t-xl flex justify-between items-center py-3 px-4"
                  data-test-id="opportunity-name">
                  <span className="text-primary font-bold text-base">{opportunity.name}</span>
                  <img src={arrowIconRight} alt="right-arrow" />
                </Link>
              );
            })}
          </div>
        ) : null}
      </ContentFrame>
    </>
  );
};

export default OpportunitiesScreen;
