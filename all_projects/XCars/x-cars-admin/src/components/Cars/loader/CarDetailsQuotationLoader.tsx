import React from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';

export default function CarDetailsQuotationLoader() {
  return (
    <div className=" flex flex-col">
      <div className=" flex flex-row justify-between items-center">
        <div>
          <div className="text-gray-700 text-lg font-semibold">
            Raise Quotation
          </div>
        </div>

        <button
          disabled
          className=" flex flex-row items-center gap-2 px-3 tracking-wide text-gray-800 py-1 bg-blue-200 cursor-progress  text-md rounded-md "
        >
          <IoIosAddCircleOutline size={20} /> Quotation
        </button>
      </div>
      <hr className=" w-full bg-gray-300 mt-4" />

      <div className="font-semibold mt-4 w-full py-1 px-2 border rounded-md  animate-pulse h-16 bg-gray-200"></div>
    </div>
  );
}
