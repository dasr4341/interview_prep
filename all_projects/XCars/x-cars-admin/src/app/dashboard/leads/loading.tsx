import LeadsRowLoading from '@/components/Lead/components/LeadsRowLoading';
import React from 'react';

export default function Loading() {
  return (
    <section className=" px-8 py-8">
      <div className=" font-semibold text-3xl text-teal-900 mb-8 ">Leads</div>
      <div className="flex flex-col gap-3">
        {new Array(10).fill(<LeadsRowLoading />).map((e, i) => (
          <React.Fragment key={i}>{e}</React.Fragment>
        ))}
      </div>
    </section>
  );
}
