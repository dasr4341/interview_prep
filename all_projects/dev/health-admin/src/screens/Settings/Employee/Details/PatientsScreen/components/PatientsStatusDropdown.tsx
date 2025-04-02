import React from 'react';

export default function PatientsStatusDropdown() {
  return (
    <>
      <div className="flex justify-center">
        <div className="mb-3 w-28 xl:w-32">
          <select className="form-select appearance-none
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            transition
            ease-in-out
            m-0
            shadow-none
            focus:text-gray-700 focus:bg-white focus:border-gray-300 focus:shadow-none focus:outline-none" aria-label="Default select example">
              <option value='Active'>Active</option>
              <option value='Inactive'>Inactive</option>
          </select>
        </div>
      </div>
    </>
  );
}
