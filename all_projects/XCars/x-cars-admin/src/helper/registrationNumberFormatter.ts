import { config } from '@/config/config';

export function registrationNumberFormatter(regNo: string) {
  const match = config.regex.registrationNumberFormatter.exec(regNo);
  let formattedNumber = '';

  if (match) {
    if (match.groups?.NORMAL) {
      formattedNumber = `${match.groups.A} ${match.groups.B} ${match.groups.C} ${match.groups.D}`;
    } else if (match.groups?.BHARAT) {
      formattedNumber = `${match.groups.E} ${match.groups.F} ${match.groups.G} ${match.groups.H}`;
    }
  }
  return formattedNumber;
}
