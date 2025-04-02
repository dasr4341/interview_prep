import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { averageLineAnnotation } from './averageLineAnnotation';
import { getHeartStepsAnomaly, heartStepsCallback } from '../../../Helper/heart-steps-helper';
import { ReportTypes } from 'interface/chart.interfaces';
import { setBackgroundColor } from 'Helper/chart-helper';
import { HeartRateChartProps } from 'interface/heart-steps.interface';

export function heartRateChartCanvas(heartRateChartProps: HeartRateChartProps) {
  const { ctx, chartData, anomalyData, tickValue, reportType, lowerBound, upperBound, version, heartAverage } = heartRateChartProps ?? {};

  Chart.register(annotationPlugin);

  return new Chart(ctx, 
    {
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
            right: window.innerWidth >= 1199 ? 100 : 95,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        animation: {
          duration: 0,
        },
        responsive: true,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        plugins: {
          datalabels: {
            display: false,
          },
          annotation: {
            clip: false,
            common: {
              drawTime: 'afterDatasetsDraw',
            },
            annotations: {
              ...averageLineAnnotation(heartAverage),
              ...getHeartStepsAnomaly(anomalyData),
              ...setBackgroundColor(lowerBound, upperBound)
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
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
              color: ' #161616',
              font: {
                size: 11,
                weight: '600',
                family: "'Open Sans', sans-serif",
              },
            },
          },
        },
      },
    }
  );
};
  