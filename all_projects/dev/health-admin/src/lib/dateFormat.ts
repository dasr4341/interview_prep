import { config } from 'config';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface Props {
  date?: string | null | number;
  data?: any;
  timeZone?: string | null;
  formatStyle?: 'date' | 'date-time' | 'agGrid-date-time' | 'agGrid-date' | 'agGrid-time' | 'agGrid-date-filter';
}

export const formatDate = ({ date, data, timeZone, formatStyle }: Props) => {
  try {
    if (date) {
      let dd = new Date(date);
      if (isNaN(dd.getDate())) {
        dd = new Date(Number(date));
      }
      
      if (timeZone) {
        dd = utcToZonedTime(dd, timeZone);
      }

      if (formatStyle === 'date-time') {
        return format(dd, config.dateTimeFormat);
      } else if (formatStyle === 'agGrid-time') {
        return format(dd, config.timeFormat)
      } else if (formatStyle === 'agGrid-date-filter') {
        return format(dd, config.agGridDateFilterFormat);  
      } else if (formatStyle === 'agGrid-date-time') {
        return format(dd, config.agGridDateTimeFormat); 
      } else if (formatStyle === 'agGrid-date') {
        return format(dd, config.agGridDateFormat);  
      } else {
        return format(dd, config.dateFormat);
      }
    }
    return null;
  } catch (e: any) {
    console.error(e, data);
    return null;
  }
};


export const replaceTimeZone = (date?: string | null) => {
  if (date) {
    return date.replace('.000Z', '');
  }

  return new Date().toISOString();
};
