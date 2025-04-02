import React from 'react';

import { formatDate } from 'lib/dateFormat';
import { PretaaHealthEHRSearchCareTeamsNew } from './EmployeeList/EmployeeList';

export default function LastLogin({ data }: { data: PretaaHealthEHRSearchCareTeamsNew }) {
  return (
    <div>
      {formatDate({ date: data.lastLogin }) || 'N/A'}
    </div>
  );
}
