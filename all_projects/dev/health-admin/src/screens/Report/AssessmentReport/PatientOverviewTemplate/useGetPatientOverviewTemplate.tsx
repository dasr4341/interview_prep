import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import shortId from 'shortid';


import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import {
  AssessmentPatientsDischargeFilterTypes,
  OverviewTemplateStats,
  OverviewTemplateStatsVariables,
} from 'health-generatedTypes';
import { getPatientOverviewTemplateQuery } from 'graphql/getPatientOverviewTemplate.query';
import {
  ReportTableCol,
  ReportTableRow,
  Score,
} from '../AssementReportForTemplate/assement-report-interface';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';

export default function useGetPatientOverviewTemplate() {
  const assessmentFilter = useAppSelector(
    (state) => state.app.assessmentFilter
  );
  const [tableData, setTableData] = useState<ReportTableRow[]>([]);
  const [isGroup, setIsGroup] = useState<boolean>(false);

  const [getPatientOverViewList, { loading: patientOverviewLoading }] =
    useLazyQuery<OverviewTemplateStats, OverviewTemplateStatsVariables>(
      getPatientOverviewTemplateQuery,
      {
        onCompleted: (d) => {
          const response = d.pretaaHealthOverviewTemplateStats;

          if (response?.rows) {
            const rows: ReportTableRow[] = [];

            // Data transformation for easy to understand
            // Columns mapped based on index value with response.headers
            response.rows.forEach((r) => {
              const columns: ReportTableCol[] = [];

              r.data?.forEach((col) => {
                const column: ReportTableCol = {
                  value: col.value,
                  percent: col.percent as unknown as Score,
                  info: col.description,
                  assessmentNumber: Number(col.assessmentNumber),
                  id: shortId(),
                };

                columns?.push(column);
              });

              rows.push({
                data: columns,
                id: shortId(),
                // TODO: fix this patientId, assessmentId
                patientId: null,
                assessmentId: null
              });
            });

            setTableData(rows);
          }
        },
        onError: (e) => catchError(e, true),
      }
    );

  useEffect(() => {
    const variables = getReportFilterVariables({ filter: assessmentFilter });

    if ((assessmentFilter.selectedPatients.all || assessmentFilter.selectedPatients.list.length > 0) && 
      (variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)) {
      setTableData([]);
      getPatientOverViewList({
        variables
      });
      setIsGroup(assessmentFilter.selectedPatients.all || assessmentFilter.selectedPatients.list.length > 1);
    }
    
    // 
  }, [assessmentFilter]);

  return {
    assessmentFilter,
    tableData,
    patientOverviewLoading,
    isGroup,
  };
}
