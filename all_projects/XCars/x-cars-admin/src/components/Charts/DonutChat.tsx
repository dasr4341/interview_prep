'use client';
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IChartData } from '../Dealer/components/DealerStats';
ChartJS.register(ArcElement, Tooltip, Legend);

function DonutChat({ chatData }: { chatData: IChartData[] }) {
  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '50%',
  };

  const finalData = {
    labels: chatData.map((item: { key: string }) => item.key),
    datasets: [
      {
        data: chatData.map((item: { value: number }) => Math.round(item.value)),
        backgroundColor: chatData.map((item) => item.color),
        borderColor: chatData.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(chatData.length).fill(true),
      },
    ],
  };
  return <Doughnut data={finalData} options={options} className=" h-fit p-4" />;
}

export default DonutChat;
