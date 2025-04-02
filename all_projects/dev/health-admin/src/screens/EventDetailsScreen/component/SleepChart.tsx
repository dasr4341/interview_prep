import { sleepChartCanvas } from 'lib/chart/sleep-chart/sleep-chart-utility';
import React, { useLayoutEffect, useRef } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';

interface Data {
  sleepLabels: string[];
  sleepDataSets: Array<number | null>;
  isAnomaly: boolean[];
}

export default function SleepChart(
{ 
  chartData 
}: { 
  chartData: {
    data: Data;
    lowerBound?: number | null;
    upperBound?: number | null;
    sleepAverage: number | null;
  }
}) {
  const sleepChart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = sleepChart.current ? sleepChart.current.getContext('2d') : null;

    if (ctx) {
      const barChart = sleepChartCanvas(ctx, chartData);
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className='chart_area'>
      <div className='bar_chart_content'>
       <canvas ref={sleepChart} height={responsiveChartHeight()} className='mb-7 sm:mb-0'></canvas>
      </div>
    </div>
  );
}
