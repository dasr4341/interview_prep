import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { StackGroupChartInterface } from '../StackedGroupChart';

export const chartConfig = (
  ctx: CanvasRenderingContext2D,
  data: {
    labels: string[];
    datasets: StackGroupChartInterface[];
  }
) => {
  Chart.register(annotationPlugin, ChartDataLabels);

  return new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }
  } as any);
};

