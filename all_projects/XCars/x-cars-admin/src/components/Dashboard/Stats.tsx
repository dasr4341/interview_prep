'use client';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_STATS_COUNTS } from '@/graphql/dashboard-analytics.query';
import { DashboardReportType, GetStatsCountModel } from '@/generated/graphql';
import { SlGraph } from 'react-icons/sl';
import { FaRegUser } from 'react-icons/fa';
import { FaCarAlt } from 'react-icons/fa';
import LeadsDistribution from './components/LeadsDistribution';
import StatsCard from './components/StatsCard';
import SemiCircleProgress from './components/SemiCircleProgress';
import ReportOverTimeGraph from './components/ReportOverTimeGraph';

const Stats = () => {
  const [statsData, setStatsData] = useState<GetStatsCountModel | null>(null);
  const { loading: statsLoading } = useQuery(GET_STATS_COUNTS, {
    onCompleted: (data) => {
      setStatsData(data.getStatsCountsDashboard.data);
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        <StatsCard
          total={statsData?.leads.totalLeads || 0}
          subTotal={statsData?.leads.inPast7DaysLeads || 0}
          title="Leads"
          Icon={SlGraph}
          loading={statsLoading}
        />
        <StatsCard
          total={statsData?.cars.totalSoldCars || 0}
          subTotal={statsData?.cars.inPast7DaysSoldCars || 0}
          title="Sold Cars"
          Icon={FaCarAlt}
          loading={statsLoading}
        />
        <StatsCard
          total={statsData?.cars.totalApprovedCars || 0}
          subTotal={statsData?.cars.inPast7DaysApprovedCars || 0}
          title="Live Cars"
          Icon={FaCarAlt}
          loading={statsLoading}
        />
        <StatsCard
          total={statsData?.totalVisitors || 0}
          subTotal={statsData?.inPast7DaysVisitors || 0}
          title="Visitors"
          Icon={FaRegUser}
          loading={statsLoading}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr_1fr] gap-4">
        <div className="flex flex-col gap-4 bg-white p-4 py-2 rounded-2xl shadow-md">
          <LeadsDistribution leads={statsData?.leads} loading={statsLoading} />
          <hr className="w-full border-dashed border-gray-800 mt-2" />
          <SemiCircleProgress
            totalCars={statsData?.cars.totalCars || 0}
            soldCars={statsData?.cars.totalSoldCars || 0}
          />
        </div>
        <ReportOverTimeGraph
          label={'Visitors'}
          color={'#90caf9'}
          type={DashboardReportType.Visitors}
        />
        <ReportOverTimeGraph
          label={'Sold Cars'}
          color={'#d4a276'}
          type={DashboardReportType.SoldCars}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ReportOverTimeGraph
          label={'Leads'}
          color={'#84a98c'}
          type={DashboardReportType.LeadsListing}
        />
        <ReportOverTimeGraph
          label={'Car Listing'}
          color={'#ffa5ab'}
          type={DashboardReportType.CarListing}
        />
      </div>
    </div>
  );
};

export default Stats;
