import { formatInTimeZone } from "date-fns-tz";
import { config } from "../../../../config/config";
import { addDays } from 'date-fns'

export function getSchedularTimeForSplCase(startDate: Date, timeZone: string, trigger: {
  hr: number,
  min: number,
  sec?: number
}) {
  const result = [];

  const endDate = addDays(startDate, 1);
  endDate.setHours(trigger.hr);
  endDate.setMinutes(trigger.min);
  endDate.setSeconds(trigger?.sec || 0);

  result.push(formatInTimeZone(endDate, timeZone, config.timeFormat));

  const currentFacilityDateTime = new Date(formatInTimeZone(startDate, timeZone, config.timeFormat));

  if (currentFacilityDateTime.getHours() < trigger.hr || (currentFacilityDateTime.getHours() === trigger.hr && currentFacilityDateTime.getMinutes() < trigger.min)) {
    currentFacilityDateTime.setHours(trigger.hr);
    currentFacilityDateTime.setMinutes(trigger.min);
    currentFacilityDateTime.setSeconds(trigger?.sec || 0);

    result.push(formatInTimeZone(currentFacilityDateTime, timeZone, config.timeFormat));
  }
  return result;
}