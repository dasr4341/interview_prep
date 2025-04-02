import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  ChartDataInterface,
  ChartLabelDataInterface,
  SurveyDetailsChartInterface,
} from '../interface/GadPhqChart.Interface';
import { ChartTypes } from '../../enum/ChartTypes.enum';

export function getStepBasedOnYMax(axis: 'A' | 'B', chart: ChartTypes) {
  if (axis === 'A') {
    switch (chart) {
      case ChartTypes['GAD-7']: {
        return  7 ;
      }
      case ChartTypes['PHQ-15']: {
        return  5;
      }
      case ChartTypes['PHQ-9']: {
        return  9;
      }
      case ChartTypes.URICA: {
        return  9;
      }
    }
  }
  switch (chart) {
    case ChartTypes['GAD-7']: {
      return  7 ;
    }
    case ChartTypes['PHQ-15']: {
      return  10;
    }
    case ChartTypes['PHQ-9']: {
      return  9;
    }
    case ChartTypes.URICA: {
      return  5;
    }
  }
}
function pointRadiusHelper(
  data: Array<ChartLabelDataInterface | null>,
  currentPoint: string
) {
  return data.map((el) => {
    if (el?.value === currentPoint) {
      return 9;
    }
    return 3;
  });
}

export const GadPhqChartUtility = (
  chart: ChartTypes,
  chartUtility: SurveyDetailsChartInterface,
  chartDataSets: ChartDataInterface[],
  currentPoint: string,
  labels: ChartLabelDataInterface[],
  leftAxis: {
    steps?:number | null,
    max: number,
    min: number
  },
  rightAxis: {
    steps?:number | null,
    max: number,
    min: number
  },
  grid:  {
    vertical?: boolean;
    horizontal?: {
      left: boolean,
      right: boolean
    }
  },
  yAxisLabel?: {
    leftAxis?: string,
    rightAxis?: string
  },
) => {
  Chart.register(ChartDataLabels);
  
  const currentPointIndex = labels.findIndex(d => d.value === currentPoint);

  if (chartUtility.ctx && chartDataSets) {
    return new Chart(chartUtility.ctx, {
      type: 'bar',
      data: {
        labels: labels.map((d) => d.label),
        datasets: chartDataSets as any,
      },
      options: {
        layout: {
          padding: {
            right: 0,
          },
        },
        elements: {
          point: {
            radius: pointRadiusHelper(labels, currentPoint),
          },
        },
        animation: {
          duration: 500,
        },
        responsive: true,
        plugins: {
          annotation: {
            clip: false,
            common: {
              drawTime: 'afterDatasetsDraw',
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#8585A1',
              padding: 12,
              font: {
              size: () => {
                if (window.innerWidth < 640 || labels.length > 10) {
                  return 10;
                }
                return 15;
              },
                weight: (data: { index: any; }) => {
                  if (Number(data.index) === currentPointIndex) {
                    return '900';
                  }
                  return '400';
                },
              },
            },
            grid: {
              display: grid?.vertical,
              tickLength: 0,
            },
          },
          A: {
            max: leftAxis.max,
            min: leftAxis.min,
            position: 'left',
            stacked: true,
            ticks: {
              stepSize: leftAxis?.steps || getStepBasedOnYMax('A', chart),
              callback: function (value: number) {
                if (value === leftAxis.max) {
                  return yAxisLabel?.leftAxis || 'Score';
                }
                return value;
              },
              color: '#57576A',
              padding: window.innerWidth < 640 ? 8 : 30,
              font: {
                size: () => {
                  if (window.innerWidth < 640 || labels.length > 10) {
                    return 10;
                  }
                  return 15;
                },
                weight: '500',
              },
            },
            grid: {
              display: grid?.horizontal?.left,
              tickLength: 0,
            },
          },
          B: {
            max: rightAxis.max,
            min: rightAxis.min,
            type: 'linear',
            position: 'right',
            stacked: true,
            grid: {
              display:  grid?.horizontal?.right,
            },
            ticks: {
              font: {
                size: () => {
                  if (window.innerWidth < 640 || labels.length > 10) {
                    return 10;
                  }
                  return 15;
                },
                weight: '500',
              },
              stepSize: rightAxis?.steps || getStepBasedOnYMax('B', chart),
              callback: function (value: number) {
                if (value === rightAxis.max) {
                  return yAxisLabel?.rightAxis || 'Questions';
                }
                return value;
              },
            },
          },
        },
      },
    } as any);
  }
};
