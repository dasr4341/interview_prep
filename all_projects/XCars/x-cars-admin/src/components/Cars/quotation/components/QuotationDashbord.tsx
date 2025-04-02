import { QuotationDetail } from '@/generated/graphql';
import React from 'react';

export default function QuotationDashbord({
  quotationDetails,
  amount,
  status,
  className,
}: {
  quotationDetails: QuotationDetail | null;
  amount: string | number;
  status: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-row justify-between items-center text-text-purple rounded-md my-1 px-4 py-2 ${className}`}
    >
      <div className=" flex flex-col ">
        <span className=" font-semibold text-md ">Rs.{amount} </span>
        <span className="text-sm mt-1">
          Validity - {quotationDetails?.validityDays} days
        </span>
      </div>
      <div className=" flex justify-center items-center gap-3 ">
        <div className=" bg-theme-purple flex py-2 px-4 font-normal rounded-md text-text-purple text-xs items-center ">
          {status}
        </div>
      </div>
    </div>
  );
}
