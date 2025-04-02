/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import NoDataFound from 'components/NoDataFound';
import { GetCompetitors, GetCompetitorsVariables } from 'generatedTypes';
import { range } from 'lodash';
import { GetCompetitorsQuery } from 'lib/query/company/get-competitors';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import queryString from 'query-string';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function CompetitorsScreen(): JSX.Element {
  const { id } = useParams() as any;
  const location = useLocation();
  const queryP = queryString.parse(location.search);

  const [getCompetitors, { data, loading, error }] = useLazyQuery<GetCompetitors, GetCompetitorsVariables>(GetCompetitorsQuery);

  useEffect(() => {
    if (queryP?.opportunityId)
      getCompetitors({
        variables: {
          companyId: id,
          opportunityId: queryP.opportunityId as string,
        },
      });
    else
      getCompetitors({
        variables: {
          companyId: id,
        },
      });
  }, []);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.competitors.name,
    });
  }, []);

  const competitors = data?.pretaaGetCompetitor ? data.pretaaGetCompetitor : [];

  return (
    <>
      <ContentHeader title="Competitors" />
      <ContentFrame>
        {loading &&
          !data &&
          range(0, 5).map(() => (
            <>
              <div className="ph-item">
                <div className="ph-col-12">
                  <div className="ph-row">
                    <div className="ph-col-12"></div>
                  </div>
                </div>
              </div>
            </>
          ))}
        {error && <ErrorMessage message={error.message} />}
        {!loading && competitors.length == 0 && <NoDataFound />}
        {competitors &&
          competitors.map((competitor) => {
            return (
              <div
                key={id}
                className={`flex items-center justify-between px-4 
                py-3 border-b last:border-0
              bg-white first:rounded-t-xl last:rounded-b-xl
              text-primary text-base font-bold`}
                data-test-id="competitors">
                {competitor.name}
              </div>
            );
          })}
      </ContentFrame>
    </>
  );
}
