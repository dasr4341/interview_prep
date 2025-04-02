import dayjs from 'dayjs';
import React from 'react';

export default function StartDateCell({ data }: { data: any }) {
  return (
    <>
    <div>
      {dayjs(data.startDate).format('MM/DD/YY')}
    </div>
    </>
  );
}
