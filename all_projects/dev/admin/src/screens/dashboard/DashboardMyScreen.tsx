/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import './dashboard.scoped.scss';
import Select from 'react-select';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import CardHeader from 'components/dashboard/CardHeader';
import ActionColumn from 'components/dashboard/ActionColumn';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { Link } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import Popup from 'reactjs-popup';
import closebtn from '../../assets/images/closeButton.svg';
import strokeSVG from '../../assets/images/stroke.svg';
import { gsap } from 'gsap';
import DoughnutChart from 'components/charts/DoughnutChart';
import BorderedRow from 'components/dashboard/BorderedRow';
import { getMyInsightsQuery } from 'lib/query/my-insights/get-my-insights';
import { getInsightsMixPanelQuery } from 'lib/query/my-insights/get-insights-mix-panel';
import { getInsightsMixPanelDayWiseQuery } from 'lib/query/my-insights/get-insights-mix-panel-daywise';
import {
  DateRangeTypes,
  GetMyInsights,
  GetMyInsightsVariables,
  InsightsMixPanel,
  InsightsMixPanelByDay,
  InsightsMixPanelByDayVariables,
  InsightsMixPanelByDay_pretaaGetPopularViewingTimes_popularViews,
  InsightsMixPanelVariables,
} from 'generatedTypes';
import { useLazyQuery } from '@apollo/client';
import { routes } from 'routes';
import { salesStageColors } from 'lib/constant/chartColor';
import _ from 'lodash';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { getGraphError } from 'lib/catch-error';
import BarChart from 'components/charts/BarChart';
import { NoDataFound } from './components/NoDataFound';
import { TrackingApi } from 'components/Analytics';

interface ChartData {
  label: string;
  count: number;
  color: string;
}

