import { useLayoutEffect, useRef } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';
import { totalStepsChartCanvas } from 'lib/chart/total-steps/total-steps-chart-utility';
import { TotalStepsChartProps } from 'interface/chart.interfaces';

export default function TotalStepsChart({ chartData }: { chartData: TotalStepsChartProps }) {
  const totalStepsChart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = totalStepsChart.current ? totalStepsChart.current.getContext('2d') : null;

    if (ctx && chartData) {
      const barChart = totalStepsChartCanvas({
        ctx: ctx, 
        chartData: chartData
      });
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className='chart_area'>
      <div className='bar_chart_content'>
        <canvas ref={totalStepsChart} height={responsiveChartHeight()} className='mb-7 sm:mb-0'></canvas>
      </div>
    </div>
  );
}
