import { useEffect, useState } from 'react';
import { GridReadyEvent } from '@ag-grid-community/core';

import { AssessmentDetails } from './lib/assessment-template-interface';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import {
  SurveyListForCounsellors,
  SurveyListForCounsellorsVariables,
} from 'health-generatedTypes';
import { getSurveyListForCounsellor } from 'graphql/getSurveyListForCounsellor.query';
import { config } from 'config';
import catchError from 'lib/catch-error';
import { useDispatch } from 'react-redux';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { formatDate } from 'lib/dateFormat';

export default function useAssessmentTemplateDetails() {
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<AssessmentDetails[]>([]);
  const { templateId, campaignType } = useParams();
  const dispatch = useDispatch();

  function publishedStatus(status: boolean) {
    if (status) {
      return 'Yes';
    } else if (status === false) {
      return 'No';
    } else {
      return 'N/A';
    }
  }

  const [getAssesmentTempalteDetail, { loading, refetch }] = useLazyQuery<
    SurveyListForCounsellors,
    SurveyListForCounsellorsVariables
  >(getSurveyListForCounsellor, {
    variables: {
      skip: 0,
      take: config.pagination.defaultTake,
      surveyTemplateId: String(templateId)
    },
    onCompleted: (d) => {
      if (d?.pretaaHealthSurveyListForCounsellors) {
        const row = d?.pretaaHealthSurveyListForCounsellors.map((el) => {

          return {
            issuedAt: formatDate({ date: el.issuedat, timeZone: 'UTC', formatStyle: 'agGrid-date'}),
            issuedTime: formatDate({ date: el.issuedat, timeZone: 'UTC', formatStyle: 'agGrid-time'}),
            createdAt: formatDate({ date: el.createdat, formatStyle: 'agGrid-date'}),
            patients: el.patients,
            openPercentage: el.openpercentage,
            completePercentage: el?.completepercentage,
            createdByFullName: el.createdbyfullname,
            surveyTemplateId: el.surveytemplateid,
            surveyTemplateTitle: el.surveytemplatename,
            surveyId: el.surveyid,
            published: publishedStatus(el.published),
            isEditable: el.editable,
            facilityName: el.facilityName || 'N/A'
          };
        });
        setRowData(row);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    setRowData([]);
    dispatch(appSliceActions.setSelectedPatientRows([]));
    getAssesmentTempalteDetail({
      variables: {
        skip: 0,
        take: config.pagination.defaultTake,
        surveyTemplateId: String(templateId)
      },
    });
    // 
  }, [campaignType, templateId]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const onDelete = (id: string) => {
    setRowData((prev) => prev.filter(e => e.surveyId !== id));
  }

  return {
    handleGridReady,
    gridApi,
    rowData,
    loading,
    refetch,
    onDelete
  };
}
