import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getBarThicknessBreakpoint, getBarChartAnomaly, setBoundColor, responsiveBarFontAndOffset } from 'Helper/chart-helper';
import { hrvAnnotation } from './hrvAnnotation';

interface Data {
  hrvLabels: string[];
  hrvDataSets: Array<number | null>;
  isAnomaly: Array<boolean>;
}

export const hrvChartCanvas = (
  ctx: CanvasRenderingContext2D,
  chartData: { 
    data: Data;
    lowerBound?: number | null;
    upperBound?: number | null;
    hrvAverage: number | null;
  }
) => {
Chart.register(annotationPlugin, ChartDataLabels);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.data.hrvLabels,
      datasets: [
        {
          data: chartData.data.hrvDataSets,
          backgroundColor: getBarChartAnomaly(chartData.data.isAnomaly),
          borderWidth: 0,
          borderRadius: Number.MAX_VALUE,
          borderSkipped: false,
          barThickness: getBarThicknessBreakpoint(chartData.data.hrvDataSets)
        },
      ],
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          left: window.innerWidth >= 1199 ? 130 : 65,
          right: window.innerWidth >= 1199 ? 130 : 80,
        },
      },
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#23265B',
          formatter: (value) => {
            if (value) {
              return value + 'ms';
            }
            return 'No Data';
          },
          labels: {
            title: {
              font: {
                size: responsiveBarFontAndOffset(chartData.data.hrvDataSets)?.labelFontSize,
                family: "'Open Sans', sans-serif",
                weight: 600,
              },
              offset: responsiveBarFontAndOffset(chartData.data.hrvDataSets)?.labelOffset,
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
            ...hrvAnnotation(chartData.hrvAverage),
            ...setBoundColor(chartData.lowerBound, chartData.upperBound)
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
              size: responsiveBarFontAndOffset(chartData.data.hrvDataSets)?.xAxisFontSize,
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
        },
      },
    },
  });
};
