import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { sleepAnnotation } from './sleepAnnotation';
import { getBarThicknessBreakpoint, getBarChartAnomaly, setBoundColor, responsiveBarFontAndOffset } from 'Helper/chart-helper';

interface Data {
  sleepLabels: string[];
  sleepDataSets: Array<number | null>;
  isAnomaly: boolean[];
}

export const sleepChartCanvas = (ctx: CanvasRenderingContext2D, chartData: {
  data: Data;
  lowerBound?: number | null;
  upperBound?: number | null;
  sleepAverage: number | null;
}) => {
Chart.register(annotationPlugin, ChartDataLabels);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.data.sleepLabels,
      datasets: [
        {
          data: chartData.data.sleepDataSets,
          backgroundColor: getBarChartAnomaly(chartData.data.isAnomaly),
          borderWidth: 0,
          borderRadius: Number.MAX_VALUE,
          borderSkipped: false,
          barThickness: getBarThicknessBreakpoint(chartData.data.sleepDataSets)
        },
      ],
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          left: 130,
          right: window.innerWidth >= 1199 ? 130 : 0,
        },
      },
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          formatter: (value) => {
            if (value) {
              return value;
            }
            return 'No Data';
          },
          color: '#23265B',
          labels: {
            title: {
              font: {
                size: responsiveBarFontAndOffset(chartData.data.sleepDataSets)?.labelFontSize,
                family: "'Open Sans', sans-serif",
                weight: 600,
              },
              offset: responsiveBarFontAndOffset(chartData.data.sleepDataSets)?.labelOffset,
            },
          },
          align: 'end',
          anchor: 'start',
          rotation: 270,
        },
        annotation: {
          clip: false,
          common: {
            drawTime: 'afterDatasetsDraw',
          },
          annotations: {
            ...sleepAnnotation(chartData.sleepAverage),
            ...setBoundColor(chartData?.lowerBound, chartData?.upperBound)
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'black',
            padding: 2,
            font: {
              size: responsiveBarFontAndOffset(chartData.data.sleepDataSets)?.xAxisFontSize,
              family: "'Open Sans', sans-serif",
              weight: '400',
            },
          },
        },
        y: {
          display: false,
          grid: {
            drawBorder: false,
          },
        }
      },
    },
  });
};

