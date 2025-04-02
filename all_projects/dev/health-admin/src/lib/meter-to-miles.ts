import { round } from 'lodash';

export function meterToMiles(m: number) {
  return round(0.00062137 * m, 2);
}
