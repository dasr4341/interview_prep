import React from 'react';

export default function CarDetailsLoader() {
  return (
    <div className="bg-white rounded-xl p-4 my-6 md:my-0">
      <div className="bg-blue-500 bg-opacity-25 my-8 rounded-lg p-2 md:p-5 h-28 animate-pulse"></div>
      <div className="flex justify-between gap-8 items-center flex-wrap px-2 my-5">
        <div>
          <span className="text-gray-600 text-sm ">Company Name</span>
          <br />
          <div className="text-gray-800 font-medium  animate-pulse rounded-md h-8 bg-gray-200"></div>
        </div>
        <div>
          <span className="text-gray-600 text-sm">Location/Area</span>
          <br />
          <div className="text-gray-800 font-medium  animate-pulse  rounded-md h-8 bg-gray-200"></div>
        </div>
        <div>
          <span className="text-gray-600 text-sm ">Status</span>
          <br />
          <div className="font-semibold text-xs py-1 px-8 border rounded-md  animate-pulse h-4 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
