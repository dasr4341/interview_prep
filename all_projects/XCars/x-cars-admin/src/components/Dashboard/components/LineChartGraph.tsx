'use client';

import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartGraph = ({
  data,
  color,
  label,
}: {
  data: { key: string; count: number }[];
  color: string;
  label: string;
}) => {
  return (
    <LineChart
      xAxis={[
        { scaleType: 'band', data: data.map((d) => d.key), label: 'Time' },
      ]}
      series={[
        {
          data: data.map((d) => d.count),
          area: true,
          label,
          color: color,
        },
      ]}
      height={300}
      tooltip={{
        ...(data.length ? { trigger: 'axis' } : { trigger: 'none' }),
      }}
    />
  );
};

export default LineChartGraph;
