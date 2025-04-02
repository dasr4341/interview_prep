import { formatDate } from "lib/dateFormat";

 // HELPER FOR DATE COMPARISON
 function monthToNum(date: string) {
  if (!date || date === 'N/A' || date === 'NA') {
    return null;
  }
  try {
    return +new Date(date);
  } catch (e) {
    return null;
  }
}

 // DATE COMPARATOR FOR SORTING
 export function dateComparator(date1: string, date2: string) {
  const date1Number = monthToNum(date1);
  const date2Number = monthToNum(date2);
   
  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return 1;
  }
  if (date2Number === null) {
    return -1;
  }

  return date2Number - date1Number;
}

export const agGridDefaultFilterComparator = (filterCurrentDate, cellValue) => {
  const formattedSelectedDate = formatDate({ date: cellValue, formatStyle: 'agGrid-date-filter'});

  if (formattedSelectedDate == null) {
    return 0;
  }

  // dates are stored as dd/mm/yyyy
  const dateParts = formattedSelectedDate.split('/');
  const year = Number(dateParts[2]);
  const month = Number(dateParts[1]) - 1;
  const day = Number(dateParts[0]);
  const cellDate = new Date(year, month, day);
  // Now that both parameters are Date objects, we can compare
  if (cellDate < filterCurrentDate) {
    return -1;
  } else if (cellDate > filterCurrentDate) {
    return 1;
  }
  return 0;
};