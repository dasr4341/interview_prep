/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import { FadeOverlay } from 'components/FadeOverlay';
import { useEffect, useRef, useState } from 'react';
import { ContentFrame } from '../../components/content-frame/ContentFrame';
import { ErrorMessage } from '../../components/ui/error/ErrorMessage';
import { SearchField } from '../../components/SearchField';
import { TagLozenge } from '../../components/TagLozenge';
import FilterToggler from 'components/FilterToggler';
import {
  GetCompanyFilteredEvents_getCompanyFilteredEvents,
  GetCompanyForEvent,
  GetCompanyForEventVariables,
  GetEvents_getFilteredEvents,
  GetEventsVariables,
} from 'generatedTypes';
import EventView from 'screens/events/components/EventView';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventApi } from 'lib/api';
import createQueryVariables, { buildQueryURL, parseQueryURL } from 'lib/url-query';
import { UrlQuery, UrlQueryOptions } from 'interface/url-query.interface';
import { range } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { getCompanyForEvent } from 'lib/query/company/company';
import React from 'react';
import EmptyFilter from 'components/EmptyFilter';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';
import FooterVirtualScroll from 'components/FooterVirtualScroll';

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

export default function EventsScreen(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const queryP = parseQueryURL(location.search);
  const defaultEventQuery: GetEventsVariables = {
    phrase: '',
    selectedOptions: [],
    companyId: String(queryP.companyId),
  };
  const [eventFilters, setEventFilters] = useState<UrlQueryOptions[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<UrlQueryOptions[]>([]);
  const [eventGQlQuery, setEventGQlQuery] = useState<Partial<GetEventsVariables>>(defaultEventQuery);
  const [queryJson, setQueryJson] = useState<UrlQuery>();
  const [events, setEvents] = useState<
    GetEvents_getFilteredEvents[] | GetCompanyFilteredEvents_getCompanyFilteredEvents[]
  >([]);
  const [queryParams, setQueryParams] = useState<{ count?: string; companyId?: string }>();
  const [isReference, setIsReference] = useState(false);
  const [isTimeLine, setIsTimeLine] = useState(false);
  const [queryParamsUpdate, setQueryParamsUpdate] = useState(false);
  const [getCompany, { data: companyData, loading }] = useLazyQuery<GetCompanyForEvent, GetCompanyForEventVariables>(
    getCompanyForEvent
  );
  const list = useRef<any>();
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  async function getEvents() {
    setError(null);
    try {
      const q: GetEventsVariables = {
        ...eventGQlQuery,
        userEventsWhere: {
          userId: {
            equals: user?.id,
          },
        },
        notesWhere: {
          userId: {
            equals: user?.id,
          },
        },
      } as GetEventsVariables;

      if (queryP?.companyId) {
        const results = await eventApi().getCompanyEvents(q);
        setEvents(results);
      } else {
        const results = await eventApi().getEvents(q);
        setEvents(results);
      }

      if (list.current) {
        const elm = list.current as VirtuosoHandle;
        elm.scrollTo({ top: 0 });
      }

    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setLoadingData(false);
  }

  async function getFiltersOptions() {
    try {
      const options = await eventApi().getEventFilter(queryParams?.companyId);
      setEventFilters(options);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }

  useEffect(() => {
    const prevQuery = parseQueryURL(location.search);
    setFilterOptions(prevQuery.options as UrlQueryOptions[]);
    setQueryJson(prevQuery);
    setEventGQlQuery(createQueryVariables(prevQuery) as GetEventsVariables);
    setQueryParams(prevQuery as any);

    if (prevQuery.companyId) {
      getCompany({
        variables: {
          companyId: prevQuery.companyId,
        },
      });
    }

    if (prevQuery.reference) {
      setIsReference(prevQuery.reference);
    } else if (prevQuery?.timeline) {
      setIsTimeLine(prevQuery?.timeline);
    } else {
      setIsTimeLine(false);
      setIsReference(false);
    }
    setQueryParamsUpdate(true);
  }, [location.search]);

  /**
   * Update GQL query and update URL state
   */
  function filterEvents({ options, phrase, filterRange }: UrlQuery) {
    const urlQuery = buildQueryURL({
      options,
      phrase,
      filterRange,
      prevQuery: parseQueryURL(location.search),
    });

    navigate({ pathname: location.pathname, search: urlQuery });
    const q = parseQueryURL(urlQuery);
    setEventGQlQuery(createQueryVariables(q));
    setFilterOptions(q.options as UrlQueryOptions[]);
    setEvents([]);
    setLoadingData(true);
  }


  function setAllDataLoaded(count: number) {
    if (count === 0) {
      setNoMoreData(true);
    }
  }

  async function loadMore() {
    try {
      const prevEvents = events ? events : [];

      const query: GetEventsVariables = {
        ...(eventGQlQuery as GetEventsVariables),
        lastId: events ? events[events?.length - 1]?.id : '',
        // userEventsWhere: {
        //   userId: {
        //     equals: user?.id,
        //   },
        // },
      };

      if (queryP?.companyId) {
        const newEvents = await eventApi().getCompanyEvents(query);
        const allData = prevEvents.concat(newEvents) as unknown as GetCompanyFilteredEvents_getCompanyFilteredEvents[];
        setEvents(allData);
        setAllDataLoaded(newEvents.length);
      } else {
        const newEvents = await eventApi().getEvents(query);
        const allData = prevEvents.concat(newEvents) as unknown as GetEvents_getFilteredEvents[];
        setEvents(allData);
        setAllDataLoaded(newEvents.length);
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }

  const handleEventHideAt = (id: string) => {
    const eventObj = events?.filter((e) => id !== e.id);
    const allData = eventObj as unknown as GetEvents_getFilteredEvents[];
    setEvents(allData);
  };

  

  function rowRendererVirtue(
    index: number,
    event: any,
  ) {
    return (
      <>
      <EventView
        key={event?.id}
        event={event}
        viewType={companyData?.pretaaGetCompany?.name ? 'timeline' : 'list'}
        onChange={(id) => {
          handleEventHideAt(id);
        }}
      />
      </>
    );
  }


  function handleEndReach() {
    if (!noMoreData) {
      loadMore();
    }
  }

  const footerComponent = () => {
    return (
      <FooterVirtualScroll noMoreData={noMoreData} list={events} />
    );
  };

  const eventsView = (
    <Virtuoso
      ref={list}
      data={events}
      endReached={handleEndReach}
      overscan={200}
      itemContent={rowRendererVirtue}
      components={{ Footer: footerComponent }}
    />
  );

  const filterRangeChange = () => {
    filterEvents({ filterRange: null });
    delete eventGQlQuery.filterRange;
    setEventGQlQuery(eventGQlQuery);
  };

  const eventTitle = () => {
    if (isTimeLine) {
      return companyData?.pretaaGetCompany?.name ? `${companyData?.pretaaGetCompany?.name}'s Timeline` : '';
    } else if (isReference) {
      return 'Reference List';
    } else {
      return !loading ? 'Events' : '';
    }
  };

  const clearAllEventFilter = () => {
    setEvents([]);
    filterEvents({ phrase: '', options: [], filterRange: null });
    const updatedEventFilters =
      eventFilters?.map((item) => ({
        ...item,
        checked: false,
      })) || [];
    setEventFilters(updatedEventFilters);
  };


  useEffect(() => {
    if (queryParamsUpdate) {
      getEvents();
    }
  }, [eventGQlQuery]);

  useEffect(() => {
    getFiltersOptions();
  }, [queryParams?.companyId]);


  const clearAll = () => {
    return (
      <div
        className="py-1 sm:px-15 px-5 text-right bg-gray-50 w-full
         lg:left-0 lg:-mt-8 lg:z-10">
        <button className="underline font-medium text-sm cursor-pointer text-gray-150" onClick={clearAllEventFilter}>
          Clear All
        </button>
      </div>
    );
  };

  const breadCrumbVisible = () => {
    return isTimeLine || isReference;
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.events.name,
    });
  }, []);

  return (
    <>
      <ContentHeader
        disableGoBack={!companyData}
        titleLoading={true}
        title={events ? eventTitle() : ''}
        count={queryParams?.count ? +queryParams?.count : 0}
        breadcrumb={breadCrumbVisible()}
        className="lg:sticky">
        {!isReference && (
          <React.Fragment>
            <div className="flex items-center space-x-4 my-3">
              <SearchField
                defaultValue={queryJson?.phrase as string}
                onSearch={(phrase: string) => {
                  filterEvents({ phrase });
                }}
              />
              <FilterToggler
                defaultValue={queryJson?.filterRange}
                filterOptions={eventFilters}
                selectedOptions={filterOptions}
                onChange={(options, filterRange) => {
                  filterEvents({ options, filterRange });
                }}
                testid="event-filter"
              />
            </div>
            <div
              className="flex flex-shrink-0 pr-4 flex-row flex-wrap w-full select-none -mr-16 no-scrollbar pb-4">
              <TagLozenge
                onChange={(options) => {
                  filterEvents({ options });
                }}
                tags={filterOptions}
                filterRange={queryJson?.filterRange as string}
                onFilterChange={filterRangeChange}
              />
            </div>
          </React.Fragment>
        )}
        <FadeOverlay />
      </ContentHeader>
      <ContentFrame className="flex flex-col flex-1">
        {(Object.keys(filterOptions).length > 0 || queryJson?.phrase || queryJson?.filterRange) && clearAll()}
        {error && <ErrorMessage message={error} />}
        {loadingData && events.length === 0 && <Loading />}
        {!loadingData && events.length === 0 && !error && <EmptyFilter />}
        {eventsView}
      </ContentFrame>
    </>
  );
}