export default function DashboardMyScreen(): JSX.Element {
  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('ALL');
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('ALL');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<string>('Mon');
  const [userActions, setUserActions] = useState<ChartData[]>([]);
  const [companyFiltersCounts, setCompanyFiltersCounts] = useState<ChartData[]>([]);
  const [popularViewingTimes, setPopularViewingTimes] = useState<InsightsMixPanelByDay_pretaaGetPopularViewingTimes_popularViews[]>([]);

  const userActionsData = useMemo(() => {
    return {
      backgroundColor: userActions.map((ac) => ac.color),
      customData: userActions.map((ac) => ac.count),
      cutout: '83%',
      value: _.sumBy(userActions, 'count') as unknown as string,
      labels: userActions.map((el) => el.label),
    };
  }, [userActions]);

  const companyChartData = useMemo(() => {
    return {
      backgroundColor: companyFiltersCounts.map((el) => el.color),
      customData: companyFiltersCounts.map((sf) => sf.count),
      cutout: '83%',
      value: _.sumBy(companyFiltersCounts, 'count') as unknown as string,
      labels: companyFiltersCounts.map((el) => el.label),
    };
  }, [companyFiltersCounts]);

  const [getMyInsights, { data: myInsightsData, loading: myInsightsLoading, error: myInsightsError }] = useLazyQuery<GetMyInsights, GetMyInsightsVariables>(getMyInsightsQuery);

  const [getInsightsMixPanel, { data: mixInsightsData, error: mixInsightsError }] = useLazyQuery<InsightsMixPanel, InsightsMixPanelVariables>(getInsightsMixPanelQuery);

  const [getInsightsMixPanelDayWise, { data: insightsDataDayWise, loading: insightsDayWiseLoading, error: insightsDayWiseError }] = useLazyQuery<
    InsightsMixPanelByDay,
    InsightsMixPanelByDayVariables
  >(getInsightsMixPanelDayWiseQuery, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    getMyInsights({ variables: { dateRangeType: selectedDateRange as unknown as DateRangeTypes } });
    getInsightsMixPanel({ variables: { dateRangeType: selectedDateRange as unknown as DateRangeTypes } });
    getInsightsMixPanelDayWise({
      variables: { dateRangeType: selectedDateRange as unknown as DateRangeTypes, day: isActive },
    });
  }, [selectedDateRange]);

  useEffect(() => {
    if (insightsDataDayWise?.pretaaGetPopularViewingTimes?.popularViews) {
      setPopularViewingTimes(insightsDataDayWise?.pretaaGetPopularViewingTimes?.popularViews);
    }
  }, [insightsDataDayWise]);

  function convertMinsToHrsMins(minutes: number) {
    let h: any = Math.floor(minutes / 60);
    let m: any = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
  }

  const actions = [
    {
      text: 'Avg session Duration',
      num: mixInsightsData?.pretaaGetAverageSession?.average ? convertMinsToHrsMins(Number(mixInsightsData?.pretaaGetAverageSession?.average.toFixed(0))) : 0,
    },
    { text: 'Avg Pages Viewed', num: Number(mixInsightsData?.pretaaGetAverageSession?.averageCount) || 0 },
    { text: 'Sessions', num: Number(mixInsightsData?.pretaaGetAverageSession?.totalCount) || 0 },
  ];

  useEffect(() => {
    const data: ChartData[] = [];
    const response = _.cloneDeep(myInsightsData?.pretaaGetUserActionCounts) as any;
    const labels = ['', 'References Added', 'Launches', 'Ratings Given', 'References Removed', 'Companies Starred', 'Templates Created', 'Needs Attention Removed'];
    if (response) {
      Object.keys(response).forEach((key, index) => {
        if (index > 0) {
          data.push({
            label: labels[index] ? labels[index] : '',
            count: response[key],
            color: salesStageColors[index],
          });
        }
      });
    }
    setUserActions(data);
  }, [myInsightsData?.pretaaGetUserActionCounts]);

  useEffect(() => {
    const data: ChartData[] = [];
    const response = _.cloneDeep(myInsightsData?.pretaaGetMyUsedSearchFilters) as any;
    const labels = [
      '',
      'My Companies',
      'Starred',
      'Customer',
      'Prospect',
      'References',
      'User Entered Reference: Has Served',
      'User Entered Reference: Has Offered',
      'System Generated Reference',
      'Product',
      'Industry',
      'Employees',
      'Revenue',
      'NPS Score',
    ];
    if (response) {
      Object.keys(response).forEach((key, index) => {
        if (index > 0) {
          data.push({
            label: labels[index] ? labels[index] : '',
            count: response[key],
            color: salesStageColors[index],
          });
        }
      });
    }
    setCompanyFiltersCounts(data);
  }, [myInsightsData?.pretaaGetMyUsedSearchFilters]);

  const moveUpDown = () => {
    gsap.to('.lever', {
      duration: 1,
      rotationX: '-180deg',
      transformOrigin: '53% 86%',
      ease: 'power1.out',
    });
  };

  const activeTabClasses = 'border-b-2 border-pt-blue-300 text-pt-blue-300';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dashboardMe.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="My Insights" breadcrumb={false} disableGoBack={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-4 md:space-x-0 pb-4">
          <div className="md:space-x-3 flex flex-col md:flex-row items-center my-insights-label">
            <span>Filter By: </span>
            <Select
              className="basic-single rounded-lg mb-1 bg-white md:max-w-xs"
              styles={customStyleSelectBox}
              options={dateRangeOptions}
              onChange={(dateRange) => {
                if (dateRange) {
                  setSelectedDateRange(dateRange.value);
                  setSelectedDateLabel(dateRange.label);
                }
              }}
              placeholder="All"
            />
          </div>
        </div>
      </ContentHeader>
      <ContentFrame>
        <div className="sticky-btn hidden">
          <Button text="Spot Check" onClick={() => setOpenModal((o) => !o)} classes={['rounded-none', 'uppercase']} />
        </div>

        {openModal && (
          <Popup position="center center" modal open={openModal} className="rounded-xl max-w-xl">
            <div onClick={() => setOpenModal((o) => !o)} className="flex justify-end">
              <img src={closebtn} alt="close button" className="cursor-pointer" />
            </div>
            <div className="flex flex-col items-center">
              <h2 className="h2">Spot check!</h2>
              <div className="mt-4 md:mt-6 mb-10 xl:mb-12 relative">
                <svg
                  width="643"
                  height="186"
                  viewBox="0 0 643 186"
                  className="max-w-full relative"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect y="17" width="588" height="169" rx="40" fill="#FFD66B" />
                  <rect x="15" y="26" width="557" height="127" rx="57" fill="#202128" />
                  <rect x="15" y="27" width="561" height="149" rx="20" fill="#202128" />
                  <rect x="49" y="41" width="119" height="121" rx="11" fill="white" />

                  <rect x="185" y="41" width="214" height="121" rx="11" fill="white" />

                  <rect x="414" y="41" width="119" height="121" rx="11" fill="white" />

                  <rect x="588" y="73.0006" width="16" height="31" rx="7" fill="#202128" />

                  <foreignObject height="204" width="55" x="588" y="0">
                    <div className="w-full h-full">
                      <img src={strokeSVG} height="104" width="55" className="cursor-pointer transition lever absolute right-0 top-50" onClick={() => moveUpDown()} />
                    </div>
                  </foreignObject>

                  <path
                    d="M257.57 73.5057C258.136 71.5975 260.864 71.5975 261.43 73.5057C261.682 74.3546 262.465 74.9463 263.35 74.9463H263.761C265.654 74.9463 266.487 77.3325 265.006 78.5113L264.37 79.0172C263.732 79.525 263.466 80.3692 263.698 81.151L263.878 81.7575C264.431 83.6199 262.257 85.0864 260.737 83.8768C260.013 83.3007 258.987 83.3007 258.263 83.8768C256.743 85.0864 254.569 83.6199 255.122 81.7575L255.302 81.151C255.534 80.3692 255.268 79.525 254.63 79.0172L253.994 78.5113C252.513 77.3325 253.346 74.9463 255.239 74.9463H255.65C256.535 74.9463 257.318 74.3546 257.57 73.5057Z"
                    fill="#AC2CAE"
                  />
                  <path
                    d="M323.816 73.1612C325.467 71.87 327.795 73.4851 327.164 75.4841C326.883 76.3756 327.221 77.351 327.99 77.8838C329.711 79.0781 328.959 81.7947 326.866 81.8872L326.664 81.8961C325.736 81.9371 324.934 82.5534 324.654 83.4388L324.569 83.7074C323.948 85.6748 321.168 85.686 320.532 83.7237C320.237 82.817 319.374 82.2182 318.422 82.2603C316.361 82.3514 315.397 79.7435 317.023 78.4728L317.244 78.2992C317.976 77.7274 318.272 76.7594 317.985 75.8763L317.923 75.6843C317.276 73.6912 319.557 72.0348 321.279 73.229C322.047 73.7619 323.079 73.737 323.816 73.1612Z"
                    fill="#7320C5"
                  />
                  <path
                    d="M288.551 63.3354C289.654 60.0317 294.346 60.0317 295.449 63.3354C295.935 64.7931 297.302 65.7832 298.839 65.7832H299.003C302.434 65.7832 303.836 70.1931 301.035 72.1749C299.768 73.0708 299.239 74.6945 299.731 76.1659C300.817 79.4205 297.119 82.1877 294.318 80.2062L294.101 80.0525C292.842 79.1619 291.158 79.1619 289.899 80.0525L289.682 80.2062C286.881 82.1877 283.183 79.4205 284.269 76.1659C284.761 74.6945 284.232 73.0708 282.965 72.1749C280.164 70.1931 281.566 65.7832 284.997 65.7832H285.161C286.698 65.7832 288.065 64.7931 288.551 63.3354Z"
                    fill="#D1A63A"
                  />
                  <path
                    d="M434 139.6H514V59.6H434V139.6Z"
                    fill={`${showIcon ? 'url(#pattern0)' : 'url(#pattern1)'}`}
                    className="cursor-pointer"
                    onClick={() => setShowIcon((icon) => !icon)}
                  />
                  <defs>
                    <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_21547_107519" transform="scale(0.015625)" />
                    </pattern>
                    <image
                      id="image0_21547_107519"
                      width="64"
                      height="64"
                      xlinkHref="data:image/png;base64,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"
                    />

                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_21547_107280" transform="scale(0.015625)" onClick={() => setShowIcon((icon) => !icon)} />
                    </pattern>

                    <image
                      id="image0_21547_107280"
                      width="64"
                      height="64"
                      xlinkHref="data:image/png;base64,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"
                    />
                  </defs>

                  <foreignObject width="119" height="117" fill="#A55EDC" x="49" y="41">
                    <div className="num-text">2</div>
                  </foreignObject>
                  <foreignObject x="184" y="90" fill="#3B7AF7" width="215" height="70">
                    <div className="group-text">
                      <h2 className="text-primary-blue truncate">Adams Group</h2>
                    </div>
                  </foreignObject>
                </svg>
              </div>
            </div>
          </Popup>
        )}

        {myInsightsError && <ErrorMessage message={getGraphError(myInsightsError.graphQLErrors).join(',')} />}
        {insightsDayWiseError && <ErrorMessage message={getGraphError(insightsDayWiseError.graphQLErrors).join(',')} />}
        {mixInsightsError && <ErrorMessage message={getGraphError(mixInsightsError.graphQLErrors).join(',')} />}

        <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4 mb-6 w-full">
          <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
            <div
              className="flex flex-col w-full border bg-white
          border-gray-350 rounded-2xl pt-6 px-6 pb-9 mb-4 md:mb-0 md:col-span-2 relative">
              <CardHeader leftText="My Pretaa App Usage stats" />
              <p className="text-xs text-primary opacity-50"data-test-id="title">{selectedDateLabel}</p>
              <div className="flex flex-row justify-between w-full mb-8">
                {actions?.map((action) => (
                  <ActionColumn key={action?.text} num={action.num || 0} text={action?.text} />
                ))}
              </div>

              {insightsDayWiseLoading && (
                <div className="h-20 w-full flex-auto flex items-center justify-center absolute top-1/2 left-0">
                  <LoadingIndicator />
                </div>
              )}
              {popularViewingTimes.map(r => r.duration).filter(r => r > 0).length === 0 && !insightsDayWiseLoading && (
                <div className="h-20 w-full flex-auto flex items-center justify-center absolute top-1/2 left-0">
                  No Data
                </div>
              )}
              <div className="flex bg-white mb-3">
                {days?.map((x) => {
                  return (
                    <div
                      onClick={() => {
                        setPopularViewingTimes([]);
                        setIsActive(x);
                        getInsightsMixPanelDayWise({
                          variables: { dateRangeType: selectedDateRange as unknown as DateRangeTypes, day: x },
                        });
                      }}
                      className={`py-1 px-4 text-gray-600 text-sm cursor-pointer uppercase ${isActive === x ? activeTabClasses : ''}`}>
                      {x}
                    </div>
                  );
                })}
              </div>
              <BarChart
                labels={popularViewingTimes?.map((x, i) => i % 2 === 1 ? x.time : '' ) || []}
                customData={popularViewingTimes?.map((x) => Number(x?.duration.toFixed(0))) || []}
                backgroundColor={['#3A7AF7', '#3A7AF7', '#3A7AF7', '#3A7AF7', '#3A7AF7', '#3A7AF7', '#3A7AF7']}
              />
              <p className="font-medium text-xs text-gray-600">Popular Viewing times</p>
            </div>
          </div>

          <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
            {myInsightsLoading && (
              <div className="w-full flex-auto flex items-center justify-center">
                <LoadingIndicator />
              </div>
            )}
            {!myInsightsLoading && (
              <div className="flex flex-col w-full h-full border bg-white border-gray-350 rounded-2xl pt-6 px-6 pb-9">
                <CardHeader leftText="My Companies: that need attention" />
                <div className="flex flex-col flex-wrap justify-between w-full mt-5">
                  {myInsightsData?.pretaaGetCompaniesNeedingAttention?.length === 0 && <NoDataFound />}
                  {myInsightsData?.pretaaGetCompaniesNeedingAttention?.map((com) => (
                    <Link key={com.id} to={routes.companyDetail.build(com.id)} className="font-medium text-primary-light underline text-sm inline-block mb-2">
                      {com.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!myInsightsLoading && userActions.length > 0 && (
          <div className="flex flex-col w-full border bg-white border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
            <CardHeader leftText="My Actions" />
            <p className="text-xs text-primary opacity-50"data-test-id="title">{selectedDateLabel}</p>
            {myInsightsLoading && (
              <div className="h-full w-full flex-auto flex items-center justify-center">
                <LoadingIndicator />
              </div>
            )}
            {!myInsightsLoading && (
              <div className="flex flex-wrap mt-7">
                <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                  <DoughnutChart
                    backgroundColor={userActionsData.backgroundColor}
                    customData={userActionsData.customData}
                    cutout={userActionsData.cutout}
                    value={userActionsData.value}
                    labels={userActionsData.labels}
                  />
                </div>

                <div className="grid grid-cols-2 w-full pt-4 lg:pt-0 md:w-2/3 2xl:w-4/5 2xl:pl-24 md:pl-7 gap-4">
                  {userActions?.map((ac, index) => (
                    <BorderedRow colorCode={ac.color} text={ac.label} num={ac.count} key={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!myInsightsLoading && companyFiltersCounts.length > 0 && (
          <div
            className="flex flex-col w-full border bg-white
         border-gray-350 rounded-2xl pt-6 px-6 pb-9 my-4 lg:mt-9">
            <CardHeader leftText="My Filters Used" />
            <p className="text-xs text-primary opacity-50" data-test-id="title">{selectedDateLabel}</p>
            {myInsightsLoading && (
              <div className="h-full w-full flex-auto flex items-center justify-center">
                <LoadingIndicator />
              </div>
            )}
            {!myInsightsLoading && (
              <div className="flex flex-wrap mt-7">
                <div className="flex flex-col space-y-3 md:w-1/3 2xl:w-1/5 items-center">
                  <DoughnutChart
                    backgroundColor={companyChartData.backgroundColor}
                    customData={companyChartData.customData}
                    cutout={companyChartData.cutout}
                    value={companyChartData.value}
                    labels={companyChartData.labels}
                  />
                </div>

                <div className="grid grid-cols-2 w-full pt-4 md:pl-7 lg:pt-0 md:w-2/3 2xl:w-4/5 2xl:pl-24 gap-4">
                  {companyFiltersCounts?.map((sf, index) => (
                    <BorderedRow text={sf.label} num={sf.count} colorCode={sf.color} key={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ContentFrame>
    </>
  );
}
