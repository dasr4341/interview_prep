import React, { useContext, useEffect, useState } from 'react';

import './_reportSurveyRowView.scoped.scss';
import ReportDoughnutChart from '../ReportChart/ReportDoughnutChart';
import { useLazyQuery } from '@apollo/client';
import {
  EventFilterTypes,
  GetPoorSurveyScoresDetailsReport,
  GetPoorSurveyScoresDetailsReportVariables,
  GetPoorSurveyScoresReport,
  GetPoorSurveyScoresReportVariables,
  PoorSurveyBarChart,
  PoorSurveyBarChartVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import { getPoorSurveyScoreReport } from 'graphql/getPoorSurveyScoreReport.query';
import { colors } from '../ReportChart/colors';
import NeedingAttentionPatientList from './NeedingAttentionPatientList';
import { ChartDataInterface, DoughnutChartDataInterface } from 'screens/Report/interface/doughnutChartData.interface';
import { FilterStyleEnum } from 'interface/charts/dougnutChart.interface';
import ReportBarChart from '../ReportChart/ReportBarChart';
import { poorSurveyBarChartQuery } from 'graphql/poorSurveyBarChart.query';
import { BarChartDataInterface, BarChartInterface } from 'screens/Report/interface/barChartData.interface';
import { sortAlphabeticallyLogic } from 'lib/sortAlphabetically';
import ReportEventList from '../ReportEventList';
import { useParams } from 'react-router-dom';
import { PoorSurveyDetailContext } from './PoorSuvreyContext';
import { getPoorSurveyScoreDetailsReport } from 'graphql/getPoorSurveyScoreDetailReport.query';
import ReportChartDetails from '../ReportChart/ReportDoughnutChartDetails';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';

export default function PoorSurveyScoresPage() {
  const { patientId } = useParams();

  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);

  const [poorSurveyChartData, setPoorSurveyChartData] = useState<DoughnutChartDataInterface>({
    chartData: [],
    anomalyBreakdown: 0,
  });

  const [poorSurveyChartDetails, setPoorSurveyChartDetails] = useState<DoughnutChartDataInterface>({
    chartData: [],
    anomalyBreakdown: 0,
  });
  const [barChartData, setBarChart] = useState<BarChartInterface>({
    chartMaxValue: 0,
    barChartLabels: [],
    barChartData: [],
  });

  const { templateCode, setTemplateScoreBreakDown, toggleReportState } = useContext(PoorSurveyDetailContext);

  const [poorSurveyChartDataCallback, { loading: poorSurveyChartLoading }] = useLazyQuery<
    GetPoorSurveyScoresReport,
    GetPoorSurveyScoresReportVariables
  >(getPoorSurveyScoreReport, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPoorSurveyScoresReport) {
        const chartData = d.pretaaHealthGetPoorSurveyScoresReport?.list?.map((el, i) => ({
            label: el?.template_name,
            value: el?.trigger,
            key: i + 1,
            flag: 'off',
            code: el.code,
            background: i < 100 ? colors[i] : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }))?.sort((a, b) => sortAlphabeticallyLogic(a.label, b.label));
        
        setPoorSurveyChartData(() => ({
          chartData: chartData as ChartDataInterface[],
          anomalyBreakdown: d.pretaaHealthGetPoorSurveyScoresReport.summary?.total_trigger as number,
          totalPatient: d.pretaaHealthGetPoorSurveyScoresReport.summary?.unique_patient,
          code: d.pretaaHealthGetPoorSurveyScoresReport?.list?.map((el) => el.code),
        }));
      }
    },
    onError: (e) => catchError(e, true)
  });



  const [getPoorSurveyDetailScore, { loading: surveyDetailsLoading }] = useLazyQuery<
    GetPoorSurveyScoresDetailsReport,
    GetPoorSurveyScoresDetailsReportVariables
  >(getPoorSurveyScoreDetailsReport, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPoorSurveyScoresDetailsReport) {
        let totalScore = 0;
        let templateName = '';
        totalScore = Number(d.pretaaHealthGetPoorSurveyScoresDetailsReport.summary?.total);
        templateName = String(d.pretaaHealthGetPoorSurveyScoresDetailsReport.summary?.templateName);

        const chartData = (d.pretaaHealthGetPoorSurveyScoresDetailsReport.list || [])
          .filter((el) => el) // Filter out null or undefined values
          .sort((a, b) => sortAlphabeticallyLogic(a?.label, b?.label))
          .map((el, i) => ({
            label: el?.label,
            value: el?.value,
            key: i + 1,
            flag: 'off',
            background: i < 100 ? colors[i] : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }));

        setPoorSurveyChartDetails({
          chartData: chartData as ChartDataInterface[],
          anomalyBreakdown: totalScore,
          templateName: templateName,
        });

        setTemplateScoreBreakDown(d.pretaaHealthGetPoorSurveyScoresDetailsReport);
      }
    },
    onError: (e) => catchError(e, true),
  });

  // barChart
  const [barChartCallback, { loading: barChartLoading }] = useLazyQuery<
    PoorSurveyBarChart,
    PoorSurveyBarChartVariables
  >(poorSurveyBarChartQuery, {
    onCompleted: (d) => {
      const barChartLabels: string[] = [];
      if (d?.pretaaHealthGetDayWisePoorSurveyReport) {
        const { data, legends } = d.pretaaHealthGetDayWisePoorSurveyReport;

        const chartData: { [key: string]: number | string }[] | null = data;
        const chartLegendsInfo: { [key: string]: string } = {};
       
        legends?.forEach((legendsData) => {
          chartLegendsInfo[legendsData.key?.trim()] = String(legendsData.value?.trim());
        });

        let chartMaxValue = 0;
        const formattedChartData: BarChartDataInterface[] = [];

        chartData?.forEach((e) => {
          let index = 0;

          Object.entries(e).forEach((value) => {
            const key = value[0];
            if (key === 'label') {
              barChartLabels.push(String(value[1]));
              return;
            }

            if (!formattedChartData[index]?.label) {
              formattedChartData.push({
                label: chartLegendsInfo[key] || '',
                data: [],
                color: colors[index],
              });
            } else if (formattedChartData[index].label !== chartLegendsInfo[key]) {
              index = formattedChartData.findIndex((f) => f.label === key);
            }

            formattedChartData[index]?.data.push(value[1] as number);
            if (Number(value[1]) > chartMaxValue) {
              chartMaxValue = Number(value[1]);
            }
            index++;
          });
        });

        setBarChart({
          chartMaxValue,
          barChartLabels,
          barChartData: formattedChartData.sort((a, b) => sortAlphabeticallyLogic(a.label, b.label)),
        });
      }
    },
  });

  function callAPIs() {
    const variables = getEventStatusPayload(reportFilter, patientId);
    poorSurveyChartDataCallback({
      variables,
    });
    barChartCallback({
      variables,
    });
  }

  useEffect(() => {
    if (
      (reportFilter.filterUsers.length > 0 && reportFilter.all === false) ||
      (reportFilter.all && reportFilter.filterUsers.length === 0)
    ) {
      callAPIs();
    }
  }, [reportFilter, patientId]);

  // set variables for poor survey details score
  useEffect(() => {
    if (templateCode) {
      getPoorSurveyDetailScore({
        variables: {
          ...reportFilter,
          filterUsers: reportFilter.filterUsers.map((d) => {
            return { patientId: d.patientId };
          }),
          code: templateCode,
        },
      });
    }
  }, [templateCode]);

  return (
    <React.Fragment>
      {/* ------------------------------ BAR CHART -------------------------------------- */}
      <ReportBarChart
        title="Total"
        labels={barChartData?.barChartLabels}
        data={barChartData?.barChartData}
        loading={barChartLoading}
        yAxisMax={barChartData.chartMaxValue}
      />
      {/* ----------------------------------------------------------------------------------- */}

      <ReportDoughnutChart
        labelClickable={true}
        headerTitle="Assessment Breakdown"
        chartData={poorSurveyChartData.chartData}
        initialLabelData={{
          label: 'Score Breakdown',
          value: poorSurveyChartData.anomalyBreakdown,
        }}
        loading={poorSurveyChartLoading}
        totalPatient={poorSurveyChartData.totalPatient}
        filterStyle={FilterStyleEnum.style2}
      />
      {toggleReportState && (
        <ReportChartDetails
          chartData={poorSurveyChartDetails.chartData}
          initialDetailsLabel={{
            label: String(poorSurveyChartDetails.templateName),
            value: poorSurveyChartDetails.anomalyBreakdown,
          }}
          templateTitle={poorSurveyChartDetails.templateName}
          surveyDetailsLoading={surveyDetailsLoading}
        />
      )}

      {!patientId && <NeedingAttentionPatientList />}
      {!!patientId && (
        <ReportEventList
          patientId={patientId}
          trigger={true}
          eventType={[EventFilterTypes.COMPLETED_ASSESSMENT]}
        />
      )}
    </React.Fragment>
  );
}
