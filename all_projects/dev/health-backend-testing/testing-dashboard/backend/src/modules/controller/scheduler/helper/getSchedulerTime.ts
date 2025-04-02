import parser from 'cron-parser';

export function getSchedulerTime({ scheduler, timeZone, options }: {
    scheduler: string, timeZone: string, options: {
      currentDate: Date | string,
      endDate: Date | string,
      iterator: boolean
    } }) {
    const arr: string[] = [];
    
    const interval = parser.parseExpression(scheduler, options) as any;
  
    while (true) {
      try {
        const obj = interval.next();
        arr.push(new Date(obj.value.toString()).toUTCString());
      } catch (e) {
        break;
      }
    }
    return arr;
  }
  