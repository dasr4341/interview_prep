/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useParams } from 'react-router-dom';
import { SearchField } from 'components/SearchField';
import { UrlQuery, TicketsFilterOptions, DateDataInterface, DaysOpenInterface } from 'interface/url-query.interface';
import { routes } from 'routes';
import { useEffect, useState } from 'react';
import TicketsFilterToggler from 'components/TicketsFilterToggler';
import Pagination from 'components/Pagination';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GetTicketsFilterOptionsQuery } from 'lib/query/tickets/get-tickets-filter-option';
import { GetTicketStatsQuery } from 'lib/query/tickets/get-tickets-stats';
import { GetTicketsFilterOptions, GetTicketStats, GetTicketsVariables, GetTickets_pretaaGetCompany, GetTickets_pretaaGetFilteredTickets } from 'generatedTypes';
import ticketsApi from 'lib/api/tickets';
import { TicketRow } from 'components/TicketRow';
import dayjs from 'dayjs';
import { TicketTagLozenge } from 'components/TicketTagLozenge';
import _ from 'lodash';
import { TrackingApi } from 'components/Analytics';
import loader from 'assets/images/loading_icon.gif';
import TicketStats from './CompanyTicket/TicketStats';
import NoDataFound from 'components/NoDataFound';

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

export default function CompanyTicketsScreen(): JSX.Element {
  const { id } = useParams() as any;
  const [ticketsData, setTicketsData] = useState<GetTickets_pretaaGetFilteredTickets[]>();
  const [ticketFilters, setTicketFilters] = useState<TicketsFilterOptions[]>();
  const [selectedTicketFilters, setSelectedTicketFilters] = useState<TicketsFilterOptions[]>();
  const [companyData, setCompanyData] = useState<GetTickets_pretaaGetCompany>();
  const [searchText, setSearchText] = useState<string>();
  const [daysOpenData, setDaysOpenData] = useState({ from: '', to: '' });
  const [dateData, setDateData] = useState({ startDate: '', endDate: '' });
  const [skip, setSkip] = useState(0);
  const [noMoreDataFound, setNoMoreDataFound] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const start = dayjs().subtract(30, 'day').toISOString();
  const end = dayjs().toISOString();


  const { data: filterOption } = useQuery<GetTicketsFilterOptions>(GetTicketsFilterOptionsQuery);
  const [getTicketStatistics, { data: ticketStats }] = useLazyQuery<GetTicketStats>(GetTicketStatsQuery);

  const getSelectedFilterList = (options: TicketsFilterOptions[]) => {
    const status = options?.filter((x) => x.checked && x.type === 'status').map((x) => x.value);
    const priority = options?.filter((x) => x.checked && x.type === 'priority').map((x) => x.value);
    const tickettype = options?.filter((x) => x.checked && x.type === 'tickettype').map((x) => x.label);
    return {
      status: status?.length ? status : [],
      priority: priority?.length ? priority : [],
      tickettype: tickettype?.length ? tickettype : [],
    };
  };

  const getTicketsList = async (variable: GetTicketsVariables) => {
    console.trace('filter tickets');
    variable = {
      ...variable,
      filterRange: {
        startDate: dayjs(variable.filterRange.startDate).format('MM/DD/YYYY'),
        endDate: dayjs(variable.filterRange.endDate).format('MM/DD/YYYY'),
      },
    };
    console.log({ variable });

    const response = await ticketsApi().getTickets(variable);
    
    if (response?.data?.pretaaGetCompany !== null && response?.data?.pretaaGetCompany !== undefined) {
      setCompanyData(response?.data?.pretaaGetCompany);
    }
    if (!response?.data?.pretaaGetFilteredTickets) {
      setNoMoreDataFound(true);
    } else {
      setTicketsData(response?.data?.pretaaGetFilteredTickets);
    }
    setDataLoader(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const variable: GetTicketsVariables = {
      companyIds: [String(id)],
      searchPhrase: searchText ? searchText : '',
      filterList: getSelectedFilterList(selectedTicketFilters || []),
      filterRange: {
        startDate: dateData?.startDate ? dateData?.startDate : start,
        endDate: dateData?.endDate ? dateData?.endDate : end,
      },
      skip,
      take: 10,
      companyId: String(id),
    };
    if (daysOpenData?.from && daysOpenData?.to)
      variable.daysOpenRange = {
        openFrom: Number(daysOpenData?.from),
        openTo: Number(daysOpenData?.to),
      };
    getTicketsList(variable);
  }, [id, skip, selectedTicketFilters, daysOpenData, dateData]);

  // Generate ticket status
  useEffect(() => {
    getTicketStatistics({
      variables: {
        companyIds: [String(id)],
        filterRange: {
          startDate: dateData?.startDate ? dateData?.startDate : start,
          endDate: dateData?.endDate ? dateData?.endDate : end,
        },
      },
    });
  }, [id, selectedTicketFilters, daysOpenData, dateData]);

  useEffect(() => {
    if (filterOption) {
      const options = filterOption?.pretaaGetTicketsFilterOptions?.map((option) => {
        return {
          label: option?.displayValue as string,
          value: option?.value as string,
          type: option?.type as string,
          checked: false,
          section: false,
        };
      });
      setTicketFilters(options);
    }
  }, [filterOption]);

  const filterTickets = ({ phrase }: UrlQuery) => {
    setSearchText(phrase);
    setSkip(0);
    setDataLoader(true);
    getTicketsList({
      companyIds: [String(id)],
      searchPhrase: phrase,
      filterList: getSelectedFilterList(selectedTicketFilters || []),
      filterRange: {
        startDate: dateData?.startDate ? dateData?.startDate : start,
        endDate: dateData?.endDate ? dateData?.endDate : end,
      },
      skip: 0,
      take: 10,
      companyId: id,
    });
  };

  function filterEvents({ options, phrase, filterRange }: UrlQuery) {
    console.log({ options, phrase, filterRange });
  }

  function applyChange(options: TicketsFilterOptions[], daysOpen: { from: string; to: string }, date: { startDate: string; endDate: string }) {
    setSkip(0);
    setSelectedTicketFilters(options);
    setDaysOpenData(daysOpen);
    setDateData(date);
    setDataLoader(true);
    const variable: GetTicketsVariables = {
      companyIds: [String(id)],
      filterList: getSelectedFilterList(options),
      filterRange: {
        startDate: date?.startDate ? date?.startDate : start,
        endDate: date?.endDate ? date?.endDate : end,
      },
      skip: 0,
      take: 10,
      companyId: id,
    };
    if (daysOpen?.from && daysOpen?.to)
      variable.daysOpenRange = {
        openFrom: Number(daysOpen?.from),
        openTo: Number(daysOpen?.to),
      };
    getTicketsList(variable);
  }


  const handleTagRemove = (options: TicketsFilterOptions, daysOpen: DaysOpenInterface, range: DateDataInterface) => {
    if (options) {
      if (selectedTicketFilters) {
        const list = _.cloneDeep(selectedTicketFilters);
        list[list?.findIndex((o) => o.label === options.label)].checked = false as boolean;
        setSelectedTicketFilters(list);
      }
    } else if (daysOpen) {
      setDaysOpenData({ from: '', to: '' });
    } else if (range) {
      setDateData({ startDate: '', endDate: '' });
    }
    setSkip(0);
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyTickets.name,
    });
  }, []);

  return (
    <>
      <ContentHeader 
        titleLoading={!companyData} 
        title={companyData ? `${companyData?.name}'s Tickets` : null} 
        link={routes.companyDetail.build(String(id))}>
        <div className="flex items-center lg:gap-4 gap-1">
          <SearchField
            defaultValue={''}
            onSearch={(phrase) => {
              filterTickets({ phrase });
            }}
          />
          <TicketsFilterToggler
            filterOptions={selectedTicketFilters ? selectedTicketFilters : ticketFilters || []}
            onChange={(options, filterRange) => {
              filterEvents({ options, filterRange });
            }}
            onApplyChange={applyChange}
            daysOpen={daysOpenData}
            dateRange={dateData}
          />
        </div>
        <div
          className="flex flex-shrink-0 flex-row flex-wrap w-full pr-4 mt-4
           select-none -mr-16 no-scrollbar pb-4">
          <TicketTagLozenge
            filterOption={selectedTicketFilters}
            onChange={(options: TicketsFilterOptions, daysOpen: DaysOpenInterface, range: DateDataInterface) => {
              handleTagRemove(options, daysOpen, range);
            }}
            daysOpenData={daysOpenData}
            dateData={dateData}
          />
        </div>
        <div className="border border-gray-400 mt-4 p-6 rounded-xl">
          <p className="text-gray-600 font-medium">
            Ticket Summary ({dayjs(ticketStats?.pretaaGetCompanyTicketStats?.fromDate).format('MM/DD/YY')} -{' '}
            {dayjs(ticketStats?.pretaaGetCompanyTicketStats?.toDate).format('MM/DD/YY')})
          </p>
          <div className="w-full grid sm:grid-cols-2">
            <div className="w-full mt-4">
              <div className="grid grid-cols-4">
                <div className="mr-6 h-full flex justify-between">
                  <div>
                    <span className="block text-pt-blue-300 text-md font-bold">{ticketStats?.pretaaGetCompanyTicketStats?.startingOpenTickets}</span>
                    <span className="text-gray-600 font-medium text-xxs">Starting - Open Tickets</span>
                  </div>
                  <div className="h-10 w-px bg-gray-600 mt-2 ml-3"></div>
                </div>
                <div className="mr-6 h-full flex justify-between">
                  <div>
                    <span className="block text-green text-md font-bold">{ticketStats?.pretaaGetCompanyTicketStats?.newOpenedTickets}</span>
                    <span className="text-gray-600 font-medium text-xxs">New "Opened" Tickets</span>
                  </div>
                  <div className="h-10 w-px bg-gray-600 mt-2 ml-3"></div>
                </div>
                <div className="mr-6 h-full flex justify-between">
                  <div>
                    <span className="block text-orange text-md font-bold">{ticketStats?.pretaaGetCompanyTicketStats?.totalClosedTickets}</span>
                    <span className="text-gray-600 font-medium text-xxs">Close Tickets</span>
                  </div>
                  <div className="h-10 w-px bg-gray-600 mt-2 ml-3"></div>
                </div>
                <div className="mr-6 h-full flex justify-between">
                  <div>
                    <span className="block text-pt-blue-300 text-md font-bold">{ticketStats?.pretaaGetCompanyTicketStats?.totalEndOpenTickets}</span>
                    <span className="text-gray-600 font-medium text-xxs">Ending Open Tickets</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:ml-auto mt-4 sm:mt-0">
              <div className="grid grid-cols-2 xl:mr-8">
                <div className="flex justify-between">
                  <div className="mx-4">
                    <TicketStats
                    overallDaysOpen={Number(ticketStats?.pretaaGetCompanyTicketStats?.overallDaysOpen) || 0}
                    avgDaysOpen={Number(ticketStats?.pretaaGetCompanyTicketStats?.avgDaysOpen) || 0}
                    title="Avg Days open"
                    />
                  </div>
                  <div className="h-8 w-px bg-gray-600 mt-8"></div>
                </div>
                <div>
                  <div className="mx-4">
                  <TicketStats
                    overallDaysOpen={Number(ticketStats?.pretaaGetCompanyTicketStats?.newTicketsOverallDaysOpen) || 0}
                    avgDaysOpen={Number(ticketStats?.pretaaGetCompanyTicketStats?.newTicketsAvgDaysOpen) || 0}
                    title="New Tickets"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentHeader>
      <ContentFrame>
        {ticketsData?.map((ticket, key) => {
          return <TicketRow ticket={ticket} key={key} />;
        })}
        {!ticketsData && !noMoreDataFound && <Loading />}
        {ticketsData?.length === 0 && !dataLoader && <NoDataFound />}
        {Number(ticketsData?.length) > 0 && skip > 0 && !dataLoader && (
          <>
            No More data!
          </>
        )}
        {dataLoader && (
          <div className="h-80 w-full flex items-center justify-center">
            <img src={loader} alt="loading..." width={30} height={30} className="mb-5" />
          </div>
        )}
        {(ticketsData && ticketsData?.length > 0 || skip > 0) && (
          <div className="mt-8">
            <Pagination pageSize={10} skip={skip} setSkip={setSkip} isPrevDisabled={!skip} isNextDisabled={(ticketsData && ticketsData?.length < 10) || noMoreDataFound} />
          </div>
        )}
      </ContentFrame>
    </>
  );
}
