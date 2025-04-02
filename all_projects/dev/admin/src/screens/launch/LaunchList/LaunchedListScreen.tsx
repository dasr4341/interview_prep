/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import LaunchRow from 'screens/launch/LaunchList/LaunchRow';
import { NavigationHeader } from 'components/NavigationHeader';
import { GetLaunches_pretaaGetLaunchActions, PretaaGetOpportunityLaunches_pretaaGetOpprtunityLaunches } from 'generatedTypes';
import { useEffect, useRef, useState } from 'react';
import catchError from 'lib/catch-error';
import launchesApi from 'lib/api/launch';
import { range } from 'lodash';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { ApolloError } from '@apollo/client';
import useQueryParams from 'lib/use-queryparams';
import NoDataFound from 'components/NoDataFound';
import { routes } from 'routes';
import { TrackingApi } from 'components/Analytics';
import { Virtuoso } from 'react-virtuoso';

export function Loading() {
  return (
    <>
      {range(0, 5).map((i) => (
        <div className="ph-item" key={i}>
          <div className="ph-col-12">
            <div className="ph-row">
              <div className="ph-col-6"></div>
              <div className="ph-col-4 empty"></div>
              <div className="ph-col-2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function LaunchedListScreen() {
  const query: {
    eventId: string;
    companyId: string;
    count: string;
    opportunityId: string;
  } = useQueryParams();

  const [launchList, setLaunchList] = useState<GetLaunches_pretaaGetLaunchActions[] | PretaaGetOpportunityLaunches_pretaaGetOpprtunityLaunches[]>([]);
  const [error, setError] = useState<string | null>(null);

  const list = useRef<any>();
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  function setAllDataLoaded(count: number) {
    if (count === 0) {
      setNoMoreData(true);
    }
  }

  const getVariableValue = () => {
    let launchesVariable = {};
    if (query?.eventId) {
      launchesVariable = {
        eventId: query.eventId,
      };
    } else if (query?.companyId) {
      launchesVariable = {
        companyId: query.companyId,
      };
    } else if (query?.opportunityId) {
      launchesVariable = {
        opportunityId: query.opportunityId,
      };
    }
    return launchesVariable;
  };

 

  async function getLaunchList() {
    try {
      setError(null);
      if (query?.opportunityId) {
        const result = await launchesApi().getOpportunityLaunches({
          opportunityId: query?.opportunityId,
          take: 20,
          skip: 0,
        });
        setLaunchList(result.data.pretaaGetOpprtunityLaunches || []);
        setAllDataLoaded(result.data.pretaaGetOpprtunityLaunches?.length || 0);
      } else {
        const vars = getVariableValue();
        const result = await launchesApi().getLaunches({
          ...vars,
          take: 20,
          skip: 0,
        });
        setLaunchList(result.data.pretaaGetLaunchActions);
        setAllDataLoaded(result.data.pretaaGetLaunchActions?.length || 0);
      }
    } catch (err) {
      catchError(err);
      if (err instanceof ApolloError) {
        setError(err.message);
      }
    }
    setLoadingData(false);
  }

  async function loadMore() {
    try {
      if (query?.opportunityId) {
        const result = await launchesApi().getOpportunityLaunches({
          opportunityId: query?.opportunityId,
          take: 20,
          skip: launchList?.length,
        });
        setAllDataLoaded(result.data.pretaaGetOpprtunityLaunches?.length || 0);
        if (result?.data?.pretaaGetOpprtunityLaunches) {
          setLaunchList(launchList.concat(result?.data?.pretaaGetOpprtunityLaunches));
        }
        
      } else {
        const vars = getVariableValue();
        const result = await launchesApi().getLaunches({
          ...vars,
          take: 20,
          skip: launchList?.length,
        });
        setAllDataLoaded(result.data.pretaaGetLaunchActions?.length || 0);

        if (result?.data?.pretaaGetLaunchActions) {
          setLaunchList(launchList?.concat(result?.data?.pretaaGetLaunchActions as any));
        }
        
      }
    } catch (err) {
      catchError(err);
      if (err instanceof ApolloError) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    getLaunchList();
  }, [query.companyId, query.opportunityId, query.eventId]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.launchedList.name,
    });
  }, []);

  function handleEndReach() {
    if (!noMoreData) {
      loadMore();
    }
  }

  function rowRendererVirtue(
    index: number,
    launch: any,
  ) {
    return (
      <>
        <LaunchRow launch={launch} key={launch.id} />
      </>
    );
  }

  const footerComponent = () => {
    return (
      <div className='text-center py-4 text-gray-150'>
        {!noMoreData && launchList.length > 0 && (
          <>Loading ...</>
        )}
        {noMoreData && launchList.length > 0 && (
          <>No more data!</>
        )}
      </div>
    );
  };

  function getLink() {
    if (query.eventId) {
      return routes.eventDetail.build(query.eventId);
    } else if (query.opportunityId ) {
      return routes.companyOpportunityDetail.build(query.companyId, query.opportunityId);
    } else {
      routes.companyDetail.build(query.companyId);
    }
  }

  return (
    <>
      <ContentHeader
        link={getLink()}>
        <NavigationHeader>
          <div className="block relative text-primary mb-5 mt-2 cursor-pointer">
            Launched
            {query?.count && <span className="text-orange"> ({query?.count})</span>}
          </div>
        </NavigationHeader>
      </ContentHeader>
      <ContentFrame>
        {error && <ErrorMessage message={error} />}
        {loadingData && <Loading />}
        {!loadingData && launchList?.length === 0 && !error && <NoDataFound />}

        <Virtuoso
          style={{ height: '70vh' }}
          ref={list}
          data={launchList}
          endReached={handleEndReach}
          overscan={200}
          itemContent={rowRendererVirtue}
          components={{ Footer: footerComponent }}
        />
      </ContentFrame>
    </>
  );
}
