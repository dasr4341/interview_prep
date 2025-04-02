import React from 'react';

export default function RenewalDateCell({ data }: { data: any }) {
  return (
    <>
    <div>
        {data?.month}/{data?.day}/{data?.renewalyear}
      </div>
    </>
  );
}
