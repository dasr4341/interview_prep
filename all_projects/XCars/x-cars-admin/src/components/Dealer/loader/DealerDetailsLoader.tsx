import React from 'react';
import Button from '../../Button/Button';

const BtnGrp = () => (
  <div className="flex gap-4 sm:w-80 w-full sm:ms-auto cursor-progress">
    <Button
      disabled={true}
      buttonType="formSubmit"
      className="my-0 text-gray-800 font-semibold bg-transparent border border-gray-400 py-2 w-fit"
    >
      Decline
    </Button>
    <Button
      disabled={true}
      buttonType="formSubmit"
      className="py-2 my-0 text-gray-800 font-semibold border border-transparent w-fit"
    >
      Approve
    </Button>
  </div>
);
export default function DealerDetailsLoader() {
  return (
    <div className="bg-white rounded-xl py-4 px-8 my-6 md:my-0">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <h1 className="text-gray-800 text-3xl font-semibold">Dealer details</h1>
        <BtnGrp />
      </div>
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

      <div className="mb-10 border border-gray-200 rounded-xl px-2 py-10 ">
        <h2 className="text-gray-800 text-xl font-semibold mb-5">
          Upload documents
        </h2>
        <div className=" flex flex-col gap-4">
          <div className=" flex flex-row justify-between">
            <div className="font-semibold w-2/6 py-1 px-2 border rounded-md  animate-pulse h-6 bg-gray-200"></div>
            <div className="font-semibold w-3/6 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
          </div>
          <div className=" flex flex-row justify-between">
            <div className="font-semibold w-2/6 py-1 px-2 border rounded-md  animate-pulse h-6 bg-gray-200"></div>
            <div className="font-semibold w-3/6 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
          </div>
          <div className=" flex flex-row justify-between">
            <div className="font-semibold w-2/6 py-1 px-2 border rounded-md  animate-pulse h-6 bg-gray-200"></div>
            <div className="font-semibold w-3/6 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
          </div>
        </div>
      </div>
      <BtnGrp />
    </div>
  );
}
