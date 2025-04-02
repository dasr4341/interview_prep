import React from 'react';
import { QuotationDetail, QuotationStatus } from '@/generated/graphql';

export default function QuotationRow({
  status,
  className,
  quotationDetails,
}: {
  status?: QuotationStatus | null;
  className?: string;
  quotationDetails: QuotationDetail | null;
}) {
  const getDaysRemaining = () => {
    const currentDate = new Date();
    const end = new Date(quotationDetails?.expiryDate);
    const remainingTime = end.getTime() - currentDate.getTime();
    if (remainingTime < 0) return '';
    const minDiff = remainingTime / (1000 * 60);
    if (minDiff < 60) return `${minDiff.toFixed(0)} min remaining`;
    const hourDiff = remainingTime / (1000 * 60 * 60);
    if (hourDiff < 24)
      return `${hourDiff.toFixed(0)} hour${hourDiff === 1 ? '' : 's'} remaining`;
    const dayDiff = remainingTime / (1000 * 60 * 60 * 24);
    return `${dayDiff.toFixed(0)} day${dayDiff === 1 ? '' : 's'} remaining`;
  };

  return (
    <div
      className={`my-4 p-2 border border-gray-300 border-x-0 border-t-0 ${className}`}
    >
      <div className=" flex justify-between items-center ">
        <div>
          <span className="font-bold text-medium text-gray-700">
            {' '}
            {quotationDetails?.amount} {quotationDetails?.currency}
          </span>
        </div>
        <div className=" flex gap-2 items-center">
          <span
            className={`w-fit ${status === QuotationStatus.Expired || !getDaysRemaining() ? 'bg-gray-100 text-red-600' : 'bg-gray-200 text-blue-600'} px-3 font-bold py-0.5 rounded-md text-xs h-fit`}
          >
            {!getDaysRemaining() ? 'EXPIRED' : status}
          </span>
          {status === QuotationStatus.Active && getDaysRemaining() && (
            <div className="w-fit px-3 font-bold py-0.5 rounded-md text-xs bg-gray-200 text-blue-600 h-fit">
              {getDaysRemaining()}
            </div>
          )}
        </div>
      </div>

      <div className=" my-2 flex justify-start items-center gap-2 flex-wrap max-w-sm">
        <div className=" bg-gray-200 text-blue-600 rounded-lg px-2 py-0.5 w-fit ">
          <span className=" font-normal text-sm tracking-wide">
            Started On:
          </span>
          <span className=" font-medium text-sm">
            {' '}
            {new Date(quotationDetails?.startDate)
              .toLocaleDateString()
              .replaceAll('/', '.') || 'N/A'}
          </span>
        </div>

        <div className=" bg-gray-200 text-blue-600 rounded-lg px-2 py-0.5 w-fit">
          <span className=" font-normal text-sm tracking-wide">
            Expires On:
          </span>
          <span className=" font-medium text-sm">
            {' '}
            {new Date(quotationDetails?.expiryDate)
              .toLocaleDateString()
              .replaceAll('/', '.') || 'N/A'}
          </span>
        </div>

        <div className=" bg-gray-200 text-blue-600 rounded-lg px-2 py-0.5 w-fit">
          <span className=" font-normal text-sm tracking-wide capitalize">
            Validity:
          </span>
          <span className=" font-medium text-sm">
            {' '}
            {quotationDetails?.validityDays} day(s)
          </span>
        </div>

        <div className=" bg-gray-200 text-blue-600 rounded-lg px-2 py-0.5 w-fit">
          <span className=" font-normal text-sm tracking-wide capitalize">
            leads:
          </span>
          <span className=" font-medium text-sm">
            {' '}
            {quotationDetails?.noOfLeads}
          </span>
        </div>
      </div>
    </div>
  );
}
