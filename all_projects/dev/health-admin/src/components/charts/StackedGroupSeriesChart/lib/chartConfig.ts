import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { StackGroupChartInterface } from '../StackedGroupChart';

 function getStepBasedOnYMax(yMax: number) {
  if (yMax % 3 === 0) {
    return yMax / 3;
  }
  if (yMax % 4 === 0) {
    return yMax / 4;
  }
  if (yMax % 2 !== 0) {
    const remainder = yMax % 2;
    const newMax = remainder + yMax;
   return newMax / 2;
 }
  return yMax / 2;
}

export const chartConfig = (
  ctx: CanvasRenderingContext2D,
  data: {
    labels: string[];
    datasets: StackGroupChartInterface[];
  },
  yMax: number,
  yAxisSteps? : number
) => {
  Chart.register(annotationPlugin, ChartDataLabels);
  
  return new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      layout: {
        padding: {
          right: 0,
          left: 0,
        },
      },
      responsive: true,
      plugins: {
        datalabels: {
          display: false,
        },
        annotation: {
          clip: false,
          common: {
            drawTime: 'afterDatasetsDraw',
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (d: { dataset: { label: any; assessmentType: string; }; dataIndex: number; }) => {
              const arr = d.dataset.label;
              if (d.dataset.assessmentType === 'incomplete') {
                return arr[d.dataIndex + 1].split(',');
              }
              return arr[d.dataIndex] || '';
            }
          }
        },
      },
      interaction: {
        intersect: true,
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#8585A1',
            padding: 12,
            font: {
              size: data.labels.length > 10 ? 10 : 15,
            },
          },
        },
        y: {
          max: yMax,
          stacked: true,
          ticks: {
            stepSize: yAxisSteps || getStepBasedOnYMax(yMax),
            callback: (currentValue: number) => currentValue === yMax ? `Percentage ${yMax}` : currentValue
          },
        },
      },
    },
  } as any);
};

