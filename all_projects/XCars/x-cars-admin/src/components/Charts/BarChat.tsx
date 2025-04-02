import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IChartData {
  key: string;
  value: number;
}

const BarChart = ({
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
        fill: true,
        backgroundColor: chartData.map(
          (_, index) =>
            ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][
              index % 6
            ]
        ),
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 2,
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
    <div className="w-full min-h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
