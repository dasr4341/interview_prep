import { getHeartStepsData } from 'Helper/heart-steps-helper';
import { ChartPropsData, ReportTypes, TickValueInterface } from 'interface/chart.interfaces';
import { stepChartCanvas } from 'lib/chart/steps-chart/step-chart-utility';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './_chart.scoped.scss';
import { responsiveChartHeight } from 'Helper/chart-helper';


export default function StepsChart({ 
  chartPropsData,
}: { 
  chartPropsData: ChartPropsData;
}) {
  const stepsChart = useRef<HTMLCanvasElement>(null);
  const [tickValue, setTickValue] = useState<TickValueInterface>();

  const { anomalyData, chartData, reportType, version } = chartPropsData ?? {};

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
    const ctx: CanvasRenderingContext2D | null = stepsChart.current ? stepsChart.current.getContext('2d') : null;

    if (ctx && chartPropsData && tickValue) {
      const lineChart = stepChartCanvas({
        ctx: ctx, 
        chartData: getHeartStepsData(chartData), 
        anomalyData: anomalyData,
        tickValue: tickValue, 
        reportType: reportType,
        version: version
      });
      return function cleanup() {
        lineChart.destroy();
      };
    } 
  }, [chartPropsData, tickValue]);

  return (
    <div className='chart_area'>
      <div className='chart_content'>
        <canvas ref={stepsChart} height={responsiveChartHeight()} className='mb-7'></canvas>
      </div>
    </div>
  );
}
