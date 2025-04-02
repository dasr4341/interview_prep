/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import CardHeader from 'components/dashboard/CardHeader';
import Popover, { PopOverItem } from 'components/Popover';
import Card from 'components/ui/card/Card';
import './dashboard.scoped.scss';
import React, { useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { customStyleSelectBox, DropdownIndicator, OptionItem } from 'components/ui/SelectBox';
import { makeContact } from 'fakeData';
import _ from 'lodash';
import ReporteeListRow from 'components/dashboard/ReporteeListRow';
import DoughnutChart from '../../components/charts/DoughnutChart';
import { useLazyQuery } from '@apollo/client';
import {
  DateRangeTypes,
  GetTeamDetails,
  GetTeamDetailsVariables,
  PretaaGetManagerAndReporteeData,
  PretaaGetManagerAndReporteeDataVariables,
  PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData,
  PretaaGetManagerMembers,
  PretaaGetManagerMembersVariables,
  PretaaGetPipelineDataForManager,
  PretaaGetPipelineDataForManagerVariables,
} from 'generatedTypes';
import { getManagerAndReporteeQuery } from 'lib/query/team-insight/get-manager-and-reportee';
import { getPipelineDataForManagerQuery } from 'lib/query/team-insight/get-manager-pipeline-data';
import ChartColumns from 'components/dashboard/ChartColumns';
import Pagination from 'components/Pagination';
import { getChartData } from 'lib/get-chart-data';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { getTeamDetailsQuery } from 'lib/query/team-insight/get-team-details';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PipelineFilterType } from '../../interface/pipeline.interface';
import { getManagerMembersQuery } from 'lib/query/team-insight/get-manager-memebers';
import { SelectBox } from 'interface/SelectBox.interface';
import { client } from 'apiClient';
import { routes } from 'routes';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { TrackingApi } from 'components/Analytics';

