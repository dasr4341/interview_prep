'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import CarDetailsLoader from '../loader/CarDetailsLoader';
import catchError from '@/lib/catch-error';
import { message } from '@/config/message';
import { routes } from '@/config/routes';
import ProgessBars from '@/components/Charts/ProgressBars';
import { CAR_ANALYTICS } from '@/graphql/carAnalytics.query';
import {
  CarStatus,
  DealerRange,
  FuelType,
  RangeObject,
  TransmissionType,
} from '@/generated/graphql';
import formatDataForChart from '@/components/Charts/helper/formatData';
import DateRangePickerComponent from '@/components/Charts/components/DateRangePicker';
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChat';
import CarPendingDashboard from '../components/CarPendingDashboard';
import CarDetailsBox from '../components/CarDetailsBox';
import useGetCarDetails from '../hooks/useGetCarDetails';
import CarStats from '../components/CarStats';
import { IChartData } from '@/components/Dealer/dealerDetails/DealerDashboardPage';

export interface IDateRangeType {
  start: Date | null;
  end: Date | null;
}

export default function CarDetailsPage() {
  const router = useRouter();
  const path = usePathname();

  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();
  const [leadsDateRange, setLeadsDateRange] = useState<IDateRangeType>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });
  const [leadsData, setLeadsData] = useState<IChartData[]>([]);
  const [viewsDateRange, setViewsDateRange] = useState<IDateRangeType>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });
  const [viewsData, setViewsData] = useState<IChartData[]>([]);
  const [productSellDateRange, setProductSellDateRange] =
    useState<IDateRangeType>({
      start: new Date(new Date().setDate(new Date().getDate() - 7)),
      end: new Date(),
    });
  const [productData, setProductData] = useState<IChartData[]>([]);

  const {
    getCarDetailsCallBack,
    loading: getCarDetailsLoading,
    data: details,
  } = useGetCarDetails({ carId });

  const memoizedFormatDataForChart = useCallback(
    (data: RangeObject[], dateRange: DealerRange) => {
      return formatDataForChart(data, dateRange);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leadsData, viewsData, productData]
  );

  const [carAnalyticsData, { data: analyticsData }] = useLazyQuery(
    CAR_ANALYTICS,
    {
      onCompleted: (d) => {
        setLeadsData(
          memoizedFormatDataForChart(
            d.getCarAnalyticsReport.data.totalLeadsInRange,
            leadsDateRange
          )
        );
        setViewsData(
          memoizedFormatDataForChart(
            d.getCarAnalyticsReport.data.totalViewsInRange,
            viewsDateRange
          )
        );
        setProductData(
          memoizedFormatDataForChart(
            d.getCarAnalyticsReport.data.totalProductSoldInRange,
            productSellDateRange
          )
        );
      },
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (carId) {
      getCarDetailsCallBack({
        variables: {
          carId,
        },
      });
    } else {
      catchError(message.wrongUrl, true),
        // TODO: navigate to 404 page
        router.replace(routes.dashboard.children.carsListing.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, path]);

  useEffect(() => {
    carAnalyticsData({
      variables: {
        carId: carId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  useEffect(() => {
    carAnalyticsData({
      variables: {
        carId: carId,
        lead: {
          start: leadsDateRange?.start?.toISOString(),
          end: leadsDateRange?.end?.toISOString(),
        },
        views: {
          start: viewsDateRange?.start?.toISOString(),
          end: viewsDateRange?.end?.toISOString(),
        },
        product: {
          start: productSellDateRange?.start?.toISOString(),
          end: productSellDateRange?.end?.toISOString(),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, leadsDateRange, viewsDateRange, productSellDateRange]);

  return (
    <>
      {getCarDetailsLoading && <CarDetailsLoader />}
      {details?.getCarDetailAdmin.data.status === CarStatus.Pending ||
      details?.getCarDetailAdmin.data.status === CarStatus.Disabled ? (
        <CarPendingDashboard carData={details?.getCarDetailAdmin?.data} />
      ) : (
        <>
          {!getCarDetailsLoading && details && (
            <div className="grid grid-cols-12 gap-4 my-4 justify-start items-start  ">
              <div className="col-span-12">
                {analyticsData?.getCarAnalyticsReport?.data && (
                  <CarStats
                    data={analyticsData?.getCarAnalyticsReport?.data}
                    status={details?.getCarDetailAdmin?.data.status}
                  />
                )}
              </div>
              <div className=" xl:col-span-8 col-span-12">
                {details?.getCarDetailAdmin?.data && (
                  <CarDetailsBox
                    car={{
                      model: details?.getCarDetailAdmin?.data?.model || '',
                      launchYear:
                        details?.getCarDetailAdmin?.data?.launchYear || 0,
                      companyName:
                        details?.getCarDetailAdmin?.data?.companyName,
                      owners: details?.getCarDetailAdmin?.data?.noOfOwners || 0,
                      registrationNumber:
                        details?.getCarDetailAdmin?.data?.registrationNumber ||
                        '',
                      transmission:
                        details?.getCarDetailAdmin?.data?.transmission ||
                        TransmissionType.Mt,
                      fuel:
                        details?.getCarDetailAdmin?.data?.fuelType ||
                        FuelType.Diesel,
                      kmsRun: details?.getCarDetailAdmin?.data?.totalRun || 0,
                      thumbnailUrl:
                        details?.getCarDetailAdmin?.data?.gallery?.find(
                          (item) =>
                            item.thumbnail === 'true' && item.documents.length
                        )?.documents[0].path || '',
                      status:
                        details?.getCarDetailAdmin?.data?.status ||
                        CarStatus.Approved,
                    }}
                    dealer={{
                      id: details?.getCarDetailAdmin.data.user?.id || '',
                      firstName:
                        details?.getCarDetailAdmin.data.user?.firstName || '',
                      lastName:
                        details?.getCarDetailAdmin.data.user?.lastName || '',
                      email: details?.getCarDetailAdmin.data.user?.email || '',
                      phone:
                        details?.getCarDetailAdmin.data.user?.phoneNumber || '',
                    }}
                  />
                )}
              </div>

              <div className=" xl:col-span-4 col-span-12 w-full p-4 h-full bg-white shadow-lg rounded-2xl ">
                <div className=" flex flex-col gap-y-8 h-full px-4 text-seaGreen-primary mb-8">
                  <div>
                    <h2 className=" text-xl font-bold text-gray-700">
                      Views over time
                    </h2>
                    <DateRangePickerComponent
                      setState={setViewsDateRange}
                      state={viewsDateRange}
                    />
                  </div>
                  <BarChart chartData={viewsData} xHeader="Number of views" />
                </div>
              </div>

              <div className=" rounded-xl px-2 py-4 shadow-xl xl:col-span-4 col-span-12 bg-white ">
                <div className=" flex flex-col justify-between items-start px-4 text-orange-primary mb-8">
                  <h2 className="text-xl font-bold text-gray-700">
                    Product Sales Report
                  </h2>
                  <DateRangePickerComponent
                    setState={setProductSellDateRange}
                    state={productSellDateRange}
                  />
                </div>
                <LineChart
                  chartData={productData}
                  xHeader="Number of product sold"
                />
              </div>

              <div className="rounded-xl px-2 py-4 shadow-xl xl:col-span-4 col-span-12 bg-white ">
                <div className=" flex flex-col items-start px-4 text-orange-primary mb-8">
                  <h2 className="text-xl font-bold text-gray-700">
                    Leads over time
                  </h2>
                  <DateRangePickerComponent
                    setState={setLeadsDateRange}
                    state={leadsDateRange}
                  />
                </div>
                <LineChart chartData={leadsData} xHeader="Number of leads" />
              </div>

              <div className="self-start xl:col-span-4 col-span-12 w-full px-8 pt-4 pb-8 bg-white shadow-lg rounded-lg space-y-2">
                <h2 className="text-xl font-bold text-gray-700">
                  Product Sold Report
                </h2>
                {analyticsData?.getCarAnalyticsReport.data &&
                analyticsData?.getCarAnalyticsReport.data.productDetails.sales
                  .length > 0 ? (
                  <ProgessBars
                    chartData={
                      analyticsData?.getCarAnalyticsReport.data.productDetails
                        .sales
                    }
                  />
                ) : (
                  <div className=" text-xs text-gray-500 tracking-wider my-8 font-thin">
                    No products sold yet
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
