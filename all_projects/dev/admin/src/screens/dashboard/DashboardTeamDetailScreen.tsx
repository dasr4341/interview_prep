/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import ActionColumn from 'components/dashboard/ActionColumn';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import TeamReporteeListRow from 'components/dashboard/TeamReporteeListRow';
import CardHeader from 'components/dashboard/CardHeader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NavigationHeader } from 'components/NavigationHeader';
import timeStat from '../../assets/images/times-state.svg';
import DoughnutChart from 'components/charts/DoughnutChart';
import BorderedRow from 'components/dashboard/BorderedRow';
import useQueryParams from 'lib/use-queryparams';
import { useLazyQuery } from '@apollo/client';
import { GetChildTeamInsightsQuery } from 'lib/query/team-insights/get-child-team-insights';
import { DateRangeTypes, GetChildTeamInsights, GetChildTeamInsightsVariables, GetTeamInsights_pretaaGetTeamInsightDashboardData_reportees } from 'generatedTypes';
import { routes } from 'routes';
import { range } from 'lodash';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { salesStageColors } from 'lib/constant/chartColor';
import UserManagerSearch from './components/UserManagerSearch';
import Pagination from 'components/Pagination';
import { NoDataFound } from './components/NoDataFound';
import { TrackingApi } from 'components/Analytics';

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

interface ChartInterface {
  title: string;
  num: number;
  colorIndex?: number;
}

