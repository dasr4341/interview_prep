import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { heartRateChartCanvas } from 'lib/chart/heart-chart/heart-chart-utility';
import { getHeartStepsData, getScatterHeartStepsAnomalyData, getScatterHeartStepsData } from 'Helper/heart-steps-helper';
import { ChartPropsData, ReportTypes, SourceSystmHealthData, TickValueInterface } from 'interface/chart.interfaces';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';
import { appleHeartRateChartCanvas } from 'lib/chart/heart-chart/apple-heart-chart-utility';


export default function HeartChart({ 
  chartPropsData,
}: { 
  chartPropsData: ChartPropsData;
}) {
  const heartRateChart = useRef<HTMLCanvasElement>(null);
  const [tickValue, setTickValue] = useState<TickValueInterface>();
  
  const { sourceSystem, chartData, anomalyData, reportType, lowerBound, upperBound, version, heartAverage } = chartPropsData ?? {};

  useEffect(() => {
    if (reportType === ReportTypes.DailyReport) {
      setTickValue({ take: 24, skip: 60 });
    } else if (reportType === ReportTypes.SpecialReport) {
      setTickValue({ take: 24, skip: Math.round(chartData.length / 24) });
    } else if (reportType === ReportTypes.WeeklyReport || reportType === ReportTypes.MonthlyReport) {
      setTickValue({ take: Math.round(chartData.length / 96), skip: 96 });
    }
  }, [reportType, chartData]);

  useLayoutEffect(() => {
    const ctx: CanvasRenderingContext2D | null = heartRateChart.current ? heartRateChart.current.getContext('2d') : null;

    if ((sourceSystem === SourceSystmHealthData.FITBIT ||  !sourceSystem) && ctx && chartPropsData && tickValue) {

      const lineChart = heartRateChartCanvas({
        ctx: ctx,
        chartData: getHeartStepsData(chartData), 
        anomalyData: anomalyData, 
        tickValue: tickValue, 
        reportType: reportType,
        lowerBound: lowerBound,
        upperBound: upperBound,
        version: version,
        heartAverage: heartAverage
      });

      return function cleanup() {
        lineChart.destroy();
      };
    } else if (sourceSystem === SourceSystmHealthData.APPLEWATCH && ctx && chartPropsData && tickValue) {
      const scatterChart = appleHeartRateChartCanvas({
        ctx: ctx, 
        chartData: getScatterHeartStepsData(chartData), 
        anomalyData: getScatterHeartStepsAnomalyData(chartData, anomalyData),
        reportType: reportType,
        lowerBound: lowerBound,
        upperBound: upperBound,
        heartAverage: heartAverage
      });
      return function cleanup() {
        scatterChart.destroy();
      };
    }
  }, [chartPropsData, tickValue]);

  return (
    <div className='chart_area'>
      <div className='chart_content'>
        <span className='text-xs text-gray-850 font-semibold tracking-widest'>BPM</span>
        <canvas ref={heartRateChart} height={responsiveChartHeight()} className='mb-7'></canvas>
      </div>
    </div>
  );
}
