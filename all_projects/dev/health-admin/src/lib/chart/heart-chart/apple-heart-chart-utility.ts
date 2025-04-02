import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { getHeartStepsAnomaly } from '../../../Helper/heart-steps-helper';
import { AppleHeartChartProps } from 'interface/heart-steps.interface';
import { appleHeartStepsCallback, setBackgroundColor, xTickStepNumber } from 'Helper/chart-helper';
import { setAppleAverageAnnotation } from './appleAverageLineAnnotation';


export const appleHeartRateChartCanvas = (appleHeartChartProps: AppleHeartChartProps) => {

  const {ctx, chartData, anomalyData, reportType, lowerBound, upperBound, heartAverage} = appleHeartChartProps ?? {};

  console.log({chartData});

Chart.register(annotationPlugin);

const { maxX, minX, xTickStep } = xTickStepNumber(chartData, reportType);

  return new Chart(ctx, 
    {
      type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter Dataset',
        data: chartData,
        backgroundColor: 'rgba(54, 162, 235, 1)',
      }],
    },
      options: {
        layout: {
          padding: {
            right: window.innerWidth >= 1199 ? 100 : 95,
          },
        },
        animation: {
          duration: 0,
        },
        responsive: true,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            display: false,
          },
          annotation: {
            clip: false,
            common: {
              drawTime: 'afterDatasetsDraw',
            },
            annotations: {
              ...setAppleAverageAnnotation(heartAverage as number),
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
            type: 'linear',
            position: 'bottom',
            min: minX,
            max: maxX,
            ticks: {
              stepSize: Number(xTickStep),
              color: '#161616',
              font: {
                size: 11,
                weight: '600',
                family: "'Open Sans', sans-serif",
              },
              callback: (value, index) => appleHeartStepsCallback({
                value: value, 
                indexNumber: index, 
                reportType: reportType, 
                heartData: chartData
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
  