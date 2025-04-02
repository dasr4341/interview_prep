import dayjs from 'dayjs';
import React from 'react';

export default function DateCell({ data }: { data: any }) {
  return (
    <>
    <div>
      {dayjs(data.renewalDate).format('MM/DD/YY')}
    </div>
    </>
  );
}
