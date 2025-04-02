import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@mantine/core';
import { ICellRendererParams } from 'ag-grid-community';
import CellRender from './CellRender';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { MenuModule } from '@ag-grid-enterprise/menu';

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  MenuModule,
  RowGroupingModule,
]);


export default function AgGridCellRender(props: ICellRendererParams) {
  const [modalState, setModalState] = useState(false);

  if ((props?.value)) {
    console.log((props?.value));
    
  }

  const close = () => setModalState(false);
  const open = () => setModalState(true);

  const [colDef, setColDef] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);


  useEffect(() => {
    if (props.value?.data?.length) {

      const formattedErrorList:any[] = [];

      const transformedRows = props.value.data.map(
        (row: { [key: string]: any }, rowIndex: number) => {
          const obj: { [key: string]: any } = {};

          Object.entries(row).forEach((rowField) => {
            const [key, value] = rowField;
            if (key.includes('error')) {
              const errorId =  ` ${value?.isErrorExist ? 'Row  - ' +  (rowIndex + 1) : 'No Error'}`;
                formattedErrorList.push({
                  errors: errorId,
                  ...value.dbData
                });
              obj[key] = errorId;
            } else {
              obj[key] = value;
            }
          });
          return obj;
        }
      );




      const colData: {
        field: string;
        headerName: string;
        cellRenderer?: (props: ICellRendererParams) => JSX.Element;
        rowGroup?: boolean;
        hide?: boolean;
      }[] = [];

      Object.keys(props.value.data[0]).forEach((key: string) => {
        colData.push({
          field: key,
          headerName: key.toUpperCase().replaceAll('_', ' '),
          cellRenderer: (p: ICellRendererParams) => <CellRender { ...{ ...p, colName: key, showData: true, customData: transformedRows } } />,
          rowGroup: key.includes('error'), hide: key.includes('error')
        });
      });

      setColDef(() => colData);
      setRows(() => [...transformedRows, ...formattedErrorList]);
    }
  }, [modalState, props]);

  const isGroupOpenByDefault = (params: any) => {
    return params.field === 'errors';
  };

  return (
    <div>
      {(props?.value?.data) && <Button className=' px-4 py-1' onClick={() => open()}>Show Data</Button>}
      <Modal
        fullScreen
        opened={modalState}
        onClose={() => close()}
        title='Patient Contacts'
        centered>
        <div
          className='ag-theme-quartz-dark'
          style={{ width: '100%', height: '90vh' }}>
         <AgGridReact
            rowData={rows} // Row Data for Rows
            columnDefs={colDef} // Column Defs for Columns
            isGroupOpenByDefault={isGroupOpenByDefault}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
            }}
            autoGroupColumnDef={{
              minWidth: 200,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
