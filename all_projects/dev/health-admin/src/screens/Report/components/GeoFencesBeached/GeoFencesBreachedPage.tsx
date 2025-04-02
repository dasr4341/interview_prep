/*  */
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'lib/store/app-store';
import { useLazyQuery } from '@apollo/client';
import {
  EventFilterTypes,
  GetFenceBreachReport,
  GetFenceBreachReportVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { getFenceBreadChartReport } from 'graphql/getFenceBreadReport.query';
import GeofencesPatientList from './GeofencesPatientList';
import ReportEventList from '../ReportEventList';
import { useParams } from 'react-router-dom';
import { BarChartDataInterface, BarChartInterface } from 'screens/Report/interface/barChartData.interface';
import { colors } from '../ReportChart/colors';
import ReportBarChart from '../ReportChart/ReportBarChart';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';


export default function GeoFencesBreachedPage() {
  const { patientId } = useParams();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);
  const [barChartData, setBarChart] = useState<BarChartInterface>({
    chartMaxValue: 0,
    barChartLabels: [],
    barChartData: [],
  });

  const [fenceBreadChartCallback, { loading: fenceBreadChartLoading }] =
    useLazyQuery<GetFenceBreachReport, GetFenceBreachReportVariables>(
      getFenceBreadChartReport,
      {
        onCompleted: (d) => {
          if (d?.pretaaHealthGetFenceBreachReport) {
            let chartMaxValue = 0;
            const barChartLabels: string[] = [];
            const chartData: BarChartDataInterface[] = [
              'Entered',
              'Exited',
            ].map((el, i) => {
              return {
                label: el,
                data: [],
                color: colors[i],
              };
            });

            d.pretaaHealthGetFenceBreachReport.stats.forEach((e) => {
              barChartLabels.push(e.label);
              chartData[0].data.push(e.fenceBreachInCount);
              chartData[1].data.push(e.fenceBreachOutCount);
              if (chartMaxValue < e.fenceBreachInCount) {
                chartMaxValue = e.fenceBreachInCount;
              }
              if (chartMaxValue < e.fenceBreachOutCount) {
                chartMaxValue = e.fenceBreachOutCount;
              }
            });
            
            setBarChart({
              chartMaxValue,
              barChartLabels,
              barChartData: chartData,
              infoDetails: null,
            });
          }
        },
        onError: (e) => catchError(e, true),
      }
    );


  useEffect(() => {
    if (!!reportFilter.filterUsers.length || reportFilter.all) {
      fenceBreadChartCallback({
        variables: {
          ...getEventStatusPayload(reportFilter, patientId)
        }
      });
    }
    
  }, [reportFilter, patientId]);

  return (
    <div>
        <ReportBarChart
        title="Geofences Activated"
        labels={barChartData?.barChartLabels}
        data={barChartData?.barChartData}
        loading={fenceBreadChartLoading}
        yAxisMax={barChartData.chartMaxValue}
      />
      {!patientId && <GeofencesPatientList />}
      {!!patientId && <ReportEventList patientId={(patientId)} eventType={[EventFilterTypes.FENCE]} />}
    </div>
  );
}
