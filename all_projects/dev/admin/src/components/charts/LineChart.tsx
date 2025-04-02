import { useRef, useLayoutEffect } from 'react';
import Chart, { ChartData, ScatterDataPoint } from 'chart.js/auto';

export default function LineChart({
  className,
  data,
}: {
  className?: string;
  data: ChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = canvas.current ? canvas.current.getContext('2d') : null;

    if (ctx !== null) {
      const lineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            filler: {
              propagate: false,
            },
            legend: {
              display: false, // remove label
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: false, // remove axis label
              grid: {
                drawBorder: false,
                color: 'white', // remove axis border
              },
            },
            y: {
              display: false,
              grid: {
                drawBorder: false,
                color: 'white',
              },
            },
          },
          elements: {
            // remove intersection point
            point: {
              radius: 0,
            },
          },
        },
      });
      return function cleanup() {
        // Side-effect cleanup...
        lineChart.destroy();
      };
    }
  }, [data]);

  return (
    <div
      className={`${className} flex flex-col lg:flex-row
		 justify-evenly items-center gap-8`}>
      <div className="relative w-full">
        <canvas id="doughnut" ref={canvas} />
      </div>
    </div>
  );
}
