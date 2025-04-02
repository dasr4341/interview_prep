import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getBarThicknessBreakpoint, getPaddingBreakpoint, getBarChartAnomaly, setBoundColor, getMaxScaleValue, responsiveBarFontAndOffset } from 'Helper/chart-helper';

interface Data {
  tempLabels: string[];
  tempDataSets: Array<number | null>;
  isAnomaly: boolean[];
}

export const tempChartCanvas = (
  ctx: CanvasRenderingContext2D,
  chartData: { 
    data: Data;
    lowerBound?: number | null;
    upperBound?: number | null;
    chartUnit?: string;
  }
) => {
  Chart.register(annotationPlugin, ChartDataLabels);

  const tempeLineAnnotation: any = {
    type: 'line',
    yMin: 0,
    yMax: 0,
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
  };

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.data.tempLabels,
      datasets: [
        {
          data: chartData.data.tempDataSets,
          backgroundColor: getBarChartAnomaly(chartData.data.isAnomaly),
          borderWidth: 0,
          borderRadius: (el) => {
            if (Number(el.raw) >= 0) {
              return {
                topLeft: Number.MAX_VALUE, 
                topRight: Number.MAX_VALUE, 
                bottomLeft: 0, 
                bottomRight: 0,
              };
            }
            return {
              topLeft: 0, 
              topRight: 0, 
              bottomLeft: Number.MAX_VALUE, 
              bottomRight: Number.MAX_VALUE,
            };
          },
          borderSkipped: false,
          barThickness: getBarThicknessBreakpoint(chartData.data.tempDataSets),
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      responsive: true,
      layout: {
        padding: {
          left: window.innerWidth >= 1199 ? 130 : 0,
          right: window.innerWidth >= 1199 ? 130 : 0,
          top: 50,
          bottom: 25
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: '#23265B',
          formatter(value) {
            if (value !== null) {
              return `${value} ${chartData?.chartUnit ?? String.fromCharCode(0x2103)}`;
            }
            return 'No Data';
          },
          labels: {
            title: {
              font: {
                size: responsiveBarFontAndOffset(chartData.data.tempDataSets)?.labelFontSize,
                family: "'Open Sans', sans-serif",
                weight: 600,
              },
              offset: responsiveBarFontAndOffset(chartData.data.tempDataSets)?.labelOffset,
            },
          },
          align: ({ dataset, dataIndex }: { dataset: any, dataIndex: number }) => {
            return  dataset.data[dataIndex] < 0 ? 'start' : 'end';
          },
          anchor: ({ dataset, dataIndex }: { dataset: any, dataIndex: number }) => {
            return  dataset.data[dataIndex] < 0 ? 'end' : 'start';
          },
          rotation: 270,
        },
        annotation: {
          clip: false,
          common: {
            drawTime: 'afterDraw',
          },
          annotations: {
            tempeLineAnnotation,
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
            padding: getPaddingBreakpoint(chartData.data.tempDataSets),
            font: {
              size: responsiveBarFontAndOffset(chartData.data.tempDataSets)?.xAxisFontSize,
              family: "'Open Sans', sans-serif",
              weight: '400',
            },
          },
        },
        y: {
          ...getMaxScaleValue(chartData.data.tempDataSets, chartData?.lowerBound, chartData?.upperBound),
          display: false,
          grid: {
            drawBorder: false,
          },
        },
      },
    },
  });
};
