import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import BorderedRow from 'components/dashboard/BorderedRow';
import CardHeader from 'components/dashboard/CardHeader';
import Card from 'components/ui/card/Card';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import './dashboard.scoped.scss';
import rightArrow from '../../assets/images/right-arrow-blue.svg';
import DoughnutChart from '../../components/charts/DoughnutChart';
import LineChart from '../../components/charts/LineChart';
import { ChartData, ScatterDataPoint } from 'chart.js';
import { useLazyQuery } from '@apollo/client';
import {
  DateRangeTypes,
  pretaaGetCompaniesFilterOptions,
  pretaaGetCompaniesFilterOptionsVariables,
  pretaaGetCompanyInsights,
  pretaaGetCompanyInsightsVariables,
  GeneralCompaniesOptions,
  PretaaGetEventCountsByType,
  PretaaGetEventCountsByTypeVariables,
  PretaaGetCompaniesByEvents,
  PretaaGetCompaniesByEventsVariables,
  PretaaGetCompaniesByEvents_pretaaGetCompaniesByEvents,
} from 'generatedTypes';
import _ from 'lodash';
import dayjs from 'dayjs';
import { salesStageColors } from 'lib/constant/chartColor';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { LoadingIndicator } from 'components/LoadingIndicator';
import Popover, { PopOverItem } from 'components/Popover';
import { BsChevronDown, BsChevronRight, BsChevronUp } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import Popup from 'reactjs-popup';
import { getCompanyFilterOptionsQuery } from 'lib/query/company-insights/get-company-filter-options';
import { getCompanyInsightsQuery } from 'lib/query/company-insights/get-company-insights';
import AsyncSelect from 'react-select/async';
import { client } from 'apiClient';
import { GetEventCountsByTypeQuery } from 'lib/query/company-insights/get-event-counts';
import { GetCompaniesByEventsQuery } from 'lib/query/company-insights/get-companies-by-events';
import { routes } from 'routes';
import loader from 'assets/images/loading_icon.gif';
import hexToRgba from 'hex-to-rgba';
import Pagination from 'components/Pagination';
import { TrackingApi } from 'components/Analytics';

enum CompanyFilterGroups {
  COMPANIES = 'COMPANIES',
  TEAM_MEMBERS = 'TEAM_MEMBERS',
  GENERAL = 'GENERAL',
}

const normalizeCompanyFilterOptions = (result: pretaaGetCompaniesFilterOptions) => {
  const generalOptions = Object.keys(result.pretaaGetCompaniesFilterOptions.GENERAL).map((key) => ({
    label: result.pretaaGetCompaniesFilterOptions.GENERAL[key],
    value: key,
    group: CompanyFilterGroups.GENERAL,
  }));
  const companyOptions = {
    label: 'Companies',
    options: result.pretaaGetCompaniesFilterOptions.COMPANIES.slice(0, 4).map(({ id, name }) => ({
      value: id,
      label: name,
      group: CompanyFilterGroups.COMPANIES,
    })),
  };
  const teamMembersOptions = {
    label: 'Team Members',
    options: result.pretaaGetCompaniesFilterOptions.TEAM_MEMBERS.slice(0, 4).map(({ firstName, lastName, id }) => ({
      label: firstName + lastName,
      value: id,
      group: CompanyFilterGroups.TEAM_MEMBERS,
    })),
  };

  return [...generalOptions, companyOptions, teamMembersOptions];
};

