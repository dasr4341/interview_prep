import { hrvChartCanvas } from 'lib/chart/hrv-chart/hrv-chart-utility';
import { useLayoutEffect, useRef } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';

interface Data {
  hrvLabels: string[];
  hrvDataSets: Array<number | null>;
  isAnomaly: Array<boolean>;
}

export default function HrvChart({ 
  chartData 
}: { 
  chartData: {
    data: Data;
    lowerBound?: number | null;
    upperBound?: number | null;
    hrvAverage: number | null;
  } 
}) {
  const hrvChart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = hrvChart.current ? hrvChart.current.getContext('2d') : null;

    if (ctx && chartData) {
      const barChart = hrvChartCanvas(ctx, chartData);
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className='chart_area'>
      <div className='bar_chart_content'>
        <canvas ref={hrvChart} height={responsiveChartHeight()} className='mb-7 sm:mb-0'></canvas>
      </div>
    </div>
  );
}
