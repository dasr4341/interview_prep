import { ICellRendererParams } from '@ag-grid-community/core';

import { formatDate } from 'lib/dateFormat';

export default function GridOpenColumn(props: ICellRendererParams) {
  const colId = props.column?.getColId() as string;
  const data = props.data;

  return (
    <div> 
      {colId === 'name' && (
        <div className='capitalize'>
           { data[colId] || 'N/A' }
        </div>
      )}
      {colId === 'assigned' && (
          <div>{formatDate({ date: data[colId]}) || 'N/A'}</div>
      )}
    </div>
  );
}
