import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { spo2Annotation } from './spo2Annotation';
import { getBarThicknessBreakpoint, getBarChartAnomaly, setBoundColor, responsiveBarFontAndOffset } from 'Helper/chart-helper';
import { Spo2ChartDataProps, Spo2ChartUtilityProps } from 'interface/chart.interfaces';

export const spo2ChartCanvas = (spo2ChartProps: Spo2ChartUtilityProps) => {
  Chart.register(annotationPlugin, ChartDataLabels);

  const { ctx, chartData } = spo2ChartProps || {};
  const { data, lowerBound, upperBound, spo2Average } = chartData || {} as Spo2ChartDataProps;
  const { isAnomaly, spo2DataSets, spo2Labels } = data || {};

  function dynamicMinValue(lowerBoundValue?: number | null) {
    const filteredDataValue =  spo2DataSets?.filter((el) => el) as Array<number>;
    const minValue = filteredDataValue.length ? Math.floor(Math.min(...filteredDataValue)) - 4 : 0;
    
    if (minValue > 0) {
      return lowerBoundValue && (lowerBoundValue <= minValue) ? lowerBoundValue : minValue;
    }
    return 0;
  }

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: spo2Labels,
      datasets: [
        {
          data: spo2DataSets,
          backgroundColor: getBarChartAnomaly(isAnomaly),
          borderWidth: 0,
          borderRadius: Number.MAX_VALUE,
          borderSkipped: false,
          barThickness: getBarThicknessBreakpoint(spo2DataSets),
        },
      ],
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          left: window.innerWidth >= 1199 ? 130 : 70,
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
              return value + '%';
            }
            return 'No Data';
          },
          labels: {
            title: {
              font: {
                size: responsiveBarFontAndOffset(spo2DataSets)?.labelFontSize,
                family: "'Open Sans', sans-serif",
                weight: 600,
              },
              offset: responsiveBarFontAndOffset(spo2DataSets)?.labelOffset,
            },
          },
          align: ({ dataset, dataIndex }: { dataset: any, dataIndex: number }) => {
            return  !!dataset.data[dataIndex] ? 'start' : 'end';
          },
          anchor: 'end',
          rotation: 270,
        },
        annotation: {
          clip: false,
          common: {
            drawTime: 'afterDatasetsDraw',
          },
          annotations: {
            ...spo2Annotation(spo2Average),
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
              size: responsiveBarFontAndOffset(spo2DataSets)?.xAxisFontSize,
              family: "'Open Sans', sans-serif",
              weight: '400',
            },
          },
        },
        y: {
          min: dynamicMinValue(lowerBound),
          beginAtZero: false,
          display: false,
          grid: {
            drawBorder: false,
          },
        },
      },
    },
  });
};
