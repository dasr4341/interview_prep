import { useLazyQuery } from '@apollo/client';
import { GetMaxMinRangeOfStdTemplateQuery } from 'graphql/getMaxMinRangeOfStdTemplate.query';
import {
  GetMaxMinRangeOfStdTemplate,
  GetMaxMinRangeOfStdTemplateVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useEffect } from 'react';

export default function useChartMaxMin({
  campaignSurveyId,
}: {
  campaignSurveyId: string;
}) {
  const [getMaxMinCallBack, { data }] = useLazyQuery<
    GetMaxMinRangeOfStdTemplate,
    GetMaxMinRangeOfStdTemplateVariables
  >(GetMaxMinRangeOfStdTemplateQuery, {
    onError: (e) => catchError(e, true),
  });

  const chartAxisData = data?.pretaaHealthGetMaxMinRangeOfStdTemplate;
  
  useEffect(() => {
    getMaxMinCallBack({
      variables: {
        surveyAssignId: campaignSurveyId,
      },
    });
    // 
  }, [campaignSurveyId]);

  return {
    code: chartAxisData?.code,
    chartTopLeftScale:chartAxisData?.chartTopLeftScale,
    chartTopRightScale: chartAxisData?.chartTopRightScale,
    chartBotomLeftScale: chartAxisData?.chartBotomLeftScale,
    chartBotomRightScale: chartAxisData?.chartBotomRightScale
  };
}
