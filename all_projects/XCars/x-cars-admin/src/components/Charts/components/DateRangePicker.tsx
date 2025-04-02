import { Dispatch, SetStateAction } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { IDateRangeType } from '@/components/Cars/carDetails/CarDetailsPage';
interface IDateRangePicker {
  setState: Dispatch<SetStateAction<IDateRangeType>>;
  state: IDateRangeType;
}

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

export default function DateRangePickerComponent({
  setState,
  state,
}: IDateRangePicker) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DemoItem
          label={
            <span className="text-sm text-gray-600">Select Date Range</span>
          }
          component="DateRangePicker"
        >
          <DateRangePicker
            slotProps={{
              shortcuts: {
                items: shortcutsItems,
              },
              actionBar: { actions: [] },
              textField: {
                variant: 'outlined',
                size: 'small',
                inputProps: {
                  style: { padding: '8px 12px' },
                },
              },
            }}
            format="DD/MM/YYYY"
            value={[dayjs(state.start), dayjs(state.end)]}
            onChange={(newValue) =>
              setState({
                start: newValue[0] ? newValue[0].toDate() : null,
                end: newValue[1] ? newValue[1].toDate() : null,
              })
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                minWidth: '100px',
                fontSize: '0.875rem',
              },
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
