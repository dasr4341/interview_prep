'use client';
import { DEALER_DETAILS_QUERY } from '@/graphql/dealerDeatils.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import DealerDashboardLoader from '../loader/DealerDashboardLoader';
import DealerAnalytics from '../components/DealerAnalytics';
import {
  DealerRange,
  DealerRangeObject,
  Status,
  User,
} from '@/generated/graphql';
import DealerPendingDashboard from '../components/DealerPendingDashboard';
import { DealerDetailsBox } from '@/components/Cars/components/DealerDetailsBox';
import HorizontalBarGraph from '@/components/Charts/HorizontalBarGraph';
import { DEALERS_ANALYTICS } from '@/graphql/dealersAnalytics.query';
import { IDateRangeType } from '@/components/Cars/carDetails/CarDetailsPage';
import formatDataForChart from '@/components/Charts/helper/formatData';
import LineChart from '@/components/Charts/LineChart';
import DateRangePickerComponent from '@/components/Charts/components/DateRangePicker';

export interface IChartData {
  key: string;
  value: number;
  color?: string;
}

const DealerDetailsPage = () => {
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();

  const [leadsDateRange, setLeadsDateRange] = useState<IDateRangeType>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });
  const [leadsData, setLeadsData] = useState<IChartData[]>([]);

  //details query
  const [fetchDealerDetails, { loading: getDetailsLoading, data, refetch }] =
    useLazyQuery(DEALER_DETAILS_QUERY, {
      onError: (e) => catchError(e, true),
    });

  const [delaerAnalyticsData, { data: dealerAnalyticData }] = useLazyQuery(
    DEALERS_ANALYTICS,
    {
      onCompleted: (d) => {
        console.log(d);
        setLeadsData(
          memoizedFormatDataForChart(
            d.getDealerAnalytics.data.leads
              ?.totalLeadsInRange as DealerRangeObject[],
            leadsDateRange
          )
        );
      },
      onError: (e) => catchError(e, true),
    }
  );

  const memoizedFormatDataForChart = useCallback(
    (data: DealerRangeObject[], dateRange: DealerRange) => {
      return formatDataForChart(data, dateRange);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leadsData]
  );

  useEffect(() => {
    if (dealerId) {
      fetchDealerDetails({
        variables: {
          dealerId: dealerId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId]);

  useEffect(() => {
    delaerAnalyticsData({
      variables: {
        input: {
          dealerId: dealerId,
          lead: {
            start: leadsDateRange?.start?.toISOString(),
            end: leadsDateRange?.end?.toISOString(),
          },
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId, leadsDateRange]);

  return (
    <>
      {getDetailsLoading && <DealerDashboardLoader />}

      {(data?.viewDealer?.data?.status === Status.Approved ||
        data?.viewDealer?.data?.status === Status.Onboarded) &&
        !getDetailsLoading && (
          <div>
            <div className="mb-4">
              <DealerAnalytics />
            </div>
            <div className=" grid grid-cols-12 gap-4 ">
              <DealerDetailsBox
                className="xl:col-span-7 col-span-12"
                data={data?.viewDealer.data as User}
              />
              <div className="col-span-12 rounded-xl shadow-xl bg-white xl:col-span-5 py-4 ">
                <h2 className="text-xl font-bold text-gray-700 mb-4 px-4 ">
                  Leads Report
                </h2>
                <HorizontalBarGraph
                  assigned={Number(
                    dealerAnalyticData?.getDealerAnalytics.data.leads
                      ?.totalAssignedLeadsCount
                  )}
                  unassigned={Number(
                    dealerAnalyticData?.getDealerAnalytics.data.leads
                      ?.totalUnAssignedLeadsCount
                  )}
                />
              </div>

              <div className=" rounded-xl shadow-xl col-span-12 bg-white p-6">
                <div className="flex flex-col items-start justify-center mb-6 px-4 text-gray-700 ">
                  <h2 className="font-semibold text-xl">Dealer Leads Report</h2>
                  <DateRangePickerComponent
                    setState={setLeadsDateRange}
                    state={leadsDateRange}
                  />
                </div>
                <LineChart chartData={leadsData} xHeader="Leads Report" />
              </div>
            </div>
          </div>
        )}

      {(data?.viewDealer?.data?.status === Status.Pending ||
        data?.viewDealer?.data?.status === Status.Disabled) &&
        !getDetailsLoading && (
          <DealerPendingDashboard
            refetchDealerDetails={refetch}
            isPending={!!data.viewDealer.data.documents?.length}
          />
        )}
    </>
  );
};

export default DealerDetailsPage;
