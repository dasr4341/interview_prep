import React, { useLayoutEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function DoughnutChart({
  className,
  labels,
  customData,
  backgroundColor,
  cutout,
  value,
  canvasStyle,
  valueClass,
  viewCompany,
  openModal,
}: {
  className?: string;
  customData: Array<number>;
  backgroundColor: Array<string>;
  cutout: string;
  value: string;
  canvasStyle?: any;
  valueClass?: string;
  labels?: Array<string>;
  viewCompany?: string;
  openModal?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const isAllZero = customData.length && customData.reduce((a, b) => a + b) > 0 ? false : true;

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'My First Dataset',
          data: isAllZero ? customData.map((b, i) => (i > 0 ? 0 : 1)) : customData,
          backgroundColor: isAllZero ? '#D2DEE2' : backgroundColor,
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
      const doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return function cleanup() {
        doughnutChart.destroy();
      };
    }
  }, [backgroundColor, customData, cutout, labels]);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row
		 justify-evenly items-center`}>
      <div className="relative" style={canvasStyle}>
        <canvas id="doughnut" ref={canvas} className="max-w-full" />
        <div
          className={`${valueClass ? valueClass : 'text-gray-150 text-lg font-extrabold'} 
          absolute top-1/2 left-1/2 text-center`}
          style={{ transform: 'translate(-50%, -50%)' }}>
          {value}
          
          <span onClick={() => openModal && openModal()} className="cursor-pointer block text-xs text-primary-light font-normal">{viewCompany}</span>
        </div>
      </div>
    </div>
  );
}
