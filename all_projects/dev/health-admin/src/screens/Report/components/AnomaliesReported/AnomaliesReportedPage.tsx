import React, { useEffect, useState } from 'react';
import './_patientRowView.scoped.scss';
import ReportBarChart from '../ReportChart/ReportBarChart';
import ReportDoughnutChart from '../ReportChart/ReportDoughnutChart';
import { useLazyQuery } from '@apollo/client';
import {
  EventFilterTypes,
  GetDayWiseAnomaliesReport,
  GetDayWiseAnomaliesReportVariables,
  GetTypesOfAnomaliesReport,
  GetTypesOfAnomaliesReportVariables,
} from 'health-generatedTypes';
import { getTypesOfAnomaliesReport } from 'graphql/getTypesOfAnomaliesReport.query';
import catchError from 'lib/catch-error';
import { getDayWiseAnomaliesReport } from 'graphql/getDayWiseAnomaliesReport.query';
import { BarChartInterface } from 'screens/Report/interface/barChartData.interface';
import { ChartDataInterface, DoughnutChartDataInterface } from 'screens/Report/interface/doughnutChartData.interface';
import { useAppSelector } from 'lib/store/app-store';
import { colors } from '../ReportChart/colors';
import AnomalyPatientList from './AnomalyPatientList';
import ReportEventList from '../ReportEventList';
import { useParams } from 'react-router-dom';
import { sortAlphabeticallyLogic } from 'lib/sortAlphabetically';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';
import { sortBy } from 'lodash';

export default function AnomaliesReportedPage() {
  const { patientId } = useParams();
  const [doughnutChartData, setDoughnutChartData] = useState<DoughnutChartDataInterface>({
    chartData: [],
    anomalyBreakdown: 0
  });
  const [barChartData, setBarChart] = useState<BarChartInterface>({
    chartMaxValue: 0,
    barChartLabels: [],
    barChartData: []
  });



const reportFilter  = useAppSelector(state => state.counsellorReportingSlice.reportFilter);
  
  const { filterMonthNDate,
    lastNumber,
    filterUsers,
    all,
    rangeStartDate,
    rangeEndDate } = reportFilter;
  
  // ----------- API ---------------------
  // DoughnutChart
  const [doughnutChartCallback, { loading: doughnutChartLoading }] = useLazyQuery<GetTypesOfAnomaliesReport, GetTypesOfAnomaliesReportVariables>(getTypesOfAnomaliesReport, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetTypesOfAnomaliesReport) {
        let anomalyBreakdown = 0;

        const totalAnomalies = sortBy(d.pretaaHealthGetTypesOfAnomaliesReport, [ 'name' ]).filter(e => e.key === 'total_anomalies');
        if (totalAnomalies) {
          anomalyBreakdown = totalAnomalies[0].count;
        }

        const chartData = sortBy(d.pretaaHealthGetTypesOfAnomaliesReport, [ 'name' ])
        .filter(e => e.key !== 'total_anomalies')
        .map((el, i) => {
          return { label: el.name, value: el.count, key: i + 1, flag: 'off', count: el.count, background: colors[i] };
        });
        setDoughnutChartData({
          chartData: chartData as ChartDataInterface[],
          anomalyBreakdown,
        });
      }
    },
    onError: (e) => catchError(e, true),
  });
  // ReportBarChart
  const [reportBarChartCallback, { loading: reportBarChartLoading }] = useLazyQuery<GetDayWiseAnomaliesReport, GetDayWiseAnomaliesReportVariables>(getDayWiseAnomaliesReport, {
    onCompleted: (d) => {
      if (d?.pretaaHealthGetDayWiseAnomaliesReport) {
        const barChartLabels: string[] = [];
        const heartAnomaly: number[] = [];
        const hrvAnomaly: number[] = [];
        const sleepAnomaly: number[] = [];
        const tempAnomaly: number[] = [];
        const spo2Anomaly: number[] = [];
        let chartMaxValue = 0;

        d.pretaaHealthGetDayWiseAnomaliesReport.forEach((e) => {
          barChartLabels.push(e.label);
          heartAnomaly.push(e.heart_anomaly);
          hrvAnomaly.push(e.hrv_anomaly);
          sleepAnomaly.push(e.sleep_anomaly);
          spo2Anomaly.push(e.spo2_anomaly);
          tempAnomaly.push(e.temp_anomaly);

          if (e.heart_anomaly > chartMaxValue) {
            chartMaxValue = e.heart_anomaly;
          }
          if (e.hrv_anomaly > chartMaxValue) {
            chartMaxValue = e.hrv_anomaly;
          }
          if (e.sleep_anomaly > chartMaxValue) {
            chartMaxValue = e.sleep_anomaly;
          }
          if (e.spo2_anomaly > chartMaxValue) {
            chartMaxValue = e.spo2_anomaly;
          }
          if (e.temp_anomaly > chartMaxValue) {
            chartMaxValue = e.temp_anomaly;
          }

        });

        const chartData = [
          {
            label: 'Heart Anomaly',
            data: heartAnomaly,
          },
          {
            label: 'HRV Anomaly',
            data: hrvAnomaly,
          }, 
          {
            label: 'SpO2 Anomaly',
            data: spo2Anomaly,
          }, 
          {
            label: 'Sleep Anomaly',
            data: sleepAnomaly,
          },
          {
            label: 'Temp Anomaly',
            data: tempAnomaly,
          }, 
        ].sort((a, b) => 
          sortAlphabeticallyLogic(a.label, b.label)
        ).map((data, i) => {
          return {
            ...data,
            color: colors[i]
          };
        });
       
        setBarChart({
          chartMaxValue,
          barChartLabels,
          barChartData: chartData
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  function callAPIs() {
    const payload = getEventStatusPayload(reportFilter, patientId);
    
    const variables = {
      filterMonthNDate: payload.filterMonthNDate, 
      lastNumber: payload.lastNumber,
      all: payload.all,
      rangeStartDate: payload.rangeStartDate,
      rangeEndDate: payload.rangeEndDate,
      filterUsers: payload.filterUsers
    };

    doughnutChartCallback({
      variables
    });
    reportBarChartCallback({
      variables
    });
  }

  useEffect(() => {
    if ((filterUsers.length > 0 && all === false) || (all &&  filterUsers.length === 0) ) {
      callAPIs();
    } 
  }, [filterMonthNDate,
    filterUsers,
    all,
    lastNumber,
    rangeStartDate,
    rangeEndDate, patientId]);


  return (
      <div className="w-full h-full">

      {/* ------------------------------ BAR CHART -------------------------------------- */}
        <ReportBarChart
          title="Total"
          labels={barChartData?.barChartLabels}
          data={barChartData?.barChartData}
          loading={reportBarChartLoading}
          yAxisMax={barChartData.chartMaxValue}
        />
      {/* ----------------------------------------------------------------------------------- */}




        {/* ------------------------------ DOUGHNUT CHART -------------------------------------- */}
        <ReportDoughnutChart
          headerTitle="Types of anomalies"
          chartData={doughnutChartData?.chartData}
          initialLabelData={{
            label: 'Anomaly Breakdown',
            value: doughnutChartData?.anomalyBreakdown
          }}
          loading={doughnutChartLoading}
          labelClickable={false}
        />
        {/* ----------------------------------------------------------------------------------- */}

      {!patientId && <AnomalyPatientList />}
      {!!patientId && <ReportEventList patientId={(patientId)} eventType={[EventFilterTypes.ALERT]} />}
    </div>
  );
}

