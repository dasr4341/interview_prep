import { ICellRendererParams } from '@ag-grid-community/core';
import AssessmentBiometricScale from '../../AssessmentBiometricScale';
import SeverityTypeComponent from './SeverityTypeComponent';
import ScoreComponent from './ScoreComponent';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import React from 'react';
import { useAppDispatch } from 'lib/store/app-store';
import { reportSliceActions } from 'lib/store/slice/assessment-report/assessment.slice';
import { formatDate } from 'lib/dateFormat';

export default function GridGenericColumn(props: ICellRendererParams) {
  const colId = props.column?.getColId() as string;
  const data = props.data;

  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(reportSliceActions.setSelectedCampaign(null));
  }

  return (
    <div> 
      {colId === 'name' && (
        <Link className='font-medium link capitalize' onClick={onClose}
          to={routes.patientSurvey.submittedSurvey.build(data.patientId, data.assignmentId)}>
        
          { data[colId] || 'N/A' }
        </Link>
      )}
      {colId === 'completed' && (
         <div>{formatDate({ date: data[colId]}) || 'N/A' }</div>
      )}
      {colId === 'biometricScore' && (
       <AssessmentBiometricScale biometricScore={Number(data[colId]?.value)} />
      )}
       {data[colId].percent && (
        <ScoreComponent value={data[colId]?.value} percent={data[colId]?.percent} info={data[colId]?.description} />
      )}
      {colId === 'severityType' && (
        <SeverityTypeComponent value={data[colId]?.value} description={data[colId].description} />
      )}
      {colId === 'facility' && (
        <>
          {data[colId] || 'N/A'}
        </>
      )}
    </div>
  );
}
