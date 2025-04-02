import React from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function CarDetailsGalleryLoader() {
  return (
    <div className=" flex flex-col">
      <div className=" flex flex-row justify-between items-center">
        <div>
          <div className="text-gray-900 text-lg font-semibold">
            Upload Documents
          </div>
          <p className=" text-xs text-gray-500 font-thin">
            Upload the cars related documents to proceed to next step
          </p>
        </div>

        <button
          disabled
          className=" flex flex-row items-center gap-2 px-3 tracking-wide text-gray-800 py-1 bg-blue-200 cursor-progress  text-md rounded-md "
        >
          <IoIosAddCircleOutline size={20} /> Add
        </button>
      </div>
      <hr className=" w-full bg-gray-300 mt-4" />

      <div className=" flex flex-row gap-4 flex-wrap mt-8">
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
        <div className="font-semibold w-1/4 py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
      </div>
    </div>
  );
}
