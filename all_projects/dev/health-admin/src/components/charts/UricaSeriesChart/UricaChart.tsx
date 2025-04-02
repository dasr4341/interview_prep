
import React, { useContext, useLayoutEffect, useRef } from 'react';
import { UricaChartUtility } from './UricaChartUtility';
import { ChartUtilityInterface } from './SubmittedChart.Interface';
import { SurveyDetailsContext } from 'screens/surveys/Patient/SurveyFormSubmitted';

export default function UricaChart() {
  const formSubmittedChart = useRef<HTMLCanvasElement>(null);
  const surveyDetails = useContext(SurveyDetailsContext);


  useLayoutEffect(() => {
    // 1 col empty added for better UI as per scope
    const emptyLabel = Array(1).fill('');
    const emptyData = Array(1).fill(null);
  
    surveyDetails.chart.date.unshift(...emptyLabel);
    surveyDetails.chart.date.push(...emptyLabel);
    surveyDetails.chart.radinessScore.unshift(...emptyData);
    surveyDetails.chart.radinessScore.push(...emptyData);

    const chartInstance: ChartUtilityInterface = {
      ctx: formSubmittedChart.current?.getContext('2d') || null,
      chartData: surveyDetails.chart
    };

    if (chartInstance) {
      const lineChart = UricaChartUtility(chartInstance);
      return () => {
        lineChart?.destroy();
      };
    }
  }, [surveyDetails.chart]);

  return (
    <div className='mt-5 pr-7'>
      <canvas ref={formSubmittedChart}  className='mb-7 w-full'></canvas>
    </div>
  );
}


