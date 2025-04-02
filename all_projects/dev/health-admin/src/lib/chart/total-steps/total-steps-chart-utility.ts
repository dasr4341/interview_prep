import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getBarThicknessBreakpoint, getBarChartAnomaly, setBoundColor, responsiveBarFontAndOffset } from 'Helper/chart-helper';
import { totalStepsAnnotation } from './totalStepsAnnotation';
import { TotalStepsChartData, TotalStepsChartProps, TotalStepsChartUtilityProps } from 'interface/chart.interfaces';


export const totalStepsChartCanvas = (totalStepsProps: TotalStepsChartUtilityProps) => {
Chart.register(annotationPlugin, ChartDataLabels);
const { ctx, chartData } = totalStepsProps || {} as TotalStepsChartUtilityProps;
const { data, lowerBound, upperBound, totalStepsAverage } = chartData || {} as TotalStepsChartProps;
const { isAnomaly, totalStepsDataSets, totalStepsLabels } = data || {} as TotalStepsChartData;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: totalStepsLabels,
      datasets: [
        {
          data: totalStepsDataSets,
          backgroundColor: getBarChartAnomaly(isAnomaly),
          borderWidth: 0,
          borderRadius: Number.MAX_VALUE,
          borderSkipped: false,
          barThickness: getBarThicknessBreakpoint(totalStepsDataSets)
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
              return value;
            }
            return 'No Data';
          },
          labels: {
            title: {
              font: {
                size: responsiveBarFontAndOffset(totalStepsDataSets)?.labelFontSize,
                family: "'Open Sans', sans-serif",
                weight: 600,
              },
              offset: responsiveBarFontAndOffset(totalStepsDataSets)?.labelOffset,
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
            ...totalStepsAnnotation(totalStepsAverage),
            ...setBoundColor(lowerBound, upperBound)
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
              size: responsiveBarFontAndOffset(totalStepsDataSets)?.xAxisFontSize,
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
