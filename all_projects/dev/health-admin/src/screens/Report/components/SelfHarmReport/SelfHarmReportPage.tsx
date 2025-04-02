import React, { useEffect, useState } from 'react';
import ReportDoughnutChart from '../ReportChart/ReportDoughnutChart';
import ReportBarChart from '../ReportChart/ReportBarChart';
import {
  BarChartDataInterface,
  BarChartInterface,
} from 'screens/Report/interface/barChartData.interface';
import { ChartDataInterface, DoughnutChartDataInterface } from 'screens/Report/interface/doughnutChartData.interface';
import { useLazyQuery } from '@apollo/client';
import { selfHarmBarChartQuery } from 'graphql/selfHarmBarChart.query';
import {
  SelfHarmBarChart,
  SelfHarmBarChartVariables,
  selfHarmDoughnutChart,
  selfHarmDoughnutChartVariables,
} from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import { selfHarmDoughnutChartQuery } from 'graphql/selfHarmDoughnutChart.query';
import catchError from 'lib/catch-error';
import SelfHarmPatientList from './SelfHarmPatientList';
import ReportEventList from '../ReportEventList';
import { useParams } from 'react-router-dom';
import { sortAlphabeticallyLogic } from 'lib/sortAlphabetically';
import { colors } from '../ReportChart/colors';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';
import { cloneDeep } from 'lodash';

export default function SelfHarmReportPage() {
  const { patientId } = useParams();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);

  const [doughnutChartData, setDoughnutChartData] =
    useState<DoughnutChartDataInterface>({
      chartData: [],
      anomalyBreakdown: 0,
    });
  const [barChartData, setBarChart] = useState<BarChartInterface>({
    chartMaxValue: 0,
    barChartLabels: [],
    barChartData: [],
  });

  // BarChart
  const [selfHarmBarChartCallback, { loading: selfHarmBarChartLoading }] =
    useLazyQuery<SelfHarmBarChart, SelfHarmBarChartVariables>(
      selfHarmBarChartQuery,
      {
        onCompleted: (d) => {
          let chartMaxValue = 0;
          const barChartLabels: string[] = [];

          const chartData: BarChartDataInterface[] = [
            'Several Days',
            'More Than Half The Days',
            'Nearly All The Time',
          ].sort((a, b) => sortAlphabeticallyLogic(a, b)).map((el, i) => {
            return {
              label: el,
              data: [],
              color: colors[i],
            };
          });

          // STATIC data transform
          d.pretaaHealthGetDayWiseSuicidalIdeationReport.list?.forEach((e) => {
            const  severalDays = Number(e.severalDays);
            const  moreThanHalfDays = Number(e.moreThanHalfDays);
            const nearlyEveryDay = Number(e.nearlyEveryDay);
           
            barChartLabels.push(e.label);

            chartData[0].data.push(moreThanHalfDays);
            chartData[1].data.push(nearlyEveryDay);
            chartData[2].data.push(severalDays);

            if (severalDays > chartMaxValue) {
              chartMaxValue = severalDays;
            }
            if (moreThanHalfDays > chartMaxValue) {
              chartMaxValue = moreThanHalfDays;
            }
            if (nearlyEveryDay > chartMaxValue) {
              chartMaxValue = nearlyEveryDay;
            }

          });
          

          setBarChart({
            chartMaxValue,
            barChartLabels,
            barChartData: chartData,
            infoDetails: d.pretaaHealthGetDayWiseSuicidalIdeationReport.avgSeveralDays ?  {
              header: String(Math.round((d.pretaaHealthGetDayWiseSuicidalIdeationReport.avgSeveralDays || 0) * 10) / 10),
              title: 'Avg. # of ‘Several days’ per patient'
            } : null
          });
        },
        onError: (e) => catchError(e, true),
      }
    );
  
  //  DoughnutChart
   const [doughnutChartCallback, { loading:doughnutChartLoading }] = useLazyQuery<selfHarmDoughnutChart, selfHarmDoughnutChartVariables>(selfHarmDoughnutChartQuery, {
    onCompleted: (d) => {
      
      if (d.pretaaHealthGetTypesOfSuicidalIdeationReport) {
        

        const chartData = cloneDeep(d.pretaaHealthGetTypesOfSuicidalIdeationReport.list)?.sort((a, b) => sortAlphabeticallyLogic(a.name, b.name)).map((el, i) => {
          return { label: el.name, value: el.count, key: i + 1, flag: 'off', count: el.count, background: colors[i] };
        });

        console.log({ d: d.pretaaHealthGetTypesOfSuicidalIdeationReport, chartData });

        const dount = {
          chartData: chartData as any as ChartDataInterface[],
          anomalyBreakdown: d.pretaaHealthGetTypesOfSuicidalIdeationReport.total || 0,
          infoDetails: d.pretaaHealthGetTypesOfSuicidalIdeationReport.avgSeveralDays ?  {
            header: String(Math.round((d.pretaaHealthGetTypesOfSuicidalIdeationReport?.avgSeveralDays || 0) * 10) / 10),
            title: 'Avg. # of ‘Several days’ per patient'
          } : null
        };

        console.log(dount);
       
        setDoughnutChartData(dount);
      }
    },
    onError: (e) => catchError(e, true),
  });
  


  function callAPIs() {
    const variables = getEventStatusPayload(reportFilter, patientId);
    selfHarmBarChartCallback({
      variables,
    });
    doughnutChartCallback({
      variables,
    });
  }

  useEffect(() => {
    if ((reportFilter.filterUsers.length > 0 && reportFilter.all === false) || (reportFilter.all &&  reportFilter.filterUsers.length === 0) ) {
      callAPIs();
    }
    // 
  }, [reportFilter, patientId]);

  return (
    <div>
      {/* ------------------------------ BAR CHART -------------------------------------- */}
      <ReportBarChart
        title="Total"
        labels={barChartData?.barChartLabels}
        data={barChartData?.barChartData}
        loading={selfHarmBarChartLoading}
        yAxisMax={barChartData.chartMaxValue}
      />
      {/* ----------------------------------------------------------------------------------- */}

      {/* ------------------------------ DOUGHNUT CHART -------------------------------------- */}
      <ReportDoughnutChart
          headerTitle="Types of anomalies"
          chartData={doughnutChartData.chartData}
          initialLabelData={{
            label: 'Anomaly Breakdown',
            value: doughnutChartData.anomalyBreakdown
          }}
        loading={doughnutChartLoading}
        />
      {/* ----------------------------------------------------------------------------------- */}
      {!patientId && <SelfHarmPatientList />}
      {!!patientId && <ReportEventList patientId={patientId}  selfHarm={true} />}
    </div>
  );
}

