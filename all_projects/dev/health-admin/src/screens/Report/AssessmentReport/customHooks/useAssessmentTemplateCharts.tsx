import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { getAssessmentTemplateChartsQuery } from 'graphql/getAssessmentTemplateCharts.query';
import {
  AssessmentPatientsDischargeFilterTypes,
  GetAssessmentTemplateCharts,
  GetAssessmentTemplateChartsVariables,
  GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import { SelectBox } from 'interface/SelectBox.interface';
import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import { transformChartYMax } from 'screens/Report/components/ReportChart/ReportBarChart';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';
import { useParams } from 'react-router-dom';
import { TemplateCodes } from '../AssementReportForTemplate/assement-report-interface';

interface AssessmentChartData {
  data: (number | null)[];
  label: string;
}
interface AssessmentChartDataInterface extends AssessmentChartData {
  borderColor?: string;
  type?: string;
  borderDash?: number[];
  borderDashOffset?: number;
  backgroundColor?: string;
  yAxisID: string,
  datalabels?: {
    [key: string]: string | number | boolean | undefined  | {
      [key: string] : string | number
    }
  }
  // BAR
  order?: number;
  borderWidth?: number;
  maxBarThickness?: number;
}

interface AssessmentChartDataSetInterface {
  data: AssessmentChartDataInterface[];
  leftAxis: {
    max: number,
    min: number,
    steps?: number | null
  },
  rightAxis: {
    max: number,
    min: number,
    steps?: number | null
  }
}

const backgroundColor: string[] = ['#7f8576', '#F7C682', '#A3A8B9', '#7D9AD8', '#5789F7', '#CCB79D' ];
const bamBackgroundColor: { [key:string]: string } = {
  'protectiveFactors': '#5789F7',
  'riskFactors': '#F7C682'
};

// eslint-disable-next-line
function getBamChartYAxis(chart: ChartTypes, type: 'line' | 'bar', initValue: number | null | undefined) {
  if (type === 'line') {
    if (ChartTypes['BAM-IOP'].toUpperCase() === chart ) {
      return (initValue || 12) + 4;
    }
    return (90) + 30;
  }
  if (ChartTypes['BAM-IOP'].toUpperCase() === chart ) {
    return (initValue || 24) + 8;
  }
  return (180) + 30;
}

function getYAxis(chart: ChartTypes, type: 'line' | 'bar', rangeType: 'max' | 'min', initValue: number | null | undefined) {
  if (chart === ChartTypes['BAM-IOP'] || chart === ChartTypes['BAM-R']) { 
    return getBamChartYAxis(chart, type, initValue);
  }
  // FOR MIN range
  if (rangeType === 'min') {
    if (ChartTypes.URICA === chart) {
      return -2;
    } else {
      return 0;
    }
  }
  
  // BAR chart
  if (type === 'bar') {
    switch (chart) {
      case ChartTypes['GAD-7']: {
        return  (initValue ?? 7) + 2;
      }
      case ChartTypes['PHQ-15']: {
        return  (initValue ?? 15) + 5;
      }
      case ChartTypes['PHQ-9']: {
        return  (initValue ?? 10) + 2;
      }
    }
  }
  // LINE chart
    switch (chart) {
      case ChartTypes['GAD-7']: {
       return (initValue ?? 21) + 3;
      }
      case ChartTypes['PHQ-15']: {
       return (initValue ?? 30) + 10;
      }
      case ChartTypes['PHQ-9']: {
       return (initValue ?? 27) + 9;
      }
      case ChartTypes.URICA: {
          // For URICA
          // max -> 14
          // min -> -2
        return  (14) + 7;
      }
      default: {
        return 12;
      }
    }
}

function getGadPhqDataSet(chartData: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts) {
  const { data: gadPhqData, legends } = chartData;
  let barChartMax = 0;
  let lineChartMax = 0;
  const transformLegends: { [key: string]: string } = {};
  legends.forEach(d => {
    transformLegends[d.key?.trim()] = d.value;
  });
  const chartDataSet: AssessmentChartDataInterface[] = [];
  const chartLabels: SelectBox[] = [];

  gadPhqData?.forEach((data) => {
    chartLabels.push({
      label: String(data.label),
      value: String(data.label)
    });
    let sumOfValue = 0;
    let scoreSum = 0;
    const values: number[] = Object.values(data.assignment);
    
    Object.keys(data.assignment).forEach((assignment, index) => {
      if (!chartDataSet[index]) {
        
        let parameters: any = {
          backgroundColor: backgroundColor[index],
          maxBarThickness: 60,
          yAxisID: 'B',
          datalabels: {
            display: false,
          },
          
        };

        if (assignment === 'score') {
          parameters = {
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
                top: 2,
                right: 4,
                bottom: 1,
                left: 4
              },
              font: {
                weight: 'bold',
                size: 12,
              }
            },
          };
        } 

        chartDataSet[index] = {
          data: [],
          label: transformLegends[assignment] ||  assignment,
          ...parameters
        };
      }
      if (assignment !== 'score') {
        sumOfValue += Number(values[index]);
      } else {
        scoreSum += Number(values[index]);
      }
      chartDataSet[index].data.push(values[index]);

    });

    if (barChartMax < sumOfValue) {
      barChartMax = sumOfValue;
    }

    if (lineChartMax < scoreSum) {
      lineChartMax = scoreSum;
    }

    scoreSum = 0;
    sumOfValue = 0;
  });

  return { data: chartDataSet, labels: chartLabels, barChartMax, lineChartMax };
}

