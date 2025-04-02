import React from 'react';

export default function QuotationRowLoader() {
  return (
    <div className=" flex flex-row justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2">
      <div className=" flex flex-col ">
        <div className=" h-4 w-16 animate-pulse bg-gray-300  rounded-md  font-semibold  "></div>
        <div className=" h-6 w-24 animate-pulse  bg-gray-300 rounded-md  mt-2"></div>
      </div>
      <div className=" flex animate-pulse h-4 w-6 bg-gray-300  rounded-md  justify-center items-center gap-3 "></div>
    </div>
  );
}
