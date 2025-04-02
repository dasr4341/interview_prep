import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { getAssessmentStatsExcelDownload } from 'graphql/getAssessmentStatsExcel.query';
import { AssessmentPatientsDischargeFilterTypes, AssessmentStatsExcelDownload, AssessmentStatsExcelDownloadVariables, ReportingDateFilter } from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import Button from 'components/ui/button/Button';
import downloadIcon from 'assets/icons/download_icon_blue.svg';
import { useParams } from 'react-router-dom';
import catchError from 'lib/catch-error';

export default function AssessmentStatsExcelDownloadExcel() {
  const assessmentFilter = useAppSelector((state) => state.app.assessmentFilter);
  const templateCodeData = useParams().templateCode;

  const [getExcel, { loading: excelLoading }] = useLazyQuery<AssessmentStatsExcelDownload, AssessmentStatsExcelDownloadVariables>(getAssessmentStatsExcelDownload, {
    onCompleted: (data) => {
      const link = document.createElement('a');
      link.href = data.pretaaHealthDownloadAssessmentReport.fileURL;
      link.click();
    },
    onError: (e) => catchError(e, true),
  });

  const patientsArray = assessmentFilter?.selectedPatients?.list?.map(el => ({ patientId: el.id }));
  function downloadAssessmentStatsExcel() {
    getExcel({
      variables: {
        all: assessmentFilter?.selectedPatients?.all,
        code: templateCodeData as string,
        filterMonthNDate: assessmentFilter?.selectedDayMonth?.dayMonth?.value as ReportingDateFilter,
        rangeStartDate: assessmentFilter?.selectedDayMonth?.dateRange?.startDate,
        rangeEndDate: assessmentFilter?.selectedDayMonth?.dateRange?.endDate,
        admittanceStatus: assessmentFilter?.selectedDischargeStatusTypes?.value as AssessmentPatientsDischargeFilterTypes,
        patients: patientsArray,
      }
    });
  }
  return (
    <div className='absolute top-5 right-5'>
      <Button
        disabled={excelLoading}
        loading={excelLoading}
        buttonStyle="other"
        testId="button"
        className='contents'
        onClick={() => downloadAssessmentStatsExcel()}>
        <img src={!excelLoading ? downloadIcon : ''} alt="" />
      </Button>
    </div>
  );
}
