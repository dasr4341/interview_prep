import { useLazyQuery } from '@apollo/client';
import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import { differenceInMilliseconds } from 'date-fns';
import { getMultipleCampaignSurveyListQuery } from 'graphql/getMultipleCampaignSurveyList.query';
import { GetMultipleCampaignSurveyList, GetMultipleCampaignSurveyListVariables } from 'health-generatedTypes';
import { SelectBox } from 'interface/SelectBox.interface';
import { useEffect, useState } from 'react';
import { ChartPayloadDataInterface } from '../../../../components/charts/BamSeriesChart/interface/BamChart.interface';
import { formatInTimeZone } from 'date-fns-tz';
import { config } from 'config';
import catchError from 'lib/catch-error';
import useChartMaxMin from '../../../../components/charts/BamSeriesChart/customHooks/useChartMaxMin';
import { cloneDeep } from 'lodash';

function getDataSets(
  protectiveFactors: number[],
  riskFactors: number[],
  usageFactors: number[],
) {
  return [
    {
      label: 'Protective Factors',
      data: protectiveFactors,
      borderColor: '#5789F7',
      backgroundColor: '#5789F7',
      order: 2,
      maxBarThickness: 60,
      yAxisID: 'B',
    },
    {
      label: 'Risk Factors',
      data: riskFactors,
      borderColor: '#F7C682',
      backgroundColor: '#F7C682',
      order: 2,
      maxBarThickness: 60,
      yAxisID: 'B',
    },
    {
      label: 'Usage',
      data: usageFactors,
      borderColor: '#000000',
      type: 'line',
      borderDash: [5, 5],
      order: 1,
      borderWidth: 2,
      yAxisID: 'A',
    },
  ];
}

function getYAxisMax(chart: ChartTypes, type: 'line' | 'bar', initValue: number | null | undefined) {
  if (type === 'line') {
    if (ChartTypes['BAM-IOP'] === chart ) {
      return (initValue || 12) + 4;
    }
    return (initValue || 90) + 30;
  }
  if (ChartTypes['BAM-IOP'] === chart ) {
    return (initValue || 24) + 8;
  }
  return (initValue || 180) + 90;
}

export default function useBamSurvey({ chart, campaignSurveyId, timeZone }: { chart:ChartTypes, campaignSurveyId: string, timeZone:string }) {

  const {
    chartTopLeftScale,
    chartBotomLeftScale,
    chartBotomRightScale } = useChartMaxMin({ campaignSurveyId });
  
  
  
  const [dataSets, setDataSets] = useState<ChartPayloadDataInterface>({
    data: [],
    labels: [],
    leftAxis: {
      max:  0,
      min: 0
    },
    rightAxis: {
      max: 0, 
      min: 0
    }
  });

  const [stackedBarLineChartData, { loading }] =
  useLazyQuery<
    GetMultipleCampaignSurveyList,
    GetMultipleCampaignSurveyListVariables
  >(getMultipleCampaignSurveyListQuery, {
    onCompleted: (d) => {
      const protectiveFactors: number[] = [];
      const riskFactors: number[] = [];
      const usageFactors: any[] = [];
      const dataLabels: SelectBox[] = [];
      
      const labelDuplicateHelper: { [key: string]: string; } = {};

      const res = cloneDeep(d.pretaaHealthGetMultipleCampaignSurveyList)

      res
        .sort((a, b) => {
          const date1 = new Date(a.date || '');
          const date2 = new Date(b.date || '');
          return differenceInMilliseconds(date1, date2);
        })
        .forEach((data) => {
          if (
            data.surveyAssignmentId &&
            !labelDuplicateHelper[data.surveyAssignmentId]
          ) {
            labelDuplicateHelper[String(data.surveyAssignmentId)] = data.surveyAssignmentId;
            dataLabels.push(
              {
                label: String(formatInTimeZone(new Date(data.date || ''), timeZone, config.monthDateFormat)),
                value: data.surveyAssignmentId
              }
            );
            protectiveFactors.push(Number(data.protectiveFactors));
            riskFactors.push(-Number(data.riskFactors));
            usageFactors.push(data.usageFactors ? -data.usageFactors : null);
          }
        });
      
      
      
      const dataD = getDataSets(protectiveFactors, riskFactors, usageFactors);
      setDataSets(() => {
        return {
          data: dataD,
          labels: dataLabels,
          leftAxis: {
            max: getYAxisMax(chart, 'line', chartBotomRightScale?.max ),
            min: getYAxisMax(chart, 'line', chartBotomRightScale?.max) * -1
          },
          rightAxis: {
            max: getYAxisMax(chart, 'bar', chartTopLeftScale?.max),
            min: getYAxisMax(chart, 'bar', chartBotomLeftScale?.max) * -1
          }
        };
        } );
    },
    onError: (err) => catchError(err, true),
  });



  useEffect(() => {
    stackedBarLineChartData({
      variables: {
        campaignSurveyId: campaignSurveyId,
      },
    });
    // 
  }, [campaignSurveyId]);

  return (
    {
      loading,
      dataSets,
    }
  );
}
