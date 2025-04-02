import { spo2ChartCanvas } from 'lib/chart/spo2-chart/spo2-chart-utility';
import { useLayoutEffect, useRef } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';
import { Spo2ChartDataProps } from 'interface/chart.interfaces';

export default function Spo2Chart({ chartData }: {chartData: Spo2ChartDataProps}) {
  const spo2Chart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = spo2Chart.current ? spo2Chart.current.getContext('2d') : null;

    if (ctx && chartData) {
      const barChart = spo2ChartCanvas({ ctx: ctx, chartData: chartData });
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className='chart_area'>
      <div className='bar_chart_content'>
        <canvas ref={spo2Chart} height={responsiveChartHeight()} className='mb-7 sm:mb-0'></canvas>
      </div>
    </div>
  );
}
