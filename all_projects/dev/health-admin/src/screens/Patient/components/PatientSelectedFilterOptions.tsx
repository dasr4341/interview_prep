import React from 'react';
import { BsX } from 'react-icons/bs';

export default function PatientSelectedFilterOptions({ label, changeSelectedOptions }: { label: string, changeSelectedOptions: (label?: any) => void }) {
  return (
    <button className="flex items-center rounded-full bg-gray-350 px-5 py-2 text-xs whitespace-nowrap mb-3 sm:mb-0">
      {label} <div onClick={() => changeSelectedOptions(label)}><BsX className="text-xmd" /></div>
    </button>
  );
}
