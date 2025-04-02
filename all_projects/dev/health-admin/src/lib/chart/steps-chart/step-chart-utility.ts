import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { getHeartStepsAnomaly, heartStepsCallback } from 'Helper/heart-steps-helper';
import { ReportTypes } from 'interface/chart.interfaces';
import { StepsChartProps } from 'interface/heart-steps.interface';
import { setBackgroundColor } from 'Helper/chart-helper';


export const stepChartCanvas = (stepsChartProps: StepsChartProps) => {
Chart.register(annotationPlugin);

const { ctx, chartData, anomalyData, tickValue, reportType, version } = stepsChartProps ?? {};

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.dataSets,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 2,
          tension: 0.5,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          right: window.innerWidth >= 1199 ? 100 : 0,
        },
      },
      elements: {
        point: {
          radius: 0
        }
      },
      animation: {
        duration: 0,
      },
      responsive: true,
      plugins: {
        datalabels: {
          display: false
        },
        annotation: {
          clip: false,
          common: {
            drawTime: 'afterDatasetsDraw',
          },
          annotations: {
            ...getHeartStepsAnomaly(anomalyData),
            ...setBackgroundColor(0, 0),
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            lineWidth: 2,
              z: -1,
              tickLength: 10,
              display: true,
              color: (context) => {
                const index = context.index;
                if (index % 1 === 0) {
                  return 'rgba(255, 99, 132, 0.12)';
                } else {
                  return '';
                }
              },
          },
          ticks: {
            color: '#161616',
            font: {
              size: 11,
              weight: '600',
              family: "'Open Sans', sans-serif",
            },
            callback: (callbackValue: number | string) => heartStepsCallback({
              callbackArgument: Number(callbackValue), 
              labelsData: chartData.labels, 
              typeOfReport: reportType
            }),
          },
          afterBuildTicks(scale) {
            if (reportType === ReportTypes.WeeklyReport || reportType === ReportTypes.MonthlyReport || !version) {
              const ticks = scale.ticks;
              scale.ticks = [
                ...Array(tickValue?.take)
                  .fill(0)
                  .filter((_, i) => (i * (tickValue?.skip || 0)) < scale.ticks.length)
                  .map((_, i) => ticks[i * Number(tickValue?.skip)]),
                ticks[ticks.length - 1],
              ];
            }
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 99, 132, 0.12)',
            lineWidth: 2,
            z: -1,
          },
          ticks: {
            color: '#161616',
            font: {
              size: 11,
              weight: '600',
              family: "'Open Sans', sans-serif",
            },
          },
        },
      },
    },
  });
};
