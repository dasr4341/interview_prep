import { useLazyQuery } from '@apollo/client';
import { getAssessmentStatusQuery } from 'graphql/getAssessmentStatusTable.query';
import { AssessmentPatientsDischargeFilterTypes, GetAssessmentReportingPatientStats, GetAssessmentReportingPatientStatsVariables } from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import { useEffect, useState } from 'react';
import { ReportTableCol, ReportTableColumn, ReportTableRow, Score, TemplateCodes } from './assement-report-interface';
import { useParams } from 'react-router-dom';
import { getReportFilterVariables } from '../lib/getReportFilterVariables';
import { toast } from 'react-toastify';
import shortId from 'shortid';


export default function useGetReportForTemplate() {
  const assessmentFilter = useAppSelector((state) => state.app.assessmentFilter);
  const [tableHeader, setTableHeader]  = useState<ReportTableColumn[]>([]);
  const [tableData, setTableData]  = useState<ReportTableRow[]>([]);
  const { templateCode } = useParams<{ templateCode: TemplateCodes }>();
  const [ isGroup, setIsGroup ] = useState<boolean>(false);

  const [getAssessmentStatusStats, { loading }] = useLazyQuery<
    GetAssessmentReportingPatientStats,
    GetAssessmentReportingPatientStatsVariables
  >(getAssessmentStatusQuery, {
    onCompleted: (d) => {
      const response = d.pretaaHealthGetAssessmentReportingPatientStats;

      if (response.headers && response?.rows && response.rows[0].data?.length !== response.headers.length) {
        toast.error('Campaign summary data has incorrect response!', { toastId: 'camp-table' });
      }

      // Table headers
      if (response.headers) {
        setTableHeader(response.headers as ReportTableColumn[] || []);
      }

      if (response.rows) {

        const rows: ReportTableRow[] = [];

        // Data transformation for easy to understand 
        // Columns mapped based on index value with response.headers
        response.rows.forEach(r => {
          const columns: ReportTableCol[] = [];
          const biometricIndex = response.headers?.findIndex(e => e === 'Biometric Score');

          r.data?.forEach((col, i) => {
              const column: ReportTableCol = {
                value : biometricIndex === i ? null : col.value,
                percent: col.percent as unknown as Score,
                info : col.description,
                assessmentNumber : col.assessmentNumber as any,
                id: shortId(),
                biometric: biometricIndex === i ? Number(col.value) : null
              };
              
              columns?.push(column);
          });

          rows.push({ data: columns, id: shortId(), assessmentId: r.ID, patientId: r.patientId });
         
        });
        setTableData(rows);
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const variables = getReportFilterVariables({ filter: assessmentFilter });
    if (!(variables.admittanceStatus === AssessmentPatientsDischargeFilterTypes.IN_CENSUS || !!variables.filterMonthNDate)) {
      return;
    }
    
    if (templateCode) {
      setTableHeader([]);
      setTableData([]);
      getAssessmentStatusStats({
        variables: {
          ...variables,
          code: templateCode,
        }
      });
    }

    setIsGroup(assessmentFilter.selectedPatients.all || assessmentFilter.selectedPatients.list.length > 1);
    
    // 
  }, [assessmentFilter, templateCode]);
  
  return {
    assessmentFilter,
    tableData,
    tableHeader,
    campaignsLoading: loading,
    isGroup,
    templateCode
  };
}

