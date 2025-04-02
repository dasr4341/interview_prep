import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IChartData {
  key: string;
  value: number;
}

const LineChart = ({
  chartData,
  label,
  xHeader,
}: {
  chartData: IChartData[];
  label?: string;
  xHeader?: string;
}) => {
  const data = {
    labels: chartData.map((d) => d.key),
    datasets: [
      {
        label: label,
        data: chartData.map((d) => d.value),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, 'rgba(72, 187, 255, 0.2)'); // Light Blue
          gradient.addColorStop(0.5, 'rgba(29, 233, 182, 0.4)'); // Aqua Green
          gradient.addColorStop(1, 'rgba(0, 128, 255, 0.6)'); // Deep Blue

          return gradient;
        },
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    scales: {
      y: {
        title: {
          display: true,
          text: xHeader,
          color: '#464848',
        },
        display: true,
        min: 0,
        border: {
          color: '#464848',
        },
        ticks: {
          color: '#464848',
          font: {
            weight: 'bold' as const,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#464848',
          font: 'bold',
        },
        grid: {
          display: false,
        },
        display: true,
        border: {
          color: '#464848',
        },
        ticks: {
          color: '#464848',
          font: {
            weight: 'bold' as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Line
      data={data}
      options={options}
      className=" min-h-[250px] max-h-[350px]"
    />
  );
};

export default LineChart;
