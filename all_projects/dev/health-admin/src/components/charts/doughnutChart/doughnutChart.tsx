import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import DoughnutLabel from 'chartjs-plugin-doughnutlabel-rebourne';
import { CustomDoughnutChartInterface } from 'interface/charts/dougnutChart.interface';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels, ArcElement, Tooltip, Legend, DoughnutLabel);
ChartJS.defaults.plugins.doughnutlabel = {}; // global scope

export default function DoughnutChartComponent({
  xAxisLabels,
  datasets,
  options,
  styleClass,
}: CustomDoughnutChartInterface) {
  const data = {
    labels: xAxisLabels,
    datasets: datasets,
    innerText: '170',
  };
  return (
    <div className={styleClass ? styleClass : ''}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
