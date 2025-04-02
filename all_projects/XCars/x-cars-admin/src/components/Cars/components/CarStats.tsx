import AnalyticsCard from '@/components/Dealer/components/AnalyticsCard';
import { routes } from '@/config/routes';
import { CarAnalytics, CarStatus } from '@/generated/graphql';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { IoStatsChart } from 'react-icons/io5';
import { RiBillLine } from 'react-icons/ri';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';

const CarStats = ({
  data,
  status,
}: {
  data: CarAnalytics;
  status?: CarStatus | null;
}) => {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  return (
    <div className="grid grid-cols-12 w-full items-center gap-4">
      <Link
        href={routes.dashboard.children.carDetails.children.leads.path(carId)}
        className={`xl:col-span-3 lg:col-span-4 col-span-6 ${status === CarStatus.Sold ? 'pointer-events-none' : ''} `}
      >
        <AnalyticsCard
          icon={<IoStatsChart size={25} />}
          name="total leads"
          data={data?.totalLeadCount as number}
          className=" bg-theme-red "
          containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
        />
      </Link>

      <Link
        href={routes.dashboard.children.carDetails.children.quotations.path(
          carId
        )}
        className={`xl:col-span-3 lg:col-span-4 col-span-6 ${status === CarStatus.Sold ? 'pointer-events-none' : ''} `}
      >
        <AnalyticsCard
          icon={<RiBillLine size={25} />}
          name="Pending quotations"
          data={data?.quotationDetails?.totalPendingQuotationCount as number}
          className=" bg-theme-yellow"
          containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
        />
      </Link>

      <Link
        href={routes.dashboard.children.carDetails.children.quotations.path(
          carId
        )}
        className={`xl:col-span-3 lg:col-span-4 col-span-6 ${status === CarStatus.Sold ? 'pointer-events-none' : ''} `}
      >
        <AnalyticsCard
          icon={<RiBillLine size={25} />}
          name="Expired quotations"
          data={data?.quotationDetails?.totalExpiredQuotationCount as number}
          className=" bg-theme-green "
          containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
        />
      </Link>

      <Link
        href={routes.dashboard.children.carDetails.children.carViews.path(
          carId
        )}
        className={`xl:col-span-3 lg:col-span-4 col-span-6 ${status === CarStatus.Sold ? 'pointer-events-none' : ''} `}
      >
        <AnalyticsCard
          icon={<TbDeviceDesktopAnalytics size={25} />}
          name="Total Views"
          data={data?.totalViewCount as number}
          className=" bg-theme-purple"
          containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
        />
      </Link>
    </div>
  );
};

export default CarStats;
