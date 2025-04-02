import { useLazyQuery } from '@apollo/client';
import { getAssessmentsOverviewChartQuery } from 'graphql/getAssessmentsOverviewChart.query';
import {
  AssessmentPatientsDischargeFilterTypes,
  GetAssessmentsOverviewChart,
  GetAssessmentsOverviewChartVariables,
  GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart,
  GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_completed,
  GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_incomplete,
} from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import { useEffect, useState } from 'react';
import { AssessmentChartColorScheme } from '../enum/AssessmentChartColorScheme';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';
import { toast } from 'react-toastify';
import { useDischargeDropDownPlaceholder } from '../helper/DischargeDropDownPlaceholderProvider';

export interface AssessmentChartData {
  data: number[];
  label: any;
  labelForFilter?: string,
  stack: string;
  barPercentage: number;
  backgroundColor: string;
  assessmentType: 'complete' | 'incomplete';
}

interface AssessmentChartDataSetsInterface {
  labels: string[];
  data: AssessmentChartData[];
  yMax: number;
  steps?: number;
}

function transformChartData(
  response:
  GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart
) {
  const { data: chartData, legends } = response;
  const label: string[] = [];
  let yMax = 0;

  const chartLegendsInfo: { [key: string]: { label: string, color: string } } = {};
  const colors: { [key: string]: string } = {};

  Object.entries(AssessmentChartColorScheme).forEach(f => {
    //  we are saving data in colorHelper, so that we don't need to iterate multiple times
    colors[f[0]] = f[1];
  });

  legends?.forEach(d => {
    const value =  String(d.value?.trim());
    chartLegendsInfo[d.key?.trim()] = {
      label: value,
      color: colors[value]
    };
  });

  const completed: AssessmentChartData[] = [];

  const incompleteColorLabel = chartLegendsInfo.incomplete;
  const incomplete: AssessmentChartData = {
    stack: 'Stack 1',
    data: [],
    barPercentage: 1,
    assessmentType: 'incomplete',
    label: [incompleteColorLabel.label],
    backgroundColor: incompleteColorLabel.color,
  };


  chartData?.forEach((data) => {
    label.push(String(data.label));
    const completedAssignment = data?.assignment?.completed;
    let sumOfValue = 0;

    completedAssignment?.forEach((k: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_completed, i: number) => {
      const { color: backgroundColor, label: cLabel } = chartLegendsInfo[k.key];
      let index = i;

      if (!completed[index]) {
         completed[index] = {
          data: [],
          labelForFilter: cLabel,
          stack: 'Stack 0',
          barPercentage: 1,
          assessmentType: 'complete',
          label: [],
          backgroundColor
        };
      } else if (completed[index].labelForFilter !== cLabel) {
        index = completed.findIndex(f => f.labelForFilter === cLabel);
      }
      const value = Number(k.value);
      sumOfValue += value;

      completed[index].data.push(Math.round(value));
      completed[index].label.push(cLabel + ': ' + k.value + '% (' + k.count + ')');
    });
    if (yMax < sumOfValue) {
      yMax = sumOfValue;
    }
    sumOfValue = 0;
    // ------------------------------------------------
    const incompletedAssignment = data?.assignment?.incomplete;
    
    if (incompletedAssignment) {
      const customLabel: string[] = [];
      let value = 0;

      incompletedAssignment?.forEach((k: GetAssessmentsOverviewChart_pretaaHealthGetAssessmentsOverviewChart_data_assignment_incomplete) => {
        value += Number(k.value);
        if (incompletedAssignment.length >= customLabel.length) {
          customLabel.push(chartLegendsInfo[k.key].label + ': ' + k.value + '% (' + k.count + ')');
        }
      });

      if (yMax < value) {
        yMax = value;
      }
      incomplete.label.push(customLabel.join(','));
      incomplete.data.push(Math.round(value));
    }
  });
  return {
    data: [...completed, incomplete],
    yMax,
    label,
  };
}

export default function usePatientOverViewGroupChart() {
  const { setError: setPlaceholder } = useDischargeDropDownPlaceholder();

  const assessmentFilter = useAppSelector(
    (state) => state.app.assessmentFilter
  );

  const [chartDataSet, setChartDataSet] =
    useState<AssessmentChartDataSetsInterface>({
      labels: [],
      data: [],
      yMax: 100,
      steps: 0
    });


  const [getChartData, { loading }] = useLazyQuery<
    GetAssessmentsOverviewChart,
    GetAssessmentsOverviewChartVariables
  >(getAssessmentsOverviewChartQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetAssessmentsOverviewChart) {
        setPlaceholder(null);
        const { data, yMax, label } = transformChartData(d.pretaaHealthGetAssessmentsOverviewChart);
        // rounding off to nearest multiple of ten
        const nearestMultipleOfTen = (10 - (yMax % 10)) + yMax;
        const newYMax = yMax % 10 ? nearestMultipleOfTen : yMax;

        setChartDataSet(() => {
          return {
            data,
            labels: label,
            yMax: newYMax,
          };
        });
      }
    },
    onError: (e) => {
      setChartDataSet({
        labels: [],
        data: [],
        yMax: 100,
        steps: 0
      });
      const err = getGraphError(e.graphQLErrors).join(',');
      if (err.toLowerCase().includes('no patients ') || err.toLowerCase().includes('no patient found')) {
        setPlaceholder(err);
        return;
      }
      toast.error(err);
    },
  });

  useEffect(() => {
    const variables = getReportFilterVariables({ filter: assessmentFilter });
    if ((assessmentFilter.selectedPatients.all || assessmentFilter.selectedPatients.list.length > 0)
    && (variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)
    ) {
      getChartData({
        variables
      });
    }
    // 
  }, [assessmentFilter]);

  return {
    loading,
    chartDataSet,
  };
}

