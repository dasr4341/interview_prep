import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectBox } from 'interface/SelectBox.interface';
import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import { ChartDataSetInterface } from '../interface/BamChart.interface';

function pointRadiusHelper(data: Array<SelectBox>, currentPoint: string) {
  return data.map((el) => {
    if (el.value === currentPoint) {
      return 9;
    }
    return 3;
  });
}

export function getStepBasedOnYMax(yMax: number) {
  if (yMax % 3 === 0) {
    return yMax / 3;
  }
  if (yMax % 4 === 0) {
    return yMax / 4;
  }
  return yMax / 2;
}


function lineChartAxisFormatter(currentValue: number, rangeMin: number, zerothLabel?:string) {
  if (currentValue === rangeMin) {
    return '';
  }
  if (zerothLabel && currentValue === 0) {
    return zerothLabel;
  }
  if (currentValue <= 0) {
    return String(currentValue).replaceAll('-', '');
  } 
  return '';
}

function barChartAxisFormatter(currentValue: number, rangeMin: number, rangeMax: number, zerothLabel?:string) {
  if (currentValue === rangeMax || currentValue === rangeMin ) { 
    return '';
  }
  if (zerothLabel && currentValue === 0) {
    return  zerothLabel;
  }
  if (currentValue < 0) {
    return currentValue * -1;
  }
  return currentValue;
}


export function getConfigChart(chart: ChartTypes,
  ctx: CanvasRenderingContext2D, labels: SelectBox[], dataSets: ChartDataSetInterface[], currentPoint: string, leftAxis :{
    max: number, min: number
  }, rightAxis: {
    max: number, min: number
  },
 chartDirection?: {
    leftAxis: 'line' | 'bar',
    rightAxis: 'line' | 'bar',
  }
) {
  Chart.register(annotationPlugin, ChartDataLabels);
  const currentPointIndex = labels.findIndex(d => d.value === currentPoint);

  return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(d => d.label),
        datasets: dataSets as any,
      },
      options: {
        layout: {
          padding: {
            right: 0,
            left:0
          },
        },
        elements: {
          point: {
            radius:  pointRadiusHelper(labels, currentPoint),
            backgroundColor: 'transparent',
          }
        },
        animation: {
          duration: 500,
        },
        responsive: true,
        scales: {
          A: {
            max:leftAxis.max,
            min: leftAxis.min,
            position: 'left',
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              stepSize: getStepBasedOnYMax(leftAxis.max),
              color: '#57576A',
              padding: window.innerWidth < 1200 ? 8 : 30,
              font: {
                size: () => {
                  if (window.innerWidth < 1200 || labels.length > 10) {
                    return 10;
                  }
                  return 15;
                },
                weight: '500',
              },
              callback: (currentValue: number) => {
                return chartDirection?.leftAxis === 'line' ?
                  lineChartAxisFormatter(currentValue, leftAxis.min, 'Use Factor')
                  : barChartAxisFormatter(currentValue, leftAxis.min, leftAxis.max, 'Use Factor');
              } 
            },
          },
          B: {
            max: rightAxis.max,
            min: rightAxis.min,
            position: 'right',
            ticks: {
              stepSize: getStepBasedOnYMax(rightAxis.min * -1),
              color: '#57576A',
              font: {
                size: () => {
                  if (window.innerWidth < 1200 || labels.length > 10) {
                    return 10;
                  }
                  return 15;
                },
                weight: '500',
              },
              callback: (currentValue: number) => {
                return chartDirection?.rightAxis === 'bar' ? barChartAxisFormatter(currentValue, rightAxis.min, rightAxis.max) :
                  lineChartAxisFormatter(currentValue, rightAxis.min);
              },
            },
          },
          x: {
            stacked: true,
            ticks: {
              color: '#8585A1',
              padding: 12,
              font: {
                size: () => {
                  if (window.innerWidth < 1200 || labels.length > 10) {
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
            }
          },
        },
        plugins: {
          tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (item: any) => {
                return item.dataset.label + ' : ' + (item.formattedValue.replaceAll('-', ''));
            }
          }
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
              tempeLineAnnotation: {
                type: 'line',
                yMin: 0,
                yMax: 0,
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
              }
            }
          },
          legend: {
            display: false,
          },
        },
    },
       // TODO: set type
    } as any);
}