import { config } from 'config';
import { format } from 'date-fns';
import React from 'react';

export default function DateTimeFormat({ inputDate }: { inputDate: string }) {
  const date = new Date(inputDate);
  const outputDateNew = format(date, `${config.dateFormat} ${config.timeFormat}`);

  return (
    <>{outputDateNew}</>
  );
}