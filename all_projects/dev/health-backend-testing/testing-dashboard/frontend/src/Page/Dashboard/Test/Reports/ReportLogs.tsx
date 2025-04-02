import { Modal } from '@mantine/core';
import useReportLogs from './useReportLogs';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

interface ReportLogsModal {
  userId?: string | null;
  date?: string | null;
  setUserId: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}

export default function ReportLogs(props: ReportLogsModal) {
  const { rows, columns } = useReportLogs({ userId: props.userId, date: props.date });

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true
    }),
    []
  );

  return (
    <>
      <Modal
        fullScreen
        opened={Boolean(props.userId)}
        onClose={() => props.setUserId(null)}
        title='Report Logs'
        centered>
        <div
          className='ag-theme-quartz-dark'
          style={{ width: '100%', height: '90vh' }}>
          <AgGridReact
            rowData={rows} // Row Data for Rows
            columnDefs={columns} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='multiple' // Options - allows click selection of rows
            suppressContextMenu={true}
          />
        </div>
      </Modal>
    </>
  );
}
