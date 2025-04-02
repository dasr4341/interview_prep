import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartUtilityInterface } from './SubmittedChart.Interface';
import { SelectBox } from 'interface/SelectBox.interface';
import { cloneDeep } from 'lodash';

function pointRadiusHelper(data: SelectBox[], currentPoint: string) {
  return data.map((el) => {
    if (el.value === currentPoint) {
      return 9;
    }
    return 3;
  });
}


export const UricaChartUtility = (chartUtility: ChartUtilityInterface) => {
  Chart.register(annotationPlugin, ChartDataLabels);

  const selectedIndexValue = chartUtility.chartData.date.findIndex((el) => (el.value === chartUtility.chartData.currentPoint));

  if (chartUtility.ctx) {
    return new Chart(chartUtility.ctx, {
      type: 'line',
      data: {
        labels: chartUtility.chartData.date.map( d => d.label),
        datasets: [
          {
            data: cloneDeep(chartUtility.chartData.radinessScore).reverse(),
            borderColor: ['#000'],
            borderWidth: 2,
            tension: 0,
            pointStyle: 'circle',
            pointRadius: pointRadiusHelper(chartUtility.chartData.date, chartUtility.chartData.currentPoint),
            pointHoverRadius: 10,
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'top',
              color: '#ffffff',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 5,
              padding: {
                top: 2,
                right: 4,
                bottom: 1,
                left: 4
              },
              font: {
                weight: 'bold',
                size: 10,
              },
              formatter: function (value) {
                if (value % 1 === 0) {
                  return value / 1;
                }
                return value;
              }
            }
          },
        ],
      },
      options: {
        layout: {
          padding: {
            right: 0,
            top: 30
          },
        },
        animation: {
          duration: 500,
        },
        responsive: true,
        plugins: {
          datalabels: {
            display: false,
          },
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
            ticks: {
              color: '#8585A1',
              padding: 12,
              font: {
                size: 10,
                weight: (d) => {
                  if (d.tick.value === selectedIndexValue) {
                    return 'bold'
                  }
                  return 'normal';
                }
              }
            }
          },
          y: {
            ticks: {
              color: '#57576A',
              padding: window.innerWidth < 1200 ? 8 : 30,
              font: {
                size: 11,
                weight: '500',
              }
            },
          },
        },
      },
    });
  }
};
