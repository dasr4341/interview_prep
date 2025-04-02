import { DateRangeTypes } from '../../generatedTypes';

export const timeRange = [
    { value: DateRangeTypes.ALL, label: 'All' },
    { value: DateRangeTypes.ONE_DAY, label: '1 day' },
    { value: DateRangeTypes.WEEK_TO_DATE, label: 'Week to date' },
    { value: DateRangeTypes.ONE_WEEK, label: '1 week' },
    { value: DateRangeTypes.ONE_MONTH, label: '1 month' },
    { value: DateRangeTypes.THREE_MONTHS, label: '3 months' },
    { value: DateRangeTypes.SIX_MONTHS, label: '6 months' },
    { value: DateRangeTypes.ONE_YEAR, label: '1 year' },
    { value: DateRangeTypes.YEAR_TO_DATE, label: 'YTD' },
];

export const arrRange = [
    { value: [0, 25000], label: '0-25,000' },
    { value: [25001, 75000], label: '25,001-75,000' },
    { value: [75001, 150000], label: '75,001-150,000' },
    { value: [150001, 500000], label: '150,001-500,000' },
    { value: [0, 500001], label: '500,001+' }
];

export const employeesRange = [
    { value: [1, 500], label: '1-500' },
    { value: [501, 3000], label: '501-3,000' },
    { value: [3001, 10000], label: '3,001-10,000' },
    { value: [10001, 100000], label: '10,001-100,000' },
    { value: [0, 100001], label: '100,001+' }
];