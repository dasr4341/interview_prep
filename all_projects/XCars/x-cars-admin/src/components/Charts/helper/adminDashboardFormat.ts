import dayjs from 'dayjs';

interface FormattedData {
  key: string;
  value: number;
}

export default function adminDashboardFormatData(
  data: Date[],
  year: string
): FormattedData[] {
  const groupedData: Record<string, number> = {};

  if (year === 'all') {
    // Step 1: Extract years and find the range
    const years = data.map((item) => dayjs(item).year());
    const minYear = Math.min(...years) - 1; // One year lower
    const maxYear = Math.max(...years) + 1; // One year upper

    // Step 2: Initialize all years with count 0
    for (let currentYear = minYear; currentYear <= maxYear; currentYear++) {
      groupedData[currentYear.toString()] = 0;
    }

    // Step 3: Increment counts for actual data years
    data.forEach((item) => {
      const yearKey = dayjs(item).format('YYYY');
      groupedData[yearKey] = (groupedData[yearKey] || 0) + 1;
    });
  } else {
    // Group by month within the specified year
    const start = dayjs(`${year}-01-01`);
    const end = dayjs(`${year}-12-31`);

    let current = start.startOf('month');
    // Initialize all months with 0 count
    while (current.isBefore(end) || current.isSame(end, 'month')) {
      const monthKey = current.format('MMM YYYY');
      groupedData[monthKey] = 0; // Initialize with 0
      current = current.add(1, 'month');
    }

    // Count the dates for each month
    data.forEach((item) => {
      const itemYear = dayjs(item).format('YYYY');
      if (itemYear === year) {
        const monthKey = dayjs(item).format('MMM YYYY');
        groupedData[monthKey] = (groupedData[monthKey] || 0) + 1;
      }
    });
  }

  // Convert grouped data to an array of objects
  const formattedData: FormattedData[] = Object.entries(groupedData).map(
    ([key, value]) => ({
      key,
      value,
    })
  );
  return formattedData;
}