export default function DashboardCompanyScreen() {
  const [activeLabel, setActiveLabel] = useState('');
  const [modal, setModal] = useState<boolean>(false);
  const [isActive, setActive] = useState(false);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<GeneralCompaniesOptions>();
  const [noMoreDataFound, setNoMoreDataFound] = useState(false);
  const [skip, setSkip] = useState(0);
  const [companiesList, setCompaniesList] = useState<PretaaGetCompaniesByEvents_pretaaGetCompaniesByEvents[]>([]);
  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);

  function onEventLabelClick(eventType: string) {
    if (activeLabel === eventType) {
      setActiveLabel(!activeLabel ? eventType : '');
    } else {
      setActiveLabel(eventType);
    }
  }

  const [selectedDateRange, setSelectedDateRange] = useState<{
    label: string;
    value: DateRangeTypes;
  }>({
    label: 'Week to Date',
    value: DateRangeTypes.WEEK_TO_DATE,
  });
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<{ label: string; value: string; group: CompanyFilterGroups } | undefined>();

  const [getCompanyInsights, { data: companyInsightsData }] = useLazyQuery<pretaaGetCompanyInsights, pretaaGetCompanyInsightsVariables>(getCompanyInsightsQuery);

  const [getEventCountsByType, { data: eventCounts, loading: eventCountsLoading }] = useLazyQuery<PretaaGetEventCountsByType, PretaaGetEventCountsByTypeVariables>(
    GetEventCountsByTypeQuery
  );

  const [getCompaniesByEvents, { data: companiesByEvents, loading: companiesByEventsLoading }] = useLazyQuery<PretaaGetCompaniesByEvents, PretaaGetCompaniesByEventsVariables>(
    GetCompaniesByEventsQuery,
    {
      onCompleted: (d) => {
        if (skip > 1) {
          if (d?.pretaaGetCompaniesByEvents?.length) {
            setNoMoreDataFound(false);
            return setCompaniesList(d?.pretaaGetCompaniesByEvents);
          } else {
            return setNoMoreDataFound(true);
          }
        } else {
          return setCompaniesList(d?.pretaaGetCompaniesByEvents ?? []);
        }
      },
    }
  );

  // ! We can do this as variable types for all these queries are same.
  const generateQueryVariables = useCallback(() => {
    // eslint-disable-next-line prefer-const
    let vars: pretaaGetCompanyInsightsVariables = {
      dateRangeType: selectedDateRange?.value || DateRangeTypes.WEEK_TO_DATE,
    };

    switch (selectedCompanyFilter?.group) {
      case CompanyFilterGroups.COMPANIES:
        vars.companyId = selectedCompanyFilter.value;
        break;

      case CompanyFilterGroups.GENERAL:
        vars.companyType = selectedCompanyFilter.value as GeneralCompaniesOptions;
        break;

      case CompanyFilterGroups.TEAM_MEMBERS:
        vars.reporteeUserId = selectedCompanyFilter.value;
        break;

      default:
        break;
    }

    if (CompanyFilterGroups.TEAM_MEMBERS && selectedCompanyTypes) {
      vars.companyType = selectedCompanyTypes;
    }

    return vars;
  }, [selectedCompanyFilter, selectedDateRange, selectedCompanyTypes]);

  useEffect(() => {
    const vars = generateQueryVariables();
    getCompaniesByEvents({
      variables: {
        ...vars,
        skip,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCompaniesByEvents, generateQueryVariables, skip]);

  useEffect(() => {
    const vars = generateQueryVariables();

    getCompanyInsights({
      variables: {
        ...vars,
      },
    });
    getEventCountsByType({
      variables: {
        ...vars,
      },
    });
  }, [getCompanyInsights, getEventCountsByType, selectedDateRange, selectedCompanyFilter, generateQueryVariables, selectedCompanyTypes]);

  useEffect(() => {
    if (modal) {
      const vars = generateQueryVariables();

      getCompaniesByEvents({
        variables: {
          ...vars,
        },
      });
    }
  }, [modal, getCompaniesByEvents, generateQueryVariables]);

  const countData = useMemo(
    () =>
      _.groupBy(
        activeLabel ? companyInsightsData?.pretaaGetEventsCountSeries.filter((event) => event.eventType === activeLabel) : companyInsightsData?.pretaaGetEventsCountSeries,
        'eventType'
      ),
    [activeLabel, companyInsightsData]
  );

  const data: ChartData<'line', (number | ScatterDataPoint | null)[], unknown> = useMemo(
    () => ({
      labels: Object.values(countData).map((e) => e[0].timeSeriesData?.map((d) => dayjs(d.date).format('MMM DD YYYY')))[0],
      datasets: (Object.keys(countData) ?? [])?.map((eventData) => {
        return {
          label: eventData,
          data: countData[eventData][0].timeSeriesData?.map((e) => e.count) || [],
          borderColor: 'transparent',
          backgroundColor: hexToRgba(salesStageColors[companyInsightsData?.pretaaGetEventsCountSeries.findIndex((i) => i.eventType === eventData) || 0], 0.5),
          fill: true,
        };
      }),
    }),
    [companyInsightsData, countData]
  );

  const toggleClass = () => {
    setActive(!isActive);
  };

  const handleClose = () => {
    setModal(false);
  };

  // Todo: need to fix this redirect
  const route =
    selectedDateRange && activeLabel
      ? `/events?filterRange=${selectedDateRange.value}&options=%5B%7B"label"%3A"${activeLabel.replace(' ', '%20')}"%2C"value"%3A"${_.upperCase(
          _.snakeCase(activeLabel)
        ).replaceAll(' ', '_')}"%2C"checked"%3Atrue%7D%5D`
      : `/events?filterRange=${selectedDateRange.value}`;

  const handleCompanyFilterChange = (inputValue: string, callback: (options: any) => void) => {
    (async () => {
      const { data: companyFilterOptions } = await client.query<pretaaGetCompaniesFilterOptions, pretaaGetCompaniesFilterOptionsVariables>({
        query: getCompanyFilterOptionsQuery,
        variables: {
          pretaaGetCompaniesFilterOptionsSearchPhrase2: inputValue,
        },
      });

      const normalizedData = normalizeCompanyFilterOptions(companyFilterOptions);

      callback(normalizedData);
    })();
  };

  const chartItems = useMemo(() => {
    if (eventCounts) {
      let chartData = eventCounts.pretaaGetEventCountsByType.map((i, index) => {
        return {
          ...i,
          // Preserve original data index, so that we can get correct color later on.
          index,
        };
      });
      chartData = chartData.filter((i) => {
        const eventType = _.startCase(_.toLower(i.eventType));
        if (activeLabel) {
          return eventType === activeLabel;
        }
        return true;
      });

      return {
        chartBgColors: chartData.map((i) => hexToRgba(salesStageColors[i.index], 0.5)),
        customChartData: chartData.map((i) => i.count),
        chartTotalValue: _.sum(chartData.map((i) => i.count)).toString(),
        labels: chartData.map((i) => _.startCase(_.toLower(i.eventType))),
      };
    }
  }, [activeLabel, eventCounts]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardEvent.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Company Insights" breadcrumb={false} disableGoBack={true}>
        <div className="flex items-center space-x-3 flex-col md:flex-row">
          <span className="text-gray-600">Filter By: </span>
          <Select
            className={`basic-single rounded-lg mb-1
             bg-white md:max-w-xs`}
            styles={customStyleSelectBox}
            options={dateRangeOptions} 
            onChange={(dateRange) => {
              if (dateRange) setSelectedDateRange(dateRange as { label: string; value: DateRangeTypes });
            }}
            placeholder="This week to date"
          />
          <AsyncSelect
            className={'basic-single rounded-lg mb-1 bg-white md:max-w-xs'}
            styles={customStyleSelectBox}
            defaultOptions
            loadOptions={handleCompanyFilterChange}
            value={selectedCompanyFilter}
            placeholder="All Companies"
            onChange={(item) => {
              if (item) {
                setSelectedCompanyFilter({ ...item });
                setActiveLabel('');
              }
            }}
            options={[]}
          />
        </div>
      </ContentHeader>
      {!eventCounts && eventCountsLoading && (
        <div className="h-full w-full flex-auto flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
      {eventCounts && (
        <ContentFrame>
          <Card className="border border-gray-350 mt-4">
            <div className="p-6">
              <CardHeader leftText="Events Types">
                {selectedCompanyFilter?.group === CompanyFilterGroups.TEAM_MEMBERS && (
                  <Popover
                    trigger={
                      <button className={isActive ? 'text-primary-light flex items-center' : 'text-gray-600 flex items-center'} onClick={toggleClass}>
                        {selectedCompanyTypes === GeneralCompaniesOptions.ALL_COMPANIES || (!selectedCompanyTypes && 'All Companies ')}
                        {selectedCompanyTypes === GeneralCompaniesOptions.ALL_CUSTOMERS && 'Customer'}
                        {selectedCompanyTypes === GeneralCompaniesOptions.ALL_PROSPECTS && 'Prospect'}

                        {!isActive && <BsChevronDown className="ml-3" />}
                        {isActive && <BsChevronUp className="ml-3" />}
                      </button>
                    }>
                    <PopOverItem
                      onClick={() => {
                        setSelectedCompanyTypes(GeneralCompaniesOptions.ALL_COMPANIES);
                      }}>
                      All Companies
                    </PopOverItem>
                    <PopOverItem
                      onClick={() => {
                        setSelectedCompanyTypes(GeneralCompaniesOptions.ALL_CUSTOMERS);
                      }}>
                      Customer
                    </PopOverItem>
                    <PopOverItem
                      onClick={() => {
                        setSelectedCompanyTypes(GeneralCompaniesOptions.ALL_PROSPECTS);
                      }}>
                      Prospect
                    </PopOverItem>
                  </Popover>
                )}
              </CardHeader>
              <div className="flex flex-col md:flex-row md:pt-5">
                <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                  <DoughnutChart
                    backgroundColor={chartItems?.chartBgColors || []}
                    customData={chartItems?.customChartData || []}
                    labels={chartItems?.labels || []}
                    cutout="80%"
                    value={chartItems?.chartTotalValue || '0'}
                    viewCompany="View Company"
                    openModal={() => setModal(true)}
                  />
                  <span className="text-gray-600 text-xs mr-5">Notifications received</span>
                </div>

                <div className="grid grid-cols-2 w-full pt-4 md:pl-7 lg:pt-0 md:w-2/3 2xl:w-4/5 2xl:pl-24 gap-4">
                  {eventCounts.pretaaGetEventCountsByType.map((eventData, index) => {
                    if (eventData.count > 0) {
                      const eventType = _.startCase(_.toLower(eventData.eventType));
                      return (
                        <BorderedRow
                          key={index}
                          colorCode={salesStageColors[index]}
                          text={eventType}
                          num={eventData.count}
                          selected={activeLabel === eventType || !activeLabel}
                          onClick={() => onEventLabelClick(eventType)}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-500 p-6">
              <Link to={route} data-test-id="view-events"className="text-primary-light font-medium text-xs float-right">
                View Events
                <img src={rightArrow} alt="arrow" className="ml-2 inline" />
              </Link>
              <div className="text-center pt-9 pb-7">{companyInsightsData && <LineChart data={data} />}</div>
            </div>
          </Card>
        </ContentFrame>
      )}
      <Popup
        modal={true}
        open={modal}
        onClose={() => {
          setModal(false);
        }}
        onOpen={() => setSkip(0)}
        position="center center"
        contentStyle={{
          maxHeight: 490,
          overflowY: 'auto',
          width: 616,
          borderRadius: 16,
          padding: 0,
        }}>
        <div className="flex flex-col items-center p-6 md:p-10 relative">
          <button type="button" data-test-id="close-modal" onClick={handleClose} className="absolute top-5 right-5">
            <IoMdClose className="text-xmd text-gray-400" />
          </button>
          <div className="flex flex-col w-full">
            {selectedCompanyFilter?.group === CompanyFilterGroups.TEAM_MEMBERS && (
              <h1 className="text-black leading-none text-left font-bold   text-md lg:text-md mb-5 mt-2">{`${selectedCompanyFilter.label}'s Companies`}</h1>
            )}
            {selectedCompanyFilter?.group !== CompanyFilterGroups.TEAM_MEMBERS && (
              <h1 className="text-black leading-none text-left font-bold   text-md lg:text-md mb-5 mt-2">All Companies</h1>
            )}
          </div>
          <ul className="w-full">
            {companiesByEventsLoading && !companiesByEvents && (
              <div className="flex flex-col items-center justify-center">
                <img src={loader} alt="loading..." width={30} height={30} className="mb-5" />
                <span className="text-base text-primary">Loading...</span>
              </div>
            )}
            {companiesByEvents?.pretaaGetCompaniesByEvents?.map((company) => (
              <li
                className="flex flex-row bg-white w-full py-2.5 text-base items-center last:rounded-b-xl 
            first:rounded-t-xl border-gray-100 border-b last:border-b-0"
                key={company.id}>
                <div className="flex flex-col flex-1 md:gap-0 gap-1">
                  <h4 className="font-bold text-primary ">
                    <Link to={routes.companyDetail.build(company.id)}>{company.name}</Link>
                  </h4>
                </div>
                <div>
                  <Link to={routes.companyDetail.build(company.id)}>
                    <BsChevronRight className="ml-3 text-gray-400" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          {noMoreDataFound && <p className="lg:text-center text-gray-600 text-sm my-4">No more data found.</p>}
          {!companiesByEventsLoading && !noMoreDataFound && (
            <div className="pt-4">
              <Pagination skip={skip} setSkip={setSkip} pageSize={20} isPrevDisabled={!skip} isNextDisabled={companiesList?.length < 20 || noMoreDataFound} />
            </div>
          )}
        </div>
      </Popup>
    </>
  );
}
