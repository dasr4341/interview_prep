import React from 'react';

export default function LeadsRowLoading() {
  return (
    <div className=" w-full flex  justify-between items-start bg-gray-100 p-4 rounded-md ">
      <div className="flex flex-col gap-2 item-center">
        <div className=" w-8 bg-gray-300 animate-pulse rounded-md h-4"></div>
        <div className=" w-24  bg-gray-300 animate-pulse rounded-md h-4"></div>
      </div>

      <div className=" w-8  bg-gray-300 animate-pulse rounded-md h-4"></div>
    </div>
  );
}
