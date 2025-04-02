import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  EventFilterTypes,
  GetHelplineReport,
  GetHelplineReportVariables,
} from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import catchError from 'lib/catch-error';
import { getHelpLineReport } from 'graphql/getHelpLineReport.query';
import ContactedPatientList from './ContactedPatientList';
import { useParams } from 'react-router-dom';
import ReportEventList from '../ReportEventList';
import ReportBarChart from '../ReportChart/ReportBarChart';
import {
  BarChartDataInterface,
  BarChartInterface,
} from 'screens/Report/interface/barChartData.interface';
import { sortAlphabeticallyLogic } from 'lib/sortAlphabetically';
import { colors } from '../ReportChart/colors';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';

export interface HelpLinePatientListInterface {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    value: number;
  }[];
  moreData: boolean;
}


export default function HelpLineContactedPage() {
  const { patientId } = useParams();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);
  const [barChartData, setBarChart] = useState<BarChartInterface>({
    chartMaxValue: 0,
    barChartLabels: [],
    barChartData: [],
  });

  const [helpLineChartCallback, { loading: helpLineChartLoading }] =
    useLazyQuery<GetHelplineReport, GetHelplineReportVariables>(
      getHelpLineReport,
      {
        onCompleted: (d) => {
          if (d?.pretaaHealthGetHelplineReport) {
            let chartMaxValue = 0;
            const chartData: BarChartDataInterface[] = [
              'Call',
              'Text',
            ].sort((a, b) => sortAlphabeticallyLogic(a, b)).map((el, i) => {
              return {
                label: el,
                data: [],
                color: colors[i],
              };
            });
            const barChartLabels: string[] = [];

            d.pretaaHealthGetHelplineReport.stats.forEach((e) => {

              if (chartMaxValue < e.helplineCallCount) {
                chartMaxValue = e.helplineCallCount;
              }
              if (chartMaxValue < e.helplineTextCount) {
                chartMaxValue = e.helplineTextCount;
              }

              chartData[0].data.push(e.helplineCallCount);
              chartData[1].data.push(e.helplineTextCount);
              barChartLabels.push(e.label);
              
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
    if (
      !!reportFilter.filterUsers.length || reportFilter.all) {
      helpLineChartCallback({
        variables: getEventStatusPayload(reportFilter, patientId),
      });
    }
  }, [reportFilter, patientId]);

  return (
    <div>
       <ReportBarChart
        title="Help line"
        labels={barChartData?.barChartLabels}
        data={barChartData?.barChartData}
        loading={helpLineChartLoading}
        yAxisMax={barChartData.chartMaxValue}
      />
      {!patientId && <ContactedPatientList />}
      {!!patientId && <ReportEventList patientId={patientId}  eventType={ [EventFilterTypes.CONTACTED_HELPLINE]} />}
    </div>
  );
}
