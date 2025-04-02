'use client';

import React, { useState } from 'react';
import LineChartGraph from './LineChartGraph';
import useGraphData from '../hooks/useGraphData.hook';
import { DashboardReportType } from '@/generated/graphql';
import { IDateRangeType } from '@/components/Cars/carDetails/CarDetailsPage';
import DateRangePickerComponent from '@/components/Charts/components/DateRangePicker';

const ReportOverTimeGraph = ({
  label,
  color,
  type,
}: {
  label: string;
  color: string;
  type: DashboardReportType;
}) => {
  const [dateRange, setDateRange] = useState<IDateRangeType>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });
  const { dataArr } = useGraphData({
    startDate: dateRange.start,
    endDate: dateRange.end,
    type: type,
  });

  return (
    <div className="w-full flex flex-col items-center bg-white p-1 rounded-2xl shadow-md">
      <div className="w-full flex justify-between gap-4 items-center px-2 text-orange-primary mb-2">
        <h2 className="font-bold text-gray-700">{label} over time</h2>
        <DateRangePickerComponent setState={setDateRange} state={dateRange} />
      </div>
      <LineChartGraph data={dataArr} label={label} color={color} />
    </div>
  );
};

export default ReportOverTimeGraph;
