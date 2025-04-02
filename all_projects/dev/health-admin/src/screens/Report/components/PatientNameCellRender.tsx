import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function PatientNameCellRender({ name, patientId } : { name: string | undefined | null, patientId: string }) {
  return (
    <Link to={routes.report.poorSurveyScores.build(patientId)} className=' text-pt-secondary'>{name || 'N/A'}</Link>
  );
}
