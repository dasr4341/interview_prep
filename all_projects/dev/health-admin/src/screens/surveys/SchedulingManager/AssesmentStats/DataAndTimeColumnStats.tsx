import React from 'react';

import { SurveyPatientStats } from './SurveyStatsModal';
import { formatDate } from 'lib/dateFormat';

export default function DataAndTimeColumnStats({ data }: {data: SurveyPatientStats}) {
  const formateFinishDate = formatDate({ date: data.finishDate })
  if (!data.finishDate || !data.finishTime) {
    return <div>N/A</div>
  } else if (data.finishDate) {
    return <div>{`${formateFinishDate + ',    '  +  data.finishTime}`}</div>
  }
}
