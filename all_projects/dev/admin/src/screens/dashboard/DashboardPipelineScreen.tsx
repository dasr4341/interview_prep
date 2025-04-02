/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import _ from 'lodash';
import ReporteeListRow from 'components/dashboard/ReporteeListRow';
import './dashboard.scoped.scss';
import Card from 'components/ui/card/Card';
import CardHeader from 'components/dashboard/CardHeader';
import Popover, { PopOverItem } from 'components/Popover';
import DoughnutChart from '../../components/charts/DoughnutChart';
import { useEffect, useMemo, useState } from 'react';
import {
  DateRangeTypes,
  GetPipelineData,
  GetPipelineDataVariables,
  PretaaGetManagerAndReporteeData,
  PretaaGetManagerAndReporteeDataVariables,
  PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData,
  PretaaGetPipelineDataForManager,
  PretaaGetPipelineDataForManagerVariables,
} from 'generatedTypes';
import { useLazyQuery } from '@apollo/client';
import { getManagerAndReporteeQuery } from 'lib/query/team-insight/get-manager-and-reportee';
import ChartColumns from 'components/dashboard/ChartColumns';
import Pagination from 'components/Pagination';
import { getChartData } from 'lib/get-chart-data';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { getPipelineDataForManagerQuery } from 'lib/query/team-insight/get-manager-pipeline-data';
import { getPipelineDataQuery } from 'lib/query/team-insight/get-pipeline-data';
import { PipelineFilterType } from 'interface/pipeline.interface';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { NavigationHeader } from 'components/NavigationHeader';
import Select from 'react-select';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export function Loading() {
  return (
    <>
      {_.range(0, 5).map((i) => (
        <div className="ph-item h-64" key={i}>
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

export default function DashboardPipelineScreen(): JSX.Element {
  const salesStage = useSelector((state: RootState) => state.dataSource.salesStage);

  const [selectedDateRange] = useState<{
    label: string;
    value: DateRangeTypes;
  }>({ label: 'Week to Date', value: DateRangeTypes.WEEK_TO_DATE });

  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState<{ label: string; value: PipelineFilterType }>({
    label: _.startCase(_.camelCase(PipelineFilterType.BY_REVENUE)),
    value: PipelineFilterType.BY_REVENUE,
  });
  const [selectedMyPipelineFilter, setSelectedMyPipelineFilter] = useState<{
    label: string;
    value: PipelineFilterType;
  }>({
    label: _.startCase(_.camelCase(PipelineFilterType.BY_REVENUE)),
    value: PipelineFilterType.BY_REVENUE,
  });

  const [skip, setSkip] = useState(0);

  const [managerAndReporteeData, setManagerAndReporteeData] = useState<PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData>();
  const [noMoreDataFound, setNoMoreDataFound] = useState(false);

  const [getPipelineDataForManager, { data: pipelineData, loading: pipelineDataLoading }] = useLazyQuery<PretaaGetPipelineDataForManager, PretaaGetPipelineDataForManagerVariables>(
    getPipelineDataForManagerQuery
  );

  const [getPipelineData, { data: myPipelineData, loading: pipelineLoading }] = useLazyQuery<GetPipelineData, GetPipelineDataVariables>(getPipelineDataQuery);

  useEffect(() => {
    getPipelineDataForManager();
  }, []);
  useEffect(() => {
    getPipelineData();
  }, []);

  const [getManagerAndReportee] = useLazyQuery<PretaaGetManagerAndReporteeData, PretaaGetManagerAndReporteeDataVariables>(getManagerAndReporteeQuery, {
    onCompleted: (data) => {
      if (skip > 1) {
        if (data?.pretaaGetManagerAndReporteeData?.reportees?.length) {
          setNoMoreDataFound(false);
          return setManagerAndReporteeData(data?.pretaaGetManagerAndReporteeData);
        } else {
          return setNoMoreDataFound(true);
        }
      } else {
        return setManagerAndReporteeData(data?.pretaaGetManagerAndReporteeData);
      }
    },
  });

  useEffect(() => {
    getManagerAndReportee({
      variables: {
        dateRangeType: selectedDateRange.value,
        skip,
        take: 5,
      },
    });
  }, [getManagerAndReportee, selectedDateRange, skip]);

  const { customData, value } = getChartData({
    selectedPipelineFilter: selectedPipelineFilter.value,
    pipelineData: pipelineData?.pretaaGetPipelineDataForManager,
  });

  const { customData: myPipelineCustomData, value: myPipelineValue } = getChartData({
    selectedPipelineFilter: selectedMyPipelineFilter.value,
    pipelineData: myPipelineData?.pretaaGetPipelineData,
  });

  const pipelineChartData = useMemo(() => {
    return {
      labels: pipelineData?.pretaaGetPipelineDataForManager.pipelineData?.map((el) => el.label),
      backgroundColor: pipelineData?.pretaaGetPipelineDataForManager.pipelineData
        ? (pipelineData?.pretaaGetPipelineDataForManager.pipelineData?.map((m) => {
            const c = salesStage.find((s) => s.displayName === m.label);
            return c?.color;
          }) as string[])
        : [],
      customData: customData,
      cutout: '83%',
      value: value,
    };
  }, [pipelineData, selectedPipelineFilter, salesStage]);

  const myPipelineChartData = useMemo(() => {
    return {
      labels: myPipelineData?.pretaaGetPipelineData?.pipelineData.map((el) => el.label),
      backgroundColor: myPipelineData?.pretaaGetPipelineData?.pipelineData
        ? (myPipelineData?.pretaaGetPipelineData.pipelineData?.map((m) => {
            const c = salesStage.find((s) => s.displayName === m.label);
            return c?.color;
          }) as string[])
        : [],
      customData: myPipelineCustomData,
      cutout: '83%',
      value: myPipelineValue,
    };
  }, [myPipelineData, selectedMyPipelineFilter, salesStage]);

  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  const teamMembers = [
    { value: 'all_companies', label: 'All Companies' },
    { value: 'adams_corp', label: 'Adams Corp' },
    { value: 'braun_inc', label: 'Braun Inc.' },
    { value: 'cadman_inc', label: 'Cadman Inc.' },
  ];

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardPipelineScreen.name,
    });
  }, []);

  return (
    <>
      <ContentHeader breadcrumb={false} disableGoBack={true}>
        <div data-test-id="page-title"className="block md:flex lg:flex items-center">
          <NavigationHeader>Pipeline Insights</NavigationHeader>
          {/* Todo: This needs be visible after company wise filter done on API side */}
          <div className="flex flex-1 justify-start md:justify-end mb-5 mt-2 hidden">
            <Select className="basic-single rounded-lg mb-1bg-white md:max-w-xs" styles={customStyleSelectBox} options={teamMembers} placeholder="All Companies" />
          </div>
        </div>
        {!myPipelineData && pipelineLoading && (
          <div className="h-auto w-full flex-auto flex items-center justify-center">
            <LoadingIndicator />
          </div>
        )}
        {!pipelineLoading && myPipelineData?.pretaaGetPipelineData && myPipelineCustomData && myPipelineValue && (
          <Card className="p-6 border border-gray-350 mt-3 xl:mt-3 flex flex-col">
            <CardHeader leftText="My Pipeline">
              <Popover
                trigger={
                  <button className={isActive ? 'text-primary-light flex items-center' : 'text-gray-600 flex items-center'} onClick={toggleClass}>
                    {selectedMyPipelineFilter.label} {!isActive && <BsChevronDown className="ml-3" />}
                    {isActive && <BsChevronUp className="ml-3" />}
                  </button>
                }>
                {Object.values(PipelineFilterType).map((filter) => (
                  <PopOverItem key={filter} onClick={() => setSelectedMyPipelineFilter({ label: _.startCase(_.camelCase(filter)), value: filter })}>
                    {_.startCase(_.camelCase(filter))}
                  </PopOverItem>
                ))}
              </Popover>
            </CardHeader>

            <div className="flex flex-col md:flex-row items-center mt-3">
              <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                <DoughnutChart
                  labels={myPipelineChartData.labels}
                  backgroundColor={myPipelineChartData.backgroundColor}
                  customData={myPipelineChartData.customData}
                  cutout={myPipelineChartData.cutout}
                  value={myPipelineChartData.value}
                />
                <span className="text-gray-600 text-xs mr-5">{`${selectedMyPipelineFilter.label.split(' ')[1]} total`}</span>
              </div>
              <div className="flex flex-wrap flex-row md:w-2/3 md:pl-12 xl:mr-5 2xl:w-4/5 2xl:pl-24">
                {myPipelineData?.pretaaGetPipelineData && (
                  <ChartColumns selectedPipelineFilter={selectedMyPipelineFilter.value} pipelineData={myPipelineData.pretaaGetPipelineData} />
                )}
              </div>
            </div>
            <p className="lg:text-right text-gray-600 text-xs mt-4 lg:mt-0 flex-none">*Pipeline information as of today</p>
          </Card>
        )}
      </ContentHeader>
      {!pipelineLoading && myPipelineData?.pretaaGetPipelineData && myPipelineCustomData && myPipelineValue && (
        <ContentFrame>
          <h2 className="font-bold text-gray-150 text-xmd">Your Team</h2>

          {managerAndReporteeData?.reportees?.length && (
            <div className="mt-2 xl:mt-9">
              {managerAndReporteeData.reportees.map((reportee) => (
                <ReporteeListRow key={reportee.reportee?.id} reportee={reportee} />
              ))}
            </div>
          )}

          <div className="mt-3 mb-5 flex flex-wrap">
            {salesStage?.map((stage) => (
              <div key={stage.id} className="last:mr-0 mr-3">
                <span className="color-box" style={{ backgroundColor: stage.color }}></span>
                <span className={`text-sm text-gray-600 text-label stage-num ${0}`}>{stage.displayName}</span>
              </div>
            ))}
          </div>

          {noMoreDataFound && <p className="lg:text-center text-gray-600 text-sm my-4">No more data found.</p>}

          <Pagination
            pageSize={5}
            skip={skip}
            setSkip={setSkip}
            isNextDisabled={(managerAndReporteeData && managerAndReporteeData.reportees && managerAndReporteeData.reportees.length < 5) || noMoreDataFound}
            isPrevDisabled={!skip}
          />

          <Card className="p-6 border border-gray-350 xl:mt-10 flex flex-col">
            <CardHeader leftText="Team Pipeline">
              <Popover
                trigger={
                  <button className={isActive ? 'text-primary-light flex items-center' : 'text-gray-600 flex items-center'} onClick={toggleClass}>
                    {selectedPipelineFilter.label} {!isActive && <BsChevronDown className="ml-3" />}
                    {isActive && <BsChevronUp className="ml-3" />}
                  </button>
                }>
                {Object.values(PipelineFilterType).map((filter) => (
                  <PopOverItem key={filter} onClick={() => setSelectedPipelineFilter({ label: _.startCase(_.camelCase(filter)), value: filter })}>
                    {_.startCase(_.camelCase(filter))}
                  </PopOverItem>
                ))}
              </Popover>
            </CardHeader>

            {!pipelineData && pipelineDataLoading && (
              <div className="h-auto w-full flex-auto flex items-center justify-center">
                <LoadingIndicator />
              </div>
            )}

            {!pipelineDataLoading && pipelineData?.pretaaGetPipelineDataForManager && customData && value && (
              <div className="flex flex-col md:flex-row items-center mt-3">
                <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                  <DoughnutChart
                    labels={pipelineChartData.labels}
                    backgroundColor={pipelineChartData.backgroundColor}
                    customData={pipelineChartData.customData}
                    cutout={pipelineChartData.cutout}
                    value={pipelineChartData.value}
                  />
                  <span className="text-gray-600 text-xs mr-5">{`${selectedPipelineFilter.label.split(' ')[1]} total`}</span>
                </div>
                <div className="flex flex-wrap flex-row md:w-2/3 md:pl-12 xl:mr-5 2xl:w-4/5 2xl:pl-24">
                  {pipelineData?.pretaaGetPipelineDataForManager && (
                    <ChartColumns selectedPipelineFilter={selectedPipelineFilter.value} pipelineData={pipelineData.pretaaGetPipelineDataForManager} />
                  )}
                </div>
              </div>
            )}

            <p className="lg:text-right text-gray-600 text-xs mt-4 lg:mt-0 flex-none">*Pipeline information is independent of time range and reflects total value as of today</p>
          </Card>
        </ContentFrame>
      )}
    </>
  );
}
