import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { GetEventsVariables, GetEvents_getFilteredEvents, GetCompanyFilteredEvents_getCompanyFilteredEvents, CompanyType, EventType } from 'generatedTypes';
import { eventApi } from 'lib/api';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Link, useParams } from 'react-router-dom';
import EventView from 'screens/events/components/EventView';
import { Loading } from 'screens/events/EventsScreen';
import { routes } from 'routes';
import { TrackingApi } from 'components/Analytics';
import { Virtuoso } from 'react-virtuoso';
import FooterVirtualScroll from 'components/FooterVirtualScroll';
import useQueryParams from 'lib/use-queryparams';
import EmptyFilter from 'components/EmptyFilter';

export default function ReferenceListScreen() {
  const { id: companyId } = useParams();
  const queryPage: { count?: string; added: boolean; type?: string } = useQueryParams();
  const defaultEventQuery: GetEventsVariables = {
    phrase: '',
    selectedOptions: [EventType.POTENTIAL_REFERENCE],
    companyId,
  };
  const [showAddOption, setShowAddOption] = useState<boolean>(queryPage?.added);
  const [error, setError] = useState<string | null>(null);
  const [references, setReferences] = useState<GetEvents_getFilteredEvents[] | GetCompanyFilteredEvents_getCompanyFilteredEvents[]>([]);

  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  function setAllDataLoaded(count: number) {
    if (count === 0) {
      setNoMoreData(true);
    }
  }

  async function getReferences() {
    console.log('getting data first time');
    setError(null);
    try {
      const results = await eventApi().getCompanyEvents(defaultEventQuery);
      setReferences(results);
      setAllDataLoaded(results.length);

    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
    setLoadingData(false);
  }

  useEffect(() => {
    getReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMore() {
    try {
      const query: GetEventsVariables = {
        ...defaultEventQuery,
        lastId: references ? references[references?.length - 1]?.id : '',
      };
      const newReferences = await eventApi().getCompanyEvents(query) as any;
      const allReferences = references.concat(newReferences) as any;
      console.log('allReferences', allReferences);
      setReferences(allReferences);
      setAllDataLoaded(newReferences.length);
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }


  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyReferences.name,
    });
  }, []);

  function rowRendererVirtue(
    index: number,
    event: any,
  ) {
    return (
      <>
       <EventView
        key={event.id}
        event={event}
        viewType="list"
        isReference={true}
      />
      </>
    );
  }

  const footerComponent = () => {
    return (
      <FooterVirtualScroll noMoreData={noMoreData} list={references} />
    );
  };

  function handleEndReach() {
    if (!noMoreData) {
      loadMore();
    }
  }


  const referenceView = (
    <Virtuoso
      style={{ height: '70vh' }}
      data={references}
      endReached={handleEndReach}
      overscan={200}
      itemContent={rowRendererVirtue}
      components={{ Footer: footerComponent }}
    />

  );

  return (
    <div className='overflow-hidden'>
      <ContentHeader title="References" breadcrumb={false} count={queryPage.count ? Number(queryPage.count) : 0}></ContentHeader>
      {references.length !== 0 && (
        <div className="pl-16 pt-1 pb-1 bg-gray-300">
          <span className="text-primary italic text-sm">Reminder: Please contact account rep before reaching out!</span>
        </div>
      )}
      {showAddOption && (
        <div className="pl-10 pt-3 pb-3" style={{ backgroundColor: '#ED6513' }}>
          <span className="text-white text-base" data-test-id="reference-add-tagline">
            Reference Added.{' '}
            <Link
              to={queryPage.type === CompanyType.CUSTOMER ? routes.addCustomerReference.build(companyId as string) : routes.addOpportunityReference.build(companyId as string)}
              className="underline">
              {' '}
              Add another?
            </Link>
          </span>
          <button type="button" data-test-id="close-modal" onClick={() => setShowAddOption(false)} className="float-right outline-none mr-5">
            <IoMdClose className="text-lg text-white" />
          </button>
        </div>
      )}
      <ContentFrame className='flex flex-col flex-1'>
        {error && <ErrorMessage message={error} />}

        {loadingData && references.length === 0 && <Loading />}
        {!loadingData && references.length === 0 && !error && (
          <EmptyFilter allowLabel='Data is not available' />
        )}
        
        {references.length !== 0 && referenceView }
      </ContentFrame>
    </div>
  );
}
