import React from 'react';
import relativeTime from  'dayjs/plugin/relativeTime';
import advancedFormat from  'dayjs/plugin/advancedFormat';
import isBetween from  'dayjs/plugin/isBetween';
import dayjs from  'dayjs';

export default function DateFormat({
  date,
}: {
  date: string;
}) {
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);
  dayjs.extend(isBetween);


  const currentDate = dayjs();
  const sevenDayAgo = dayjs().subtract(7, 'day');
  const twentyFourHourAgo = dayjs().subtract(24, 'hour');
  const isInDay = dayjs(date).isBetween(currentDate, dayjs(twentyFourHourAgo));
  const isInWeek = dayjs(date).isBetween(currentDate, dayjs(sevenDayAgo));

  
  let formattedDate = date;
  if (isInDay) {
    formattedDate =  dayjs(dayjs(date)).fromNow().replace(' hours', 'h');
    formattedDate =  formattedDate.replace('an hour ago', '1h ago');
    formattedDate =  formattedDate.replace('a minute ago', '1m ago');
    formattedDate =  formattedDate.replace(' minutes', 'm');
    
  } else if (isInWeek) {
    formattedDate =  dayjs(dayjs(date)).format('dddd');
  } else {
    formattedDate = dayjs(date).format('MM/DD/YY');
  }

  return (
    <>
      {formattedDate}
    </>
  );
}
