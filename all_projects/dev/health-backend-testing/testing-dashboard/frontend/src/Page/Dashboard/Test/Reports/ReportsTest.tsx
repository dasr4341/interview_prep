import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { DateInput } from '@mantine/dates';
import { Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { Select } from '@mantine/core';
import useReportTestData from './useReportTestData';
import { ReportFilterFormValues } from './ReportFilterFormValues.interface';
import dayjs from 'dayjs';
import ReportLogs from './ReportLogs';
import { messageData } from 'Lib/message.lib';
import { FixedErrorMessage } from 'Components/Messages/FixedErrorMessage';
import { ErrorMessage } from 'Components/Messages/ErrorMessage';

export default function ReportsTest() {
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    facilities,
    getReportsData,
    reportsDataLoading,
    tableColumns,
    tableRows,
    selectedFitbitUserId,
    setSelectedFitbitUserId,
  } = useReportTestData({ onError: setError });

  const form = useForm({
    initialValues: {
      date: '',
      facilityId: '',
    },

    validate: {
      date: (v) => (!v ? 'Required' : null),
      facilityId: (v) => (!v ? 'Required' : null),
    },
  });

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title='Report Filter Criteria'>
        <form
          onSubmit={form.onSubmit((values) =>
            getReportsData(values as unknown as ReportFilterFormValues)
          )}>
          <DateInput
            maxDate={dayjs(new Date()).subtract(1).toDate()}
            {...form.getInputProps('date')}
            label='Report Date'
            placeholder='Select Report Date'
          />

         {facilities.data && <Select
            searchable
            label='Facilities'
            placeholder='Select Facilities'
            data={facilities.data}
            {...form.getInputProps('facilityId')}
          />}

          {facilities?.loading && <div className=' mt-4'>{messageData.error.loading }</div>}

          <Group
            justify='flex-end'
            mt='md'>
            <Button
              type='submit'
              loading={reportsDataLoading}
              disabled={reportsDataLoading}>
              Submit
            </Button>
          </Group>
          {error && <ErrorMessage message={error} />}
        </form>
      </Modal>

      <div className='p-4 flex justify-between items-center'>
        <div className=' text-md font-bold  text-white uppercase tracking-wider'>Daily Reports</div>
        <Button  className='tracking-wider' onClick={open}>Filter</Button>
      </div>
      
      {/* Example using Grid's API */}

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className='ag-theme-quartz-dark'
        style={{
          width: '100%',
          backgroundColor: 'black',
          height: 'calc(100vh - 68px)'
        }}>
        
        {(!tableRows.length  || !!facilities.loading || !tableColumns.length) && (
          <div className=' w-fit p-4 rounded bg-gray-500 top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 relative text-center text-md '>
           {facilities.loading ? messageData.error.loading : messageData.error.filterNotApplied}
          </div>
        )}

        
        { ((!!tableRows.length || !!tableColumns.length) && !facilities.loading) &&  <AgGridReact
          rowData={tableRows} // Row Data for Rows
          columnDefs={tableColumns as any} // Column Defs for Columns
          defaultColDef={{
            sortable: true,
            filter: true,
          }} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
        />}
         {error && <FixedErrorMessage message={error} />}
      </div>
      <ReportLogs userId={selectedFitbitUserId} setUserId={setSelectedFitbitUserId} date={form.values.date} />
     
    </div>
  );
}