export default function DashboardPipelineDetailScreen() {
  const salesStage = useSelector((state: RootState) => state.dataSource.salesStage);

  const navigate = useNavigate();

  const { id }: { id?: string } = useParams();

  const [selectedDateRange] = useState<{
    label: string;
    value: DateRangeTypes;
  }>({ label: 'Week to Date', value: DateRangeTypes.WEEK_TO_DATE });

  const [selectedDateRangeForReportee] = useState<{
    label: string;
    value: DateRangeTypes;
  }>({ label: 'Week to Date', value: DateRangeTypes.WEEK_TO_DATE });

  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState<{ label: string; value: PipelineFilterType }>({
    label: _.startCase(_.camelCase(PipelineFilterType.BY_REVENUE)),
    value: PipelineFilterType.BY_REVENUE,
  });

  const [selectedPipelineFilterForReportee, setSelectedPipelineFilterForReportee] = useState<{
    label: string;
    value: PipelineFilterType;
  }>({
    label: _.startCase(_.camelCase(PipelineFilterType.BY_REVENUE)),
    value: PipelineFilterType.BY_REVENUE,
  });

  const [skip, setSkip] = useState(0);

  const [teamOptions, setTeamOptions] = useState<SelectBox[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<SelectBox>();

  const [getTeamDetails, { data: teamDetails, loading: teamDetailsLoading }] = useLazyQuery<GetTeamDetails, GetTeamDetailsVariables>(getTeamDetailsQuery);

  useEffect(() => {
    if (id) {
      getTeamDetails({
        variables: {
          reporteeUserId: id,
          dateRangeType: selectedDateRangeForReportee.value,
        },
      });
    }
  }, [getTeamDetails, id, selectedDateRangeForReportee]);

  const [managerAndReporteeData, setManagerAndReporteeData] = useState<PretaaGetManagerAndReporteeData_pretaaGetManagerAndReporteeData>();
  const [noMoreDataFound, setNoMoreDataFound] = useState(false);

  const [getPipelineDataForManager, { data: pipelineData, loading: pipelineDataLoading }] = useLazyQuery<PretaaGetPipelineDataForManager, PretaaGetPipelineDataForManagerVariables>(
    getPipelineDataForManagerQuery
  );

  const [getManagerAndReportee, { loading }] = useLazyQuery<PretaaGetManagerAndReporteeData, PretaaGetManagerAndReporteeDataVariables>(getManagerAndReporteeQuery, {
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

  const [getManagerMembers, { loading: memebersLoading, data: membersData }] = useLazyQuery<PretaaGetManagerMembers, PretaaGetManagerMembersVariables>(getManagerMembersQuery);

  function getDropdownItems(list: any[]) {
    return list.map((member) => {
      return {
        value: member.id,
        label: member.name,
      };
    }) as unknown as SelectBox[];
  }

  useEffect(() => {
    if (id)
      getManagerMembers({
        variables: {
          reporteeUserId: id,
        },
      });
  }, [getManagerMembers, id]);

  useEffect(() => {
    if (membersData?.pretaaGetManagerMembers?.length) {
      setTeamOptions(getDropdownItems(membersData.pretaaGetManagerMembers));
    }
  }, [membersData]);

  const loadOptions = (inputValue: string, callback: (options: any) => void) => {
    (async () => {
      const result = await client.query<PretaaGetManagerMembers, PretaaGetManagerMembersVariables>({
        query: getManagerMembersQuery,
        variables: {
          reporteeUserId: id ?? '',
          searchPhrase: inputValue,
        },
      });
      if (result.data.pretaaGetManagerMembers?.length) callback(getDropdownItems(result.data.pretaaGetManagerMembers));
    })();
  };
  const delayedCallback = _.debounce(loadOptions, 1000);
  const handleInputChange = (inputValue: string, callback: any) => {
    delayedCallback(inputValue, callback);
  };

  useEffect(() => {
    getPipelineDataForManager({
      variables: {
        reporteeUserId: id,
      },
    });
  }, [getPipelineDataForManager, id]);

  useEffect(() => {
    getManagerAndReportee({
      variables: {
        dateRangeType: selectedDateRange.value,
        skip,
        reporteeUserId: id,
        take: 5,
      },
    });
  }, [getManagerAndReportee, id, selectedDateRange, skip]);

  const { customData, value } = getChartData({
    selectedPipelineFilter: selectedPipelineFilter.value,
    pipelineData: pipelineData?.pretaaGetPipelineDataForManager,
  });

  const { customData: customDataForReportee, value: valueForReportee } = getChartData({
    selectedPipelineFilter: selectedPipelineFilterForReportee.value,
    pipelineData: teamDetails?.pretaaGetPipelineData,
  });

  const teamDetailsChartData = useMemo(() => {
    return {
      backgroundColor: salesStage.map((m) => m.color),
      customData: customDataForReportee,
      cutout: '83%',
      value: valueForReportee,
      labels: teamDetails?.pretaaGetPipelineData?.pipelineData.map((el) => el.label),
    };
  }, [teamDetails, selectedPipelineFilterForReportee, salesStage]);

  const pipelineChartData = useMemo(() => {
    return {
      backgroundColor: salesStage.map((m) => m.color),
      customData: customData,
      cutout: '80%',
      value: value,
      labels: pipelineData?.pretaaGetPipelineDataForManager.pipelineData?.map((el) => el.label),
    };
  }, [pipelineData, selectedPipelineFilter, salesStage]);

  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardPipelineDetailScreen.name,
    });
  }, []);

  const team = _.range(0, 1)
    .map(() => makeContact())
    .map(() => {
      return (
        <React.Fragment key={teamDetails?.pretaaGetUserDetails?.id}>
          <ContentHeader title={teamDetails?.pretaaGetUserDetails?.name} className="relative">
            {Boolean(Number(membersData?.pretaaGetManagerMembers?.length) > 0) && (
              <div className="md:float-right w-full md:max-w-xs md:absolute md:top-10 md:right-6 lg:right-16 ">
                <AsyncSelect
                  components={{
                    Option: OptionItem,
                    DropdownIndicator: DropdownIndicator,
                  }}
                  isLoading={memebersLoading}
                  menuShouldScrollIntoView={true}
                  loadOptions={handleInputChange}
                  defaultOptions={teamOptions}
                  className="basic-single rounded-lg mb-1 bg-white w-full"
                  styles={customStyleSelectBox}
                  value={selectedTeam}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedTeam(newValue);
                      navigate(routes.dashboardPipelineDetailScreen.build(newValue.value));
                    }
                  }}
                  options={[]}
                  placeholder="Team members"
                />
              </div>
            )}
            {teamDetailsLoading && (
              <div className="h-5/6 w-full flex-auto flex items-center justify-center">
                <LoadingIndicator />
              </div>
            )}
            {!teamDetailsLoading && teamDetails?.pretaaGetPipelineData?.pipelineData && customDataForReportee && valueForReportee && (
              <Card className="p-6 border border-gray-350 xl:my-9">
                <CardHeader leftText={`${teamDetails ? teamDetails?.pretaaGetUserDetails?.name : ''} Pipeline*`}>
                  <Popover
                    trigger={
                      <button className={isActive ? 'text-primary-light flex items-center' : 'text-gray-600 flex items-center'} onClick={toggleClass}>
                        {selectedPipelineFilterForReportee.label} {!isActive && <BsChevronDown className="ml-3" />}
                        {isActive && <BsChevronUp className="ml-3" />}
                      </button>
                    }>
                    {Object.values(PipelineFilterType).map((filter) => (
                      <PopOverItem
                        key={filter}
                        onClick={() =>
                          setSelectedPipelineFilterForReportee({
                            label: _.startCase(_.camelCase(filter)),
                            value: filter,
                          })
                        }>
                        {_.startCase(_.camelCase(filter))}
                      </PopOverItem>
                    ))}
                  </Popover>
                </CardHeader>
                <div className="flex flex-col md:flex-row items-center mt-3">
                  <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                    <DoughnutChart
                      backgroundColor={teamDetailsChartData.backgroundColor}
                      customData={teamDetailsChartData.customData}
                      cutout={teamDetailsChartData.cutout}
                      value={teamDetailsChartData.value}
                      labels={teamDetailsChartData.labels}
                    />
                    <span className="text-gray-600 text-xs mr-5">{`${selectedPipelineFilter.label.split(' ')[1]} total`}</span>
                  </div>
                  <div className="flex flex-wrap flex-row md:w-2/3 xl:mr-5 2xl:w-4/5 2xl:pl-24 md:pl-7">
                    {teamDetails.pretaaGetPipelineData.pipelineData && (
                      <ChartColumns selectedPipelineFilter={selectedPipelineFilterForReportee.value} pipelineData={teamDetails.pretaaGetPipelineData} />
                    )}
                  </div>
                </div>
                <p className="lg:text-right text-primary-light text-xs mt-4 lg:mt-0">
                  <Link
                    to={routes.dashboardTeamDetailScreen.build(String(id), {
                      name: teamDetails?.pretaaGetUserDetails?.name,
                    })}>
                    View Event Data
                  </Link>
                </p>
                <p className="lg:text-right text-gray-600 text-xs mt-4 lg:mt-0">*Pipeline information as of today</p>
              </Card>
            )}
          </ContentHeader>
          {!loading && Number(managerAndReporteeData?.reportees?.length) > 0 && (
            <ContentFrame>
              <h2 className="font-bold text-gray-150 mb-6">{teamDetails?.pretaaGetUserDetails?.name}'s Team</h2>

              {managerAndReporteeData?.reportees?.map((reportee) => (
                <ReporteeListRow key={reportee.reportee?.id} reportee={reportee} />
              ))}

              <div className="mt-3 mb-5 flex flex-wrap">
                {salesStage.map((stage) => (
                  <span key={stage.id} className={`text-sm text-gray-600 text-label stage-num last:mr-0 mr-3 ${stage.color}`}>
                    <span className="color-box" style={{ backgroundColor: stage.color }}></span>
                    {stage.displayName}
                  </span>
                ))}
              </div>

              {noMoreDataFound && <p className="lg:text-center text-gray-600 text-sm my-4">No more data found.</p>}
              {!noMoreDataFound && (
                <Pagination
                  pageSize={5}
                  skip={skip}
                  setSkip={setSkip}
                  isPrevDisabled={!skip}
                  isNextDisabled={(managerAndReporteeData?.reportees && managerAndReporteeData.reportees?.length < 5) || noMoreDataFound}
                />
              )}

              <Card className="p-6 border border-gray-350 xl:mt-10">
                <CardHeader leftText="Pipeline">
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

                {!pipelineDataLoading && pipelineData?.pretaaGetPipelineDataForManager && customData && (
                  <div className="flex flex-col md:flex-row items-center mt-3">
                    <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                      <DoughnutChart
                        backgroundColor={pipelineChartData.backgroundColor}
                        customData={pipelineChartData.customData}
                        cutout={pipelineChartData.cutout}
                        value={pipelineChartData.value}
                        labels={pipelineChartData.labels}
                      />
                      <span className="text-gray-600 text-xs mr-5">{`${selectedPipelineFilter.label.split(' ')[1]} total`}</span>
                    </div>
                    <div className="flex flex-wrap flex-row md:w-2/3 xl:mr-5 2xl:w-4/5 2xl:pl-24 md:pl-7">
                      {pipelineData.pretaaGetPipelineDataForManager && (
                        <ChartColumns selectedPipelineFilter={selectedPipelineFilter.value} pipelineData={pipelineData.pretaaGetPipelineDataForManager} />
                      )}
                    </div>
                  </div>
                )}
                <p className="lg:text-right text-gray-600 text-xs mt-4 lg:mt-0">*Pipeline information as of today</p>
              </Card>
            </ContentFrame>
          )}
        </React.Fragment>
      );
    });

  return <>{team ? team : ''}</>;
}
