import React, { useEffect, useState } from 'react';
import caretDown from '../../../../assets/icons/icon-filled-down.svg';
import { SelectDateRangeRelativelyOptionInterface } from '../interface/selectDateRangeRelatively.interface';


export default function GetMonthRageDropdown({ options, selectedOption, onClick }: {
  options: SelectDateRangeRelativelyOptionInterface[];
  selectedOption: SelectDateRangeRelativelyOptionInterface | null,
  onClick: (data: SelectDateRangeRelativelyOptionInterface) => void
}) {
  
  const [subDropdown, setSubDropdown] = useState(false);
  const [selectedMonthRange, setSelectedMonthRange] = useState<SelectDateRangeRelativelyOptionInterface | null>(selectedOption);
  
  useEffect(() => {
    setSelectedMonthRange(selectedOption);
  }, [selectedOption]);
  
  return (
    <div className=" p-2 mt-2">
    <div className="text-xs font-medium">Relative By</div>
    {/* --------------------------- Normal dropdown options ------------------ */}
    <div className=" flex flex-col bg-gray-100 rounded mt-1 ">
      <div
        className=" cursor-pointer  p-2  flex justify-between text-sm"
        onClick={() => setSubDropdown(!subDropdown)}>
          <span>{selectedMonthRange?.label || 'Select Relative By'}</span>
        <img
          src={caretDown}
          alt="filled-icon"
          style={{ rotate: subDropdown ? '180deg' : '0deg' }}
        />
      </div>
      {subDropdown && (
        <>
          <hr className=" bg-gray-300 h-0.5" />
          {options.map(data => {
            return (
              <div
                key={data.value}
                onClick={() => {
                  setSelectedMonthRange(data);
                  onClick(data);
                  setSubDropdown(false);
                }}
                className={`text-xsm ${selectedMonthRange?.value !== data?.value && 'hover:bg-gray-50'} font-normal  text-gray-150 p-2 cursor-pointer 
        ${
          selectedMonthRange?.value === data.value
            ? 'bg-pt-secondary text-white'
            : ''
        }`}>
                {data.label}
              </div>
            );
          })}
        </>
      )}
    </div>
    {/* --------------------------- Normal dropdown options Ends ------------------ */}
  </div>
  );
}
