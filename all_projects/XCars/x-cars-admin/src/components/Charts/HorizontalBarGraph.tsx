import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarGraph = ({
  assigned,
  unassigned,
}: {
  assigned: number;
  unassigned: number;
}) => {
  const data = {
    labels: ['Assigned Leads', 'Unassigned Leads'],
    datasets: [
      {
        label: 'Assigned Leads',
        data: [assigned, 0],
        backgroundColor: '#ff6e7f',
        barThickness: 20,
        borderRadius: {
          topLeft: 0,
          topRight: 20,
          bottomLeft: 0,
          bottomRight: 20,
        },
        borderSkipped: false,
      },
      {
        label: 'Unassigned Leads',
        data: [0, unassigned],
        backgroundColor: '#d779fc',
        barThickness: 20,
        borderRadius: {
          topLeft: 0,
          topRight: 20,
          bottomLeft: 0,
          bottomRight: 20,
        },
        borderSkipped: false,
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        categoryPercentage: 0.8,
        barPercentage: 0.6,
        grid: {
          display: false,
        },
        ticks: {
          color: '#464848',
          font: {
            weight: 'bold' as const,
          },
        },
      },
      x: {
        categoryPercentage: 0.8,
        barPercentage: 0.6,
        ticks: {
          color: '#464848',
          font: {
            weight: 'bold' as const,
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} className=" max-h-[250px] p-4" />;
};

export default HorizontalBarGraph;
