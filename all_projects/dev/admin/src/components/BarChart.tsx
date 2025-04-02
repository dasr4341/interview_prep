/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { BarChartData } from 'interface/bar-chart.interface';

export default function BarChart({
  className,
  color,
  chartData
}: {
  className: string;
  color: string;
  chartData: BarChartData
}) {

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const data = {
      labels: chartData.label,
      datasets: [
        {
          barThickness: 7,
          data: chartData.data,
          backgroundColor: color,
        },
      ]
    };
    const ctx: CanvasRenderingContext2D | null =
      canvas.current ? canvas.current.getContext('2d') : null;

    if (ctx !== null) {
      const barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false,

              },
              ticks: {
                display: false
              },
            },
            x: {
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                display: false
              },

            },
          },
          plugins: {
            legend: {
              display: false,
            },
          }
        },
      });
      return function cleanup() {
        // Side-effect cleanup...
        barChart.destroy();
      };
    }
  }, [chartData]);



  return (
    <div className={className}>
      <canvas
        id="bar"
        ref={canvas}
      />
    </div>

  );
}
