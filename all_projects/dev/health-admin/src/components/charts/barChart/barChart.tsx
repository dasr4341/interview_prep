import React, { useLayoutEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChartInterface } from 'interface/charts/barChart.interface';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChartComponent({
  xAxisLabels,
  datasets,
  options,
}: BarChartInterface) {
  const data = {
    labels: xAxisLabels,
    datasets: datasets,
  };

  const surveyDetailsChart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const chartInstance = surveyDetailsChart.current?.getContext('2d') || null;

    if (chartInstance && datasets) {
      const barChart = new Chart(chartInstance, { type: 'bar', options, data });

      return () => {
        barChart?.destroy();
      };
    }
    // 
  }, [xAxisLabels, datasets, options]);

  return (
    <div className="lg:w-3/5 md:w-4/6 xl:w-3/4 2xl:w-10/12 p-2">
      <canvas
        ref={surveyDetailsChart}
        className="mb-7 chart w-auto"></canvas>
    </div>
  );
}
