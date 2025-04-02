import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import { useEffect, useState } from 'react';
import { ChartData, ChartDataInterface, ChartLabelDataInterface } from '../../../../components/charts/GadPhqSeriesChart/interface/GadPhqChart.Interface';
import { useLazyQuery } from '@apollo/client';
import { GetMultipleCampaignSurveyList, GetMultipleCampaignSurveyListVariables } from 'health-generatedTypes';
import { getMultipleCampaignSurveyListQuery } from 'graphql/getMultipleCampaignSurveyList.query';
import { differenceInMilliseconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { config } from 'config';
import catchError from 'lib/catch-error';
import useChartMaxMin from 'components/charts/BamSeriesChart/customHooks/useChartMaxMin';
import { monthDateYearFormatter } from 'Helper/chart-helper';
import { cloneDeep } from 'lodash';

function getYAxisMax(chart: ChartTypes, type: 'line' | 'bar', initValue: number | null | undefined) {
  if (type === 'bar') {
    switch (chart) {
      case ChartTypes['GAD-7']: {
        return  (initValue || 7) + 0.7;
      }
      case ChartTypes['PHQ-15']: {
        return  (initValue || 15) + 1;
      }
      case ChartTypes['PHQ-9']: {
        return  (initValue || 10) + 1;
      }
    }
  }
  switch (chart) {
    case ChartTypes['GAD-7']: {
     return (initValue || 21) + 3;
    }
    case ChartTypes['PHQ-15']: {
     return (initValue || 30) + 3;
    }
    case ChartTypes['PHQ-9']: {
     return (initValue || 27) + 3;
    }
  }
  return 12;
}

export function transformChartDataSets(
  score: { label: string; data: number[] },
  a1: { label: string; data: number[] },
  a2: { label: string; data: number[] },
  a3: { label: string; data: number[] },
  a4: { label: string; data: number[] }
) {
  return [
    {
      ...score,
      borderColor: '#000000',
      type: 'line',
      borderDash: [6, 3],
      borderDashOffset: 0,
      yAxisID: 'A',
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 5,
        padding: {
          top: window.innerWidth < 640 ? 1 : 2,
          right: window.innerWidth < 640 ? 2 : 4,
          bottom: 1,
          left: window.innerWidth < 640 ? 2 : 4
        },
        font: {
          weight: 'bold',
          size: window.innerWidth < 1200 ? 8 : 12,
        },
      },
    },
    {
      ...a1,
      backgroundColor: '#5789F7',
      maxBarThickness: 60,
      yAxisID: 'B',
      datalabels: {
        display: false,
      },
    },
    {
      ...a2,
      backgroundColor: '#7D9AD8',
      maxBarThickness: 60,
      yAxisID: 'B',
      datalabels: {
        display: false,
      },
    },
    {
      ...a3,
      backgroundColor: '#A3A8B9',
      maxBarThickness: 60,
      yAxisID: 'B',
      datalabels: {
        display: false,
      },
    },
    {
      ...a4,
      backgroundColor: '#CCB79D',
      maxBarThickness: 60,
      yAxisID: 'B',
      datalabels: {
        display: false,
      },
    },
  ].filter((e) => e.label.length > 0);
}

export default function useGadPhqSurvey({ chart, timeZone, campaignSurveyId } : { chart : ChartTypes, timeZone: string, campaignSurveyId: string }) {

  const maxMin = useChartMaxMin({ campaignSurveyId });
  const [labels, setLabels] = useState<ChartLabelDataInterface[]>([]);

  const [chartDataSets, setChartDataSets] = useState<{
    data: ChartDataInterface[];
      leftAxis: {
        max: number,
        min: number
      },
      rightAxis: {
        max: number,
        min: number
      }
  }>({
    data: [],
    leftAxis:{
      max: 0,
      min: 0,
    },
    rightAxis: {
        max: 0,
        min: 0,
      }
  });


  const [getMultipleCampaignSurveyListCallback, { loading }] = useLazyQuery<
    GetMultipleCampaignSurveyList,
    GetMultipleCampaignSurveyListVariables
  >(getMultipleCampaignSurveyListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetMultipleCampaignSurveyList) {
        const a1: ChartData = { data: [], label: '' };
        const a2: ChartData = { data: [], label: '' };
        const a3: ChartData = { data: [], label: '' };
        const a4: ChartData = { data: [], label: '' };
        const score: ChartData = { data: [], label: 'Score' };
        const labelData: ChartLabelDataInterface[] = [];
        const labelDuplicateHelper: { [key: string]: string; } = {};
     
        Object.values(d.pretaaHealthGetPhqGad7StatsDescription.description).forEach((desc: any) => {
          const { label, key } = desc as { key: string, label: string };
          if (key === 'a1') {
            a1.label = label;
          }
          if (key === 'a2') {
            a2.label = label;
          }
          if (key === 'a3') {
            a3.label = label;
          }
          if (key === 'a4') {
            a4.label = label;
          }
        });

        const res = cloneDeep(d.pretaaHealthGetMultipleCampaignSurveyList);

        res.sort((a, b) => {
          if (a.date && b.date) {
            const date1 = new Date(a.date);
            const date2 = new Date(b.date);
            return differenceInMilliseconds(date1, date2);
          }
          return 1;
        }).forEach((list) => {
          if (!!list.data?.length) {
            const chartData = list.data[0];
            if (!labelDuplicateHelper[chartData?.id]) {
              a1.data.push(Number(chartData?.a1));
              a2.data.push(Number(chartData?.a2));
              a3.data.push(Number(chartData?.a3));
              a4.data.push(Number(chartData?.a4));
              score.data.push(chartData?.score);

              labelDuplicateHelper[chartData?.id] = chartData?.id;
              labelData.push({
                label : formatInTimeZone(new Date(monthDateYearFormatter(list?.date)), timeZone, config.monthDateFormat),
                value: chartData?.id
              });
            }
          }
        });
        
        const transformedData = transformChartDataSets(score, a1, a2, a3, a4);
        setLabels(labelData);
        setChartDataSets(() => {
          return {
            data: transformedData,
            leftAxis: {
              max: getYAxisMax(chart, 'line', maxMin.chartTopRightScale?.max ),
              min: 0,
            },
            rightAxis: {
              max: getYAxisMax(chart, 'bar', maxMin.chartTopLeftScale?.max),
              min: Number( maxMin.chartTopLeftScale?.min )
              }
          };
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    getMultipleCampaignSurveyListCallback({
      variables: {
        campaignSurveyId,
      },
    });
    // 
  }, [campaignSurveyId]);

  
  return (
    {
      chartDataSets,
      labels,
      loading
   }
  );
}
