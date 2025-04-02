import { DateInput } from '@mantine/dates';
import { Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Modal } from '@mantine/core';
import { Select } from '@mantine/core';
import { ReportFilterFormValues } from '../Reports/ReportFilterFormValues.interface';
import dayjs from 'dayjs';
import { useSchedulerTestData } from './customHooks/useSchedulerTestData';
import StackedGroupChart from 'Lib/StackedGroupSeriesChart/StackedGroupChart';
import { useState } from 'react';
import { ErrorMessage } from 'Components/Messages/ErrorMessage';
import { FixedErrorMessage } from 'Components/Messages/FixedErrorMessage';
import { messageData } from 'Lib/message.lib';

export default function SchedulerFrequency() {
  const [modalState, setModalState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => setModalState(false);
  const open = () => setModalState(true);

  const { chartData, facilities, getSchedulerData, schedulerLoading } =
    useSchedulerTestData({
      onCompleted: () => close(),
      onError: (message: string | null) => setError(message)
    });
  

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
        opened={modalState}
        onClose={close}
        title='Report Filter Criteria'>
        <form
          onSubmit={form.onSubmit((values) =>
            getSchedulerData(values as unknown as ReportFilterFormValues)
          )}>
          <DateInput
            maxDate={dayjs(new Date()).subtract(1).toDate()}
            {...form.getInputProps('date')}
            label='Report Date'
            placeholder='Select Report Date'
          />

          {!facilities.loading && (
            <Select
              searchable
              label='Facilities'
              placeholder='Select Facilities'
              data={facilities.data || []}
              {...form.getInputProps('facilityId')}
            />
          )}
          {facilities.loading && <div className=' mt-4'>Loading ... </div>}

          <Group
            justify='flex-end'
            mt='md'>
            <Button
              type='submit'
              loading={schedulerLoading}
              disabled={schedulerLoading}>
              Submit
            </Button>
          </Group>
        </form>
        {error && <ErrorMessage message={error} />}
      </Modal>

      <div className='p-4 flex justify-between items-center'>
        <div className=' text-md font-bold  text-white uppercase tracking-wider'>Scheduler Chart Data</div>
        <Button  className='tracking-wider' onClick={() => open()}>Filter</Button>
      </div>



      <div
        style={{
          backgroundColor: 'black',
          width: '100%',
          height: 'calc(100vh - 68px)',
        }}>
        {(!chartData.data.length  || facilities.loading) && (
          <div className=' w-fit p-4 rounded bg-gray-500 top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 relative text-center text-md '>
            {facilities.loading ? messageData.error.loading : messageData.error.filterNotApplied}
          </div>
        )}
        {!!chartData.labels.length && (
          <StackedGroupChart
            loading={schedulerLoading}
            labels={chartData.labels}
            dataSet={chartData.data as any}
            yMax={chartData.maxLen}
          />
        )}
      </div>
      {error && <FixedErrorMessage message={error} />}
    </div>
  );
}
