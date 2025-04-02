import { DEALERS_ANALYTICS } from '@/graphql/dealersAnalytics.query';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import AnalyticsCard from './AnalyticsCard';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { IoStatsChart } from 'react-icons/io5';
import { RiBillLine } from 'react-icons/ri';
import { PiSteeringWheelBold } from 'react-icons/pi';

const DealerAnalytics = () => {
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();

  const [delaerAnalyticsData, { data }] = useLazyQuery(DEALERS_ANALYTICS, {
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    delaerAnalyticsData({
      variables: {
        input: {
          dealerId: dealerId,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId]);

  return (
    <div>
      <div className="grid grid-cols-12 w-full gap-4">
        <Link
          href={routes.dashboard.children.dealerDetails.children.leads.path(
            dealerId
          )}
          className=" xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
        >
          <AnalyticsCard
            icon={<IoStatsChart size={20} />}
            name="Assigned Lead(s)"
            info={`Track the number of leads generated for each dealer. ${data?.getDealerAnalytics?.data?.leads?.assignedLeads} UNASSIGNED LEADS.`}
            data={
              data?.getDealerAnalytics.data.leads?.assignedLeads
                ?.length as number
            }
            className=" bg-theme-red "
            containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
          />
        </Link>
        <Link
          className=" xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
          href={routes.dashboard.children.dealerDetails.children.leads.path(
            dealerId
          )}
        >
          <AnalyticsCard
            icon={<IoStatsChart size={20} />}
            name="Unassigned Lead(s)"
            data={
              data?.getDealerAnalytics?.data?.leads
                ?.totalUnAssignedLeadsCount as number
            }
            className=" bg-theme-yellow"
            containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
          />
        </Link>
        <Link
          className=" xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
          href={routes.dashboard.children.dealerDetails.children.quotations.path(
            dealerId
          )}
        >
          <AnalyticsCard
            icon={<RiBillLine size={20} />}
            name="Pending Quotations(S)"
            info="Track the number of quotations generated for each dealer. "
            data={
              data?.getDealerAnalytics.data?.quotations
                ?.pendingQuotations as number
            }
            className=" bg-theme-green "
            containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
          />
        </Link>
        <Link
          className=" xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
          href={routes.dashboard.children.dealerDetails.children.cars.path(
            dealerId
          )}
        >
          <AnalyticsCard
            icon={<PiSteeringWheelBold size={25} />}
            name="Total Posted Car(s)"
            info={`Track the number of cars posted by the dealer. ${data?.getDealerAnalytics.data.cars?.totalCarsPending} more needs to be APPROVED.`}
            data={data?.getDealerAnalytics.data.cars?.totalCarsPosted as number}
            className=" bg-theme-purple"
            containerClasses=" min-h-28 min-w-32 bg-white lg:gap-8"
          />
        </Link>
      </div>
    </div>
  );
};

export default DealerAnalytics;
