import { useLazyQuery } from '@apollo/client';
import { patientListStatsQuery } from 'graphql/patient-list-stats.query';
import {
  PatientListForOpenStats,
  PatientListForOpenStatsVariables,
  PatientListForTemplateStats,
  PatientListForTemplateStatsVariables,
} from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  CampaignStatsType,
  CompletedStatsHeader,
  OpenStatTableColumn,
  ReportTableCol,
  ReportTableColumn,
  ScoreData,
} from '../assement-report-interface';
import { ColDef, ColGroupDef } from '@ag-grid-community/core';

import GridGenericColumn from './GridGenericColumn';
import { toCamelCase } from 'lib/toCamelCase';
import { getReportFilterVariables } from '../../lib/getReportFilterVariables';
import catchError from 'lib/catch-error';
import { patientListOpenStatsQuery } from 'graphql/patient-list-open-stats.query';
import GridOpenColumn from './GridOpenColumn';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { configureColumn, convertColumnValue } from './AssessmentPatientListHelper';
import { getTemplateCode } from '../../lib/get-templateCode';

export default function usePatientList() {
  const appData = getAppData();
  const selectedCampaign = useAppSelector((state) => state.assessmentReport.selectedCampaign);
  const [rows, setRows] = useState<ReportTableCol[]>([]);
  const [columns, setColumns] = useState<ReportTableColumn[] | OpenStatTableColumn[]>([]);
  const [columnDef, setColumnDef] = useState<(ColDef | ColGroupDef)[]>([]);
  const assessmentFilter = useAppSelector((state) => state.app.assessmentFilter);

  const [getPatientList, { loading: loadingForComplete }] = useLazyQuery<
    PatientListForTemplateStats,
    PatientListForTemplateStatsVariables
  >(patientListStatsQuery, {
    onCompleted: (d) => {
      const response = d.pretaaHealthPatientListForTemplateStats;
      let columnsKeys: string[] = [];

      // Table headers
      if (response.headers) {
        setColumns((response.headers as ReportTableColumn[]) || []);
        columnsKeys = response.headers.map((c) => toCamelCase(c));
      }

      if (response.rows) {
        const rowList: Array<ReportTableCol> = [];
        // Data transformation for easy to understand
        // Columns mapped based on index value with response.headers
        response.rows.forEach((r) => {
          const columnObj: ReportTableCol = {};
          const copyOfColumnObject: ReportTableCol = {};
          columnObj.patientId = r.patientId;
          columnObj.assignmentId = r.ID;

          r.data?.forEach((col, i) => {
            columnObj[columnsKeys[i]] = col;
            copyOfColumnObject[columnsKeys[i]] = col.value;

            // value transformation -> string to number
            columnObj.scoreAverage = convertColumnValue(columnObj.scoreAverage as ScoreData);
            columnObj.protectiveFactors = convertColumnValue(columnObj.protectiveFactors as ScoreData);
            columnObj.useFactors = convertColumnValue(columnObj.useFactors as ScoreData);
            columnObj.riskFactors = convertColumnValue(columnObj.riskFactors as ScoreData);
            columnObj.readinessScore = convertColumnValue(columnObj.readinessScore as ScoreData);

            if (columnsKeys?.includes(CompletedStatsHeader.completed) && copyOfColumnObject.completed) {
              columnObj.completed = formatDate({ date: copyOfColumnObject?.completed, formatStyle: 'agGrid-date' });
            }

            if (columnsKeys?.includes(CompletedStatsHeader.name) && copyOfColumnObject.name) {
              columnObj.name = copyOfColumnObject?.name;
            }

            if (columnsKeys?.includes(CompletedStatsHeader.facility) && copyOfColumnObject.facility) {
              columnObj.facility = copyOfColumnObject?.facility;
            }
          });

          rowList.push(columnObj);
        });

        setRows(rowList);

        const defs: any = [];

        columnsKeys.forEach((col) => {
          const colD: any = {
            field: col,
            filter: 'agNumberColumnFilter',
            sortable: true,
            cellRenderer: GridGenericColumn,
            autoHeight: true,
          };

          if (
            col === CompletedStatsHeader.name ||
            col === CompletedStatsHeader.facility ||
            col === CompletedStatsHeader.severityType
          ) {
            colD.filter = 'agTextColumnFilter';
          }

          configureColumn(col, colD, CompletedStatsHeader.scoreAverage);
          configureColumn(col, colD, CompletedStatsHeader.protectiveFactors);
          configureColumn(col, colD, CompletedStatsHeader.useFactors);
          configureColumn(col, colD, CompletedStatsHeader.riskFactors);
          configureColumn(col, colD, CompletedStatsHeader.readinessScore);
          configureColumn(col, colD, CompletedStatsHeader.severityType);

          if (col === CompletedStatsHeader.biometricScore) {
            colD.width = 350;
            colD.filter = false;
            colD.sortable = false;
          }

          if (col === CompletedStatsHeader.completed) {
            colD.filter = 'agDateColumnFilter';
          }
          if (appData.selectedFacilityId?.length === 1 && col === CompletedStatsHeader.facility) {
            colD.hide = true;
            colD.suppressColumnsToolPanel = true;
          }

          defs.push(colD);
        });

        setColumnDef(defs);
      }
      if (response?.headers?.length && response?.rows?.length && response.rows[0].data?.length !== response.headers.length) {
        toast.error('Campaign summary data has incorrect response!', { toastId: 'patient-list' });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [getPatientForOpen, { loading: loadingForOpen }] = useLazyQuery<
    PatientListForOpenStats,
    PatientListForOpenStatsVariables
  >(patientListOpenStatsQuery, {
    onCompleted: (r) => {
      const response = r.pretaaHealthPatientListForTemplateStatsIncomplete;
      let columnsKeys: string[] = [];

      // Table headers

      if (response.headers) {
        setColumns((response.headers as OpenStatTableColumn[]) || []);
        columnsKeys = response.headers.map((c) => toCamelCase(c));
      }

      if (response.rows) {
        const rowList: Array<ReportTableCol> = [];

        // Data transformation for easy to understand
        // Columns mapped based on index value with response.headers
        response.rows.forEach((row) => {
          const columnObj: ReportTableCol = {};
          columnObj.patientId = row.patientId;
          columnObj.assignmentId = row.ID;

          row.data?.forEach((col, i) => {
            columnObj[columnsKeys[i]] = col.value;

            if (columnsKeys?.includes(CompletedStatsHeader.assigned) && columnObj.assigned) {
              columnObj.assigned = formatDate({ date: columnObj?.assigned, formatStyle: 'agGrid-date' });
            }
          });

          rowList.push(columnObj);
        });

        setRows(rowList);

        const defs: any = [];

        columnsKeys.forEach((col) => {
          const colD: any = {
            field: col,
            sortable: true,
            filter: 'agTextColumnFilter',
            cellRenderer: GridOpenColumn,
            autoHeight: true,
          };

          if (col === 'assigned') {
            colD.filter = 'agDateColumnFilter';
          }

          defs.push(colD);
        });

        setColumnDef(defs);
      }
      if (response.headers?.length && response?.rows?.length && response.rows[0]?.data?.length !== response.headers.length) {
        toast.error('Campaign summary data has incorrect response!', { toastId: 'patient-list' });
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    setRows([]);
    setColumns([]);
    if (selectedCampaign?.campaignId && selectedCampaign.templateCode) {
      if (selectedCampaign.campaignType === CampaignStatsType.COMPLETED) {
        getPatientList({
          variables: {
            ...getReportFilterVariables({ filter: assessmentFilter }),
            assessmentNumber: Number(selectedCampaign?.campaignId),
            code: getTemplateCode(selectedCampaign.templateCode),
          },
        });
      } else {
        console.log(selectedCampaign.templateCode);

        getPatientForOpen({
          variables: {
            ...getReportFilterVariables({ filter: assessmentFilter }),
            assessmentNumber: Number(selectedCampaign?.campaignId),
            code: getTemplateCode(selectedCampaign.templateCode)
          },
        });
      }
    }
    //
  }, [selectedCampaign, assessmentFilter]);

  return {
    rows,
    columns,
    loadingForOpen,
    loadingForComplete,
    columnDef,
  };
}
