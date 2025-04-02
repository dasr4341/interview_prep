import React from 'react';

export default function DealerDashboardLoader() {
  return (
    <div className="bg-white rounded-xl flex flex-col gap-3 py-4 px-8 my-6 md:my-0">
      <h1 className="text-gray-800 text-3xl font-semibold">Dealer details</h1>
      <div className="flex gap-3 w-full">
        <div className="bg-blue-300 bg-opacity-25 my-8 rounded-lg w-full h-28 animate-pulse"></div>
        <div className="bg-blue-300 bg-opacity-25 my-8 rounded-lg w-full h-28 animate-pulse"></div>
        <div className="bg-blue-300 bg-opacity-25 my-8 rounded-lg w-full h-28 animate-pulse"></div>
      </div>
      <div className="flex gap-8 w-full">
        <div className="bg-pink-200 bg-opacity-25 my-8 rounded-lg w-full h-52 animate-pulse"></div>
        <div className="bg-pink-200 bg-opacity-25 my-8 rounded-lg w-full h-52 animate-pulse"></div>
        <div className="bg-pink-200 bg-opacity-25 my-8 rounded-lg w-full h-52 animate-pulse"></div>
      </div>
    </div>
  );
}
