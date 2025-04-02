import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChartInterface } from 'interface/charts/line-chart.interface';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ xAxisLabels, datasets, options, styleClass }: LineChartInterface) {
  const data = {
    labels: xAxisLabels,
    datasets: datasets,
  };

  return (
    <div className={styleClass ? styleClass : ''}>
      <Line options={options} data={data} />
    </div>
  );
}
