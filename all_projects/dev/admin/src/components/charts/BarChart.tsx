import { useLayoutEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function BarChart({
  className,
  labels,
  customData,
  backgroundColor,
  cutout,
  value,
  canvasStyle,
  valueClass,
}: {
  className?: string;
  customData: Array<number>;
  backgroundColor?: Array<string>;
  cutout?: string;
  value?: string;
  canvasStyle?: any;
  valueClass?: string;
  labels: Array<string>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const isAllZero = customData?.length && customData?.reduce((a, b) => a + b) > 0 ? false : true;

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Minute',
          data: customData,
          barThickness: 8,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
          cutout: cutout,
          tooltips: {
            enable: isAllZero ? false : true,
            zIndex: 100,
          },
        },
      ],
    };
    const ctx: CanvasRenderingContext2D | null = canvas.current ? canvas.current.getContext('2d') : null;

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
              },
              display: false,
            },
            x: {
              grid: {
                display: false,
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [backgroundColor, customData, cutout, labels]);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row
		 justify-evenly items-center`}>
      <div className="relative" style={canvasStyle}>
        <canvas id="bar" ref={canvas} className="max-w-full" style={{ height: 150, width: 676 }} />
        <div
          className={`${valueClass ? valueClass : 'text-gray-150 text-lg font-extrabold'} 
          absolute top-1/2 left-1/2 text-center`}
          style={{ transform: 'translate(-50%, -50%)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
