import { tempChartCanvas } from 'lib/chart/temp-chart/temp-chart-utility';
import { useLayoutEffect, useRef } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';

interface Data {
  tempLabels: string[];
  tempDataSets: Array<number | null>;
  isAnomaly: boolean[];
}

export default function TempChart({ 
  chartData 
}: { 
  chartData: {
    data: Data;
    lowerBound?: number | null;
    upperBound?: number | null;
    chartUnit?: string;
  } 
}) {
  const tempChart = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = tempChart.current ? tempChart.current.getContext('2d') : null;

    if (ctx && chartData) {
      const barChart = tempChartCanvas(ctx, chartData);
      return function cleanup() {
        barChart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className='chart_area'>
      <div className='bar_chart_content'>
        <canvas ref={tempChart} height={responsiveChartHeight()} className='mb-7 sm:mb-0'></canvas>
      </div>
    </div>
  );
}
