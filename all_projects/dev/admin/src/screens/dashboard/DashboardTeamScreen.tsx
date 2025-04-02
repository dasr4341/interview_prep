/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import ActionColumn from 'components/dashboard/ActionColumn';
import CardHeader from 'components/dashboard/CardHeader';
import TeamReporteeListRow from 'components/dashboard/TeamReporteeListRow';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { GetTeamInsights, GetTeamInsightsVariables, DateRangeTypes } from 'generatedTypes';
import { GetTeamInsightsQuery } from 'lib/query/team-insights/get-team-insights';
import { useLazyQuery } from '@apollo/client';
import { routes } from 'routes';
import { range } from 'lodash';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
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

export default function DashboardTeamScreen() {
  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);
  const [selectedOption, setSelectedOption] = useState<string>('ALL');
  const [skip, setSkip] = useState(0);
  const [getTeamInsights, { data, loading, error }] = useLazyQuery<GetTeamInsights, GetTeamInsightsVariables>(GetTeamInsightsQuery);

  useEffect(() => {
    getTeamInsights({
      variables: {
        dateRangeType: selectedOption as unknown as DateRangeTypes,
        skip,
        take: 20,
      },
    });
  }, [selectedOption, skip]);

  const teamInsights = data?.pretaaGetTeamInsightDashboardData;

  const actions = [
    { text: 'References Added', num: teamInsights?.referencesCount || 0 },
    { text: 'Launches', num: teamInsights?.launchesCount || 0 },
    { text: 'Ratings Given', num: teamInsights?.userCompanyRatingsCount || 0 },
  ];

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardTeamScreen.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Team Insights" breadcrumb={false} disableGoBack={true}>
        <div className="flex items-center space-x-3">
          <span className="text-gray-600">Filter By: </span>
          <Select
            className={`basic-single rounded-lg mb-1
             bg-white md:max-w-xs`}
            styles={customStyleSelectBox}
            options={dateRangeOptions}
            placeholder="All"
            onChange={(option) => {
              setSelectedOption(option?.value || '');
            }}
          />
        </div>
        <div
          className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
          <CardHeader leftText="My Teams Actions"></CardHeader>
          <div className="flex flex-row justify-between w-full">
            {actions?.map((action) => (
              <ActionColumn key={action?.text} num={action.num || 0} text={action?.text} />
            ))}
          </div>
        </div>
      </ContentHeader>

      <ContentFrame>
        {error && <ErrorMessage message={error.message} />}
        <h2 className="font-bold text-gray-150 text-xmd mb-4">Your Team</h2>
        <div className="mt-2 lg:mt-6">
          {loading && <Loading />}
          {!loading &&
            teamInsights?.reportees?.map((item, index) => {
              return <TeamReporteeListRow teamData={item} key={index} />;
            })}
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

        <div
          className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
          <CardHeader leftText="Team Companies: Companies that need attention"></CardHeader>
          {!data?.pretaaGetTeamCompaniesNeedAttention?.length && <NoDataFound />}
          <div className="flex flex-wrap mt-2">
            {data?.pretaaGetTeamCompaniesNeedAttention?.map((list) => (
              <div className="w-1/4 mt-2">
                <Link to={routes?.companyDetail.build(String(list?.id))} className="text-pt-blue-300 text-sm font-medium underline">
                  {list?.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </ContentFrame>
    </>
  );
}
