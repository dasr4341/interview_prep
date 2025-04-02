import { Button, Group, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Modal } from '@mantine/core';
import { Select } from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useRef, useState } from 'react';
import { DateInput } from '@mantine/dates';
import useKipuSourceSystem from './customHooks/useKipuSourceSystem';
import { ErrorMessage } from 'Components/Messages/ErrorMessage';
import { FixedErrorMessage } from 'Components/Messages/FixedErrorMessage';
import { messageData } from 'Lib/message.lib';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import RefreshIcon from 'Icons/RefreshIcon';

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  MenuModule,
  RowGroupingModule,
  SetFilterModule,
]);

export default function KipuSourceSystem() {
  const [modalState, setModalState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact<any>>(null);

  const close = () => setModalState(false);
  const open = () => setModalState(true);

  const { getFacilities, getSourceSystemData, facilities, tableData } =
    useKipuSourceSystem({
      onCompleted: close,
      onError: (message: string | null) => setError(message),
    });

  const form = useForm({
    initialValues: {
      startDate: '',
      endDate: '',
      facilityId: '',
      inPatient: true,
      discharged: true,
    },
    validate: {
      startDate: (v) => (!v ? 'Required' : null),
      endDate: (v) => (!v ? 'Required' : null),
      facilityId: (v) => (!v ? 'Required' : null),
    },
  });

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      const gridApi = gridRef.current.api;

      gridApi.exportDataAsExcel({
        processCellCallback(params) {
          const value = params.value;
          if (Array.isArray(value)) {
            return JSON.stringify(value);
          }
          if (typeof value === 'object' && value?.rawKipuData) {
            return JSON.stringify(value.rawKipuData);
          }
          return value === undefined ? '' : value;
        },
      });
    }
  }, []);

  const isGroupOpenByDefault = (params: any) => {
    return params.field === 'uId';
  };

  return (
    <div>
      <Modal
        opened={modalState}
        onClose={() => (!facilities.loading || !tableData.loading) && close()}
        title='Kipu Data Criteria'>
        <form
          onSubmit={form.onSubmit((values) => {
            const startDate = new Date(values.startDate);
            const endDate = new Date(values.endDate);
            getSourceSystemData({
              startDate: `${startDate.getFullYear()}-${
                startDate.getMonth() + 1
              }-${startDate.getDate()}`,
              endDate: `${endDate.getFullYear()}-${
                endDate.getMonth() + 1
              }-${endDate.getDate()}`,
              facilityId: values.facilityId,
              inPatient: values.inPatient,
              discharged: values.discharged,
            });
          })}>
          {!facilities.loading && (
            <>
              <div className=' flex flex-row  space-x-2 mb-4'>
                <DateInput
                  maxDate={dayjs(new Date()).subtract(1).toDate()}
                  {...form.getInputProps('startDate')}
                  label='Start Date'
                  placeholder='Select Start Date'
                />

                <DateInput
                  maxDate={dayjs(new Date()).toDate()}
                  {...form.getInputProps('endDate')}
                  label='End Date'
                  placeholder='Select End Date'
                />
              </div>
              <div className=' flex flex-row  justify-between items-end'>
                <Select
                  className=' w-10/12'
                  searchable
                  label='Facilities'
                  placeholder='Select Facilities'
                  data={facilities.data || []}
                  {...form.getInputProps('facilityId')}
                />
                <Button
                  onClick={() => getFacilities()}
                  bg='teal'
                  size='sm'
                  className=' px-3 py-2 '>
                  <RefreshIcon className=' w-4 h-4' />
                </Button>
              </div>
              <div className=' flex flex-row items-center space-x-4 mt-8 mb-8'>
                <Switch
                  defaultChecked
                  {...form.getInputProps('inPatient')}
                  label='In Patient'
                />
                <Switch
                   {...form.getInputProps('discharged')}
                  defaultChecked
                  label='Discharged'
                />
              </div>
            </>
          )}

          {facilities?.loading && (
            <>
              <div className=' flex flex-row  space-x-2 mb-4'>
                <div className=' mt-4 w-full bg-slate-700 py-4 animate-pulse rounded '></div>
                <div className=' mt-4 w-full bg-slate-700 py-4 animate-pulse rounded '></div>
              </div>
              <div className=' flex flex-row items-center space-x-2 justify-between '>
                <div className=' mt-4 w-9/12 bg-slate-700 py-4 animate-pulse rounded '></div>
                <div className=' mt-4 w-2/12 bg-slate-700 py-4 animate-pulse rounded '></div>
              </div>
            </>
          )}

          <Group
            justify='flex-start'
            mt='md'>
            <Button
              type='submit'
              loading={facilities.loading || tableData.loading}
              disabled={facilities.loading || tableData.loading}>
              Submit
            </Button>
          </Group>
        </form>
        {error && <ErrorMessage message={error} />}
      </Modal>

      <div className='p-4 flex justify-between items-center'>
        <div className=' text-md font-bold  text-white uppercase tracking-wider'>
          kipu Data
        </div>
        <div className=' flex items-center space-x-2 '>
          <Button
            disabled={!tableData.rows.length}
            bg={'green'}
            onClick={onBtExport}>
            Export to Excel
          </Button>
          <Button
            bg={'dark'}
            className='tracking-wider'
            onClick={() => open()}>
            Filter
          </Button>
        </div>
      </div>

      <div
        className='ag-theme-quartz-dark p-6'
        style={{
          width: '100%',
          backgroundColor: 'black',
          height: 'calc(100vh - 68px)',
        }}>
        {(!tableData.colDef.length || !!facilities.loading) && (
          <div className=' w-fit p-4 rounded bg-gray-500 top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 relative text-center text-md '>
            {facilities.loading
              ? messageData.error.loading
              : messageData.error.filterNotApplied}
          </div>
        )}

        {!!tableData.colDef.length && !facilities.loading && (
          <AgGridReact
            ref={gridRef}
            isGroupOpenByDefault={isGroupOpenByDefault}
            rowData={tableData.rows} // Row Data for Rows
            columnDefs={tableData.colDef as any} // Column Defs for Columns
            defaultColDef={{
              minWidth: 110,
              editable: true,
              sortable: true,
              filter: true,
              autoHeight: true,
            }}
            rowSelection='multiple' // Options - allows click selection of rows
          />
        )}
      </div>
      {error && <FixedErrorMessage message={error} />}
    </div>
  );
}