function getBamDataSet(chartData: GetAssessmentTemplateCharts_pretaaHealthGetAssessmentTemplateCharts) {
  const chartDataSet: AssessmentChartDataInterface[] = [];
  const chartLabels: SelectBox[] = [];

  const { data: bamChartData, legends } = chartData;

  bamChartData?.forEach((res) => {
    chartLabels.push({
      label: String(res.label),
      value: String(res.label)
    });
    const values: number[] = Object.values(res.assignment);
    Object.keys(res.assignment).forEach((assignment, index) => {
      const barParameters = {
        yAxisID: 'B',
        maxBarThickness: 60,
        order: 2,
        backgroundColor: bamBackgroundColor[assignment],
        borderColor: bamBackgroundColor[assignment],
      };

      const lineParameters = {
        borderColor: '#000000',
        type: 'line',
        borderDash: [5, 5],
        order: 1,
        borderWidth: 2,
        yAxisID: 'A',
      };

      if (!chartDataSet[index] && assignment === 'useFactors') {
        chartDataSet[index] = {
          ...lineParameters,
          data: [],
          label: assignment
        };
      } else if (!chartDataSet[index]) {
        chartDataSet[index] = {
          ...barParameters,
          data: [],
          label: assignment
        };
      }

      if (assignment === 'riskFactors' || assignment === 'useFactors') {
        chartDataSet[index].data.push(-values[index]);
      }  else {
        chartDataSet[index].data.push(values[index]);
      }
    });
  });

  const sortedArray: AssessmentChartDataInterface[] = [];

  const sortedArrayHelper: {
    [key: string]: any
  } = {};

  chartDataSet.forEach((d) => {
    sortedArrayHelper[d.label] = d;
  });

  legends.forEach(data => {
    sortedArray.push({
      ...sortedArrayHelper[data.key.trim()],
      label: data.value
      });
  });
  
  return { data: sortedArray, labels: chartLabels };
}

function getStepBasedOnYMax(yMax: number, code?: ChartTypes) {
  if (code && code?.toLowerCase() === ChartTypes.URICA) {
    return 7;
  }
  if (yMax % 3 === 0) {
    return yMax / 3;
  }
  if (yMax % 4 === 0) {
    return yMax / 4;
  }
  return yMax / 2;
}

export default function useAssessmentTemplateCharts() {
  const { templateCode: code } = useParams<{ templateCode: TemplateCodes }>();

  const assessment = useAppSelector(
    (state) => state.app.assessmentFilter
  );

  const assessmentFilter = useMemo(() => assessment, [assessment]);
    
  const [chartData, setChartData] = useState<AssessmentChartDataSetInterface>({
    data: [],
    leftAxis: {
      max: 0,
      min: 0
    },
    rightAxis: {
      max: 0,
      min: 0
    }
  });
  const [labels, setLabels] = useState<SelectBox[]>([]);
  const [frequencyText, setFrequencyText] = useState<string>('');
  
  const [getGadChartData, { loading }] = useLazyQuery<
    GetAssessmentTemplateCharts,
    GetAssessmentTemplateChartsVariables
  >(getAssessmentTemplateChartsQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetAssessmentTemplateCharts) {

        const { chart } = d.pretaaHealthGetAssessmentTemplateCharts;
        setFrequencyText(d.pretaaHealthGetAssessmentTemplateCharts.resultText ?? '');
        
        if (code === TemplateCodes.BAM_IOP || code === TemplateCodes.BAM_R) {
          const { data, labels: chartLabels } = getBamDataSet(d.pretaaHealthGetAssessmentTemplateCharts);
          setChartData(() => {
            return {
              data: data,
              leftAxis: {
                max:  getBamChartYAxis(code as unknown as ChartTypes, 'line', chart.chartBotomLeftScale.max),
                min: (getBamChartYAxis(code as unknown as ChartTypes, 'line', chart.chartBotomLeftScale.max)) * -1
              },
              rightAxis: {
                max: getBamChartYAxis(code as unknown as ChartTypes, 'bar', chart.chartTopRightScale.max ),
                min: (getBamChartYAxis(code as unknown as ChartTypes, 'bar', chart.chartTopRightScale.max)) * -1
              }
            };
          });
          setLabels(chartLabels);
          return;
        } 
        const { data, labels: chartLabels, barChartMax, lineChartMax } = getGadPhqDataSet(d.pretaaHealthGetAssessmentTemplateCharts);

        const rightAxisMax = transformChartYMax(Number(barChartMax) || Number(chart.chartTopRightScale.max));

        
          setChartData(() => {
            return {
              data: data,
              leftAxis: {
                max: getYAxis(code?.toLowerCase() as ChartTypes, 'line', 'max', lineChartMax || Number(chart.chartTopLeftScale.max)),
                min: getYAxis(code?.toLowerCase() as ChartTypes, 'line', 'min', null),
                steps: getStepBasedOnYMax(Number(chart.chartTopLeftScale.max ), code?.toLowerCase() as ChartTypes)
              },
              rightAxis: {
                max: code?.toLowerCase() === ChartTypes.URICA ? 0 : rightAxisMax,
                min: 0,
                steps: (assessmentFilter.selectedPatients.list.length > 1 || assessmentFilter.selectedPatients.all) ? getStepBasedOnYMax(rightAxisMax) : null
              }
            };
          });
          setLabels(chartLabels);
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const variables = getReportFilterVariables({ filter: assessmentFilter });
    if (!(variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)) {
      return;
    }
    if (code) {
      getGadChartData({
        variables: { ...variables, code },
      });
    }
    // 
  }, [assessmentFilter, code]);

    return {
      loading,
      chartData,
      labels,
      frequencyText
    };
}
