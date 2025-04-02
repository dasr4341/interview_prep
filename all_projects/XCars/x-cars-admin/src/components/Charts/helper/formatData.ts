import { DealerRange } from '@/generated/graphql';
import dayjs from 'dayjs';

interface IPropsData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function formatDataForChart(
  data: IPropsData[],
  dateRange: DealerRange
) {
  const start = dayjs(dateRange.start);
  const end = dayjs(dateRange.end);
  const diffDays = end.diff(start, 'day');
  const groupedData: Record<string, number> = {};

  if (diffDays <= 31) {
    // Group by Day
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dayKey = current.format('D MMM');
      groupedData[dayKey] = 0; // Initialize to 0
      current = current.add(1, 'day');
    }
    data.forEach((item) => {
      const dayKey = dayjs(item.createdAt).format('D MMM');
      groupedData[dayKey] = (groupedData[dayKey] || 0) + 1;
    });
  } else if (diffDays > 31 && diffDays <= 366) {
    // Group by Month
    let current = start.startOf('month');
    while (current.isBefore(end) || current.isSame(end, 'month')) {
      const monthKey = current.format('MMM YYYY');
      groupedData[monthKey] = 0; // Initialize to 0
      current = current.add(1, 'month');
    }
    data.forEach((item) => {
      const monthKey = dayjs(item.createdAt).format('MMM YYYY');
      groupedData[monthKey] = (groupedData[monthKey] || 0) + 1;
    });
  } else {
    // Group by Year
    let current = start.startOf('year');
    while (current.isBefore(end) || current.isSame(end, 'year')) {
      const yearKey = current.format('YYYY');
      groupedData[yearKey] = 0; // Initialize to 0
      current = current.add(1, 'year');
    }
    data.forEach((item) => {
      const yearKey = dayjs(item.createdAt).format('YYYY');
      groupedData[yearKey] = (groupedData[yearKey] || 0) + 1;
    });
  }

  const formattedData = Object.entries(groupedData).map(([key, value]) => ({
    key,
    value,
  }));
  return formattedData;
}
