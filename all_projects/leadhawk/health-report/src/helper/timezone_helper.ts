import { getTimezoneOffset } from 'date-fns-tz';

import { Timezone } from '../enum/enum.js';

export async function zoned_time(timezone: Timezone) {
  const offset = getTimezoneOffset(timezone);
  const zoneDateTime = new Date(new Date().getTime() + offset);

  return zoneDateTime;
}
