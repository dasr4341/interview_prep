'use client';
import { routes } from '@/config/routes';
import { ContactsDataInQuoteModel } from '@/generated/graphql';
import Link from 'next/link';

function getTimeFromDate(date: Date) {
  const newDate =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;
  const minDiff = Math.abs(Date.now() - newDate.getTime()) / (1000 * 60);
  const hourDiff = minDiff / 60;
  const dayDiff = minDiff / (60 * 24);
  const monthDiff = minDiff / (60 * 24 * 30);
  const yearDiff = minDiff / (60 * 24 * 30 * 12);
  if (yearDiff >= 1) {
    return Math.floor(yearDiff) + 'yrs ago';
  } else if (monthDiff >= 1) {
    return Math.floor(monthDiff) + 'mo ago';
  } else if (dayDiff >= 1) {
    return Math.floor(dayDiff) + 'd ago';
  } else if (hourDiff >= 1) {
    return Math.floor(hourDiff) + 'h ago';
  } else if (minDiff >= 1) {
    return Math.floor(minDiff) + 'm ago';
  }
  return 'just now';
}

export default function QuotesCards({
  count,
  quoteData,
}: {
  count: number;
  quoteData: ContactsDataInQuoteModel;
}) {
  return (
    <>
      {!!quoteData.contactMessage?.length && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-slate-100 rounded-md p-4 mb-2">
          <div className="flex flex-row w-full gap-3 justify-start items-start">
            <div className=" h-8 w-8 p-3 rounded-full flex justify-center items-center bg-gray-300 text-sm text-gray-500 font-semibold">
              {count}
            </div>
            <hr className="h-full bg-gray-600 border-gray-600 w-[1px]" />
            <div className="flex flex-1 flex-col gap-3 bg-slate-300 rounded-md p-2">
              <h3 className="px-2 py-1 text-xl text-slate-800 font-semibold">
                {quoteData.car?.companyName} | {quoteData.car.model} |{' '}
                {quoteData.car.launchYear}{' '}
                <Link
                  href={routes.buyCars.build(quoteData.car.id)}
                  className=" text-sm font-normal inline text-blue-500 w-fit underline underline-offset-2"
                >
                  View
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                  {quoteData.car.fuelType}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                  Owners- {quoteData.car.noOfOwners}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                  Reg. No- {quoteData.car.registrationNumber}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                  Run- {quoteData.car.totalRun}Kms
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                  {quoteData.car.transmission}
                </span>
              </div>
            </div>
          </div>
          <div
            className={` text-sm text-gray-800 flex flex-col gap-1.5 w-full max-h-40 overflow-y-auto`}
          >
            {quoteData.contactMessage?.map((e, i) => (
              <div
                key={i}
                className={`flex flex-col w-full px-2 py-1 rounded-md text-white ${i % 2 ? 'bg-orange-400' : 'bg-orange-500'}`}
              >
                <p className="text-sm">{e?.message}</p>
                <p className="self-end opacity-60 italic text-xs">
                  {getTimeFromDate(e?.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