export default function DashboardTeamDetailScreen() {
  const { id } = useParams() as any;
  const query = useQueryParams();
  const navigate = useNavigate();
  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);
  const [selectedOption, setSelectedOption] = useState<string>('ALL');
  const [filtersChart, setFiltersChart] = useState<ChartInterface[]>();
  const [actionsChart, setActionsChart] = useState<ChartInterface[]>();
  const [skip, setSkip] = useState(0);

  const [getTeamInsights, { data, loading, error }] = useLazyQuery<GetChildTeamInsights, GetChildTeamInsightsVariables>(GetChildTeamInsightsQuery);

  const actionsChartData = useMemo(() => {
    return {
      backgroundColor: salesStageColors.slice(1, actionsChart?.length || 0 + 1) || [],
      customData: actionsChart?.map((x) => x.num) || [],
      cutout: '83%',
      value:
        String(
          actionsChart
            ?.map((x) => x.num)
            .reduce(function (acc, val) {
              return acc + val;
            }, 0)
        ) || '0',
      labels: actionsChart?.map((m) => m.title),
    };
  }, [actionsChart]);

  const filtersChartData = useMemo(() => {
    return {
      backgroundColor: salesStageColors.slice(1, filtersChart?.length || 0 + 1) || [],
      customData: filtersChart?.map((x) => x.num) || [],
      cutout: '83%',
      value:
        String(
          filtersChart
            ?.map((x) => x.num)
            .reduce(function (acc, val) {
              return acc + val;
            }, 0)
        ) || '0',
      labels: filtersChart?.map((el) => el.title),
    };
  }, [filtersChart]);

  useEffect(() => {
    getTeamInsights({
      variables: {
        dateRangeType: selectedOption as unknown as DateRangeTypes,
        reporteeUserId: id,
        skip,
      },
    });
  }, [selectedOption, id, skip]);

  useEffect(() => {
    if (data?.pretaaGetMyUsedSearchFilters) {
      const chart = [
        {
          title: 'My Companies',
          num: data?.pretaaGetMyUsedSearchFilters?.mycompaniesCount || 0,
          colorIndex: 1,
        },
        {
          title: 'Reference Manual: Has Served',
          num: data?.pretaaGetMyUsedSearchFilters?.hasServedCount || 0,
          colorIndex: 2,
        },
        {
          title: 'References',
          num: data?.pretaaGetMyUsedSearchFilters?.referenceCount || 0,
          colorIndex: 3,
        },
        {
          title: 'Reference Manual: Has Offered',
          num: data?.pretaaGetMyUsedSearchFilters?.hasOfferedCount || 0,
          colorIndex: 4,
        },
        {
          title: 'Starred',
          num: data?.pretaaGetMyUsedSearchFilters?.starredCount || 0,
          colorIndex: 5,
        },
        {
          title: 'Reference Manual: Surveyed',
          num: data?.pretaaGetMyUsedSearchFilters?.systemGeneratedSurveyedReferenceCount || 0,
          colorIndex: 6,
        },
        {
          title: 'Propsect',
          num: data?.pretaaGetMyUsedSearchFilters?.prospectCount || 0,
          colorIndex: 7,
        },
        {
          title: 'NPS Score',
          num: data?.pretaaGetMyUsedSearchFilters?.npsScoreCount || 0,
          colorIndex: 8,
        },
        {
          title: 'Reference Manual',
          num: data?.pretaaGetMyUsedSearchFilters?.referenceCount || 0,
          colorIndex: 9,
        },
        {
          title: 'Industry',
          num: data?.pretaaGetMyUsedSearchFilters?.industryCount || 0,
          colorIndex: 10,
        },
        {
          title: 'ARR',
          num: data?.pretaaGetMyUsedSearchFilters?.revenueCount || 0,
          colorIndex: 11,
        },
        {
          title: 'Employees',
          num: data?.pretaaGetMyUsedSearchFilters?.employeeSeatsCount || 0,
          colorIndex: 12,
        },
      ];
      setFiltersChart(chart);
    }
    if (data?.pretaaGetUserActionCounts) {
      const chart = [
        {
          title: 'Launches',
          num: data?.pretaaGetUserActionCounts?.launchCount || 0,
          colorIndex: 1,
        },
        {
          title: 'Templates Created',
          num: data?.pretaaGetUserActionCounts?.templatesCreatedCount || 0,
          colorIndex: 2,
        },
        {
          title: 'References Given',
          num: data?.pretaaGetUserActionCounts?.referenceCount || 0,
          colorIndex: 3,
        },
        {
          title: 'Needs Attention Removed',
          num: data?.pretaaGetUserActionCounts?.needsAttentionRemovedCount || 0,
          colorIndex: 4,
        },
        {
          title: 'References Removed',
          num: data?.pretaaGetUserActionCounts?.referenceDeletedCount || 0,
          colorIndex: 5,
        },
        {
          title: 'Ratings',
          num: data?.pretaaGetUserActionCounts?.ratingCount || 0,
          colorIndex: 6,
        },
      ];
      setActionsChart(chart);
    }
  }, [data]);

  const actions = [
    { text: 'Avg session Duration', num: Number('00:9:23') },
    { text: 'Avg Pages Viewed', num: 11 },
    { text: 'Sessions', num: 24 },
  ];

  const actionsTwo = [
    {
      text: 'Reference',
      num: data?.pretaaGetTeamInsightDashboardData?.referencesCount || 0,
    },
    {
      text: 'Launch',
      num: data?.pretaaGetTeamInsightDashboardData?.launchesCount || 0,
    },
    {
      text: 'Ratings',
      num: data?.pretaaGetTeamInsightDashboardData?.userCompanyRatingsCount || 0,
    },
  ];

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardTeamDetailScreen.name,
    });
  }, []);

  return (
    <>
      <ContentHeader breadcrumb={false} disableGoBack={false}>
        <div data-test-id="team-members-name" className="block flex justify-between">
          <NavigationHeader>{query?.name}</NavigationHeader>
          <div className="w-80">
            <UserManagerSearch
              componentId="Team Members"
              placeholder="Team Members"
              componentName="teamMembers"
              className="basic-single rounded-lg mb-1 bg-white"
              onchange={(user) => {
                navigate(
                  routes?.dashboardTeamDetailScreen.build(String(user?.value), {
                    name: user?.label,
                  })
                );
              }}
              reporterUserId={id}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <span className="text-gray-600">Filter By: </span>
          <Select
            className={`basic-single rounded-lg mb-1
             bg-white md:max-w-xs`}
            styles={customStyleSelectBox}
            options={dateRangeOptions}
            placeholder="This week to date"
            onChange={(option) => {
              setSelectedOption(option?.value || '');
            }}
          />
        </div>

        {error && <ErrorMessage message={error.message} />}

        <div
          className="grid grid-cols-1 md:grid-cols-2 md:gap-4 border bg-white
          border-gray-350 rounded-2xl pt-6 px-6 pb-9 mb-4 md:mb-0 hidden">
          <div className="flex flex-col ">
            <CardHeader leftText="Usage stats" />
            <div className="mt-5 md:mt-11">
              <div className="flex flex-row justify-end w-full">
                {actions?.map((action) => (
                  <ActionColumn key={action?.text} num={action.num || 0} text={action?.text} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full pl-0 md:pl-16 pr-4">
            <Link to={routes.dashboardPipelineDetailScreen.build(id)} className="block text-xs text-right text-primary-light mt-5 md:mt-0 mb-7">
              View Pipeline Data
            </Link>
            <img src={timeStat} alt="time stamp" />
            <p className="font-medium text-xs text-gray-600">Popular Viewing times</p>
          </div>
        </div>

        <div
          className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
          <CardHeader leftText="Companies That Need Attention"></CardHeader>
          {!data?.pretaaGetCompaniesNeedingAttention?.length && <NoDataFound />}
          <div className="flex flex-wrap mt-2">
            {data?.pretaaGetCompaniesNeedingAttention?.map((list) => (
              <div className="w-1/2 md:w-1/4 mt-2">
                <Link to={routes.companyDetail.build(String(list.id))} className="text-pt-blue-300 text-sm font-medium underline">
                  {list.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {actionsChart && actionsChart?.length > 0 && (
          <div
            className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
            <CardHeader leftText={`${query?.name}’s Actions`} />
            <div className="flex flex-wrap mt-7">
              <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                <DoughnutChart
                  backgroundColor={actionsChartData.backgroundColor}
                  customData={actionsChartData.customData}
                  cutout={actionsChartData.cutout}
                  value={actionsChartData.value}
                  labels={actionsChartData.labels}
                />
              </div>

              <div className="grid grid-cols-2 w-full pt-4 md:pl-7 lg:pt-0 md:w-2/3 2xl:w-4/5 2xl:pl-24 gap-4">
                {actionsChart?.map((list) => (
                  <BorderedRow colorCode={salesStageColors[list?.colorIndex || 0]} text={list.title} num={list.num} />
                ))}
              </div>
              <div className="text-right w-full mt-7">
                <Link to={routes.dashboardPipelineDetailScreen.build(id)} className="inline-block text-xs text-primary-light">
                  View Pipeline Data
                </Link>
              </div>
            </div>
          </div>
        )}

        {filtersChart && filtersChart?.length > 0 && (
          <div
            className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
            <CardHeader leftText={`${query?.name}’s Filters used`} />
            <div className="flex flex-wrap mt-7">
              <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                <DoughnutChart
                  backgroundColor={filtersChartData.backgroundColor}
                  customData={filtersChartData.customData}
                  cutout={filtersChartData.cutout}
                  value={filtersChartData.value}
                  labels={filtersChartData.labels}
                />
              </div>

              <div className="grid grid-cols-2 w-full pt-4 md:pl-7 lg:pt-0 md:w-2/3 2xl:w-4/5 2xl:pl-24 gap-4">
                {filtersChart?.map((list) => (
                  <BorderedRow colorCode={salesStageColors[list?.colorIndex || 0]} text={list.title} num={list.num} />
                ))}
              </div>
            </div>
          </div>
        )}
      </ContentHeader>

      <ContentFrame>
        {Number(data?.pretaaGetTeamInsightDashboardData?.reportees?.length) > 0 && (
          <>
            <h2 className="font-bold text-gray-150 text-xmd">{query?.name}’s Team</h2>

            <div
              className="flex flex-col w-full border bg-white
           border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
              <CardHeader leftText={`${query?.name}’s Team Actions`}></CardHeader>
              <div className="flex flex-row justify-between w-full">
                {actionsTwo?.map((action) => (
                  <ActionColumn key={action?.text} num={action.num || 0} text={action?.text} />
                ))}
              </div>
            </div>

            <div className="mt-2 lg:mt-6">
              {loading && <Loading />}
              {!loading &&
                data?.pretaaGetTeamInsightDashboardData?.reportees?.map((item) => {
                  return <TeamReporteeListRow teamData={item as unknown as GetTeamInsights_pretaaGetTeamInsightDashboardData_reportees} />;
                })}
              {!data?.pretaaGetTeamInsightDashboardData?.reportees?.length && <p className="lg:text-center text-gray-600 text-sm my-4">No more data found.</p>}
              {data?.pretaaGetTeamInsightDashboardData?.reportees && data?.pretaaGetTeamInsightDashboardData?.reportees?.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    pageSize={20}
                    skip={skip}
                    setSkip={setSkip}
                    isPrevDisabled={!skip}
                    isNextDisabled={data?.pretaaGetTeamInsightDashboardData?.reportees && data?.pretaaGetTeamInsightDashboardData?.reportees?.length < 20}
                  />
                </div>
              )}
            </div>

            {data?.pretaaGetTeamCompaniesNeedAttention && data?.pretaaGetTeamCompaniesNeedAttention?.length > 0 && (
              <div
                className="flex flex-col w-full border bg-white
           border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
                <CardHeader leftText={`${query?.name}’s Team: Companies That Need Attention`}></CardHeader>
                {!data?.pretaaGetTeamCompaniesNeedAttention?.length && <NoDataFound />}
                <div className="flex flex-wrap mt-2">
                  {data?.pretaaGetTeamCompaniesNeedAttention?.map((list) => (
                    <div className="w-1/4 mt-2">
                      <Link to={routes.companyDetail.build(String(list?.id))} className="text-pt-blue-300 text-sm font-medium underline">
                        {list?.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </ContentFrame>
    </>
  );
}
