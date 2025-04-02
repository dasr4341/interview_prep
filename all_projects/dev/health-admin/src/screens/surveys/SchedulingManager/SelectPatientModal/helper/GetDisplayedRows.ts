import { GridApi } from '@ag-grid-community/core';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';

export function GetDisplayedRows(gridApi: GridApi) {
  const displayedRows: SentToPatientSelectedRows[] = [];

  for (let i = 0; i < (gridApi.getDisplayedRowCount() || 0); i++) {
    const rowNode = gridApi.getDisplayedRowAtIndex(i);

    const obj = {
      id: String(rowNode?.data.id || ''),
      userId: String(rowNode?.data.userId || ''),
      firstName: String(rowNode?.data.firstName || ''),
      lastName: String(rowNode?.data.lastName || ''),
      email: String(rowNode?.data.email || ''),
      gridRowId: String(i),
    };
    displayedRows.push(obj);
  }
  return displayedRows;
}