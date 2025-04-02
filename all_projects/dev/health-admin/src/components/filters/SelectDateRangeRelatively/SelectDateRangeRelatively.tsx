import React, { useEffect, useRef, useState } from 'react';
import caretDown from '../../../assets/icons/icon-filled-down.svg';
import './_selectDateRangeRelatively.scoped.scss';
import GetDateRangePopup, { getDateBasedOnStartEndDate } from './components/GetDateRangePopup';
import GetMonthRageDropdown from './components/GetMonthRageDropdown';
import { format } from 'date-fns';
import { config } from 'config';
import {
  SelectDateRangeRelativelyOptionInterface,
  SelectedMonthNDateInfoInterface,
} from './interface/selectDateRangeRelatively.interface';
import messagesData from 'lib/messages';

export declare type SelectWithDatePopupPosition =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center';

function getInputFieldValue(
  startDate: string | null,
  endDate: string | null,
  inputFieldValue: SelectDateRangeRelativelyOptionInterface | null,
  selectedMonthNDateInfo: SelectedMonthNDateInfoInterface | null,
  loading?: boolean
) {
  if (loading) {
    return 'Loading ...';
  }
  if (selectedMonthNDateInfo?.selectedOption.value && !!selectedMonthNDateInfo.numberOfDays) {
    const label = selectedMonthNDateInfo?.selectedOption.label.split(' ');
    return `${label[0]} ${selectedMonthNDateInfo.numberOfDays} ${label[1]}`;
  }
  if (selectedMonthNDateInfo?.selectedOption.value) {
    return selectedMonthNDateInfo?.selectedOption.label;
  }
  if (startDate || endDate) {
    const dates = getDateBasedOnStartEndDate(startDate, endDate);
    return `${format(dates.startDate, config.dateFormat)} - ${format(dates.endDate, config.dateFormat)}`;
  }
  return inputFieldValue?.label ?? 'Select ... ';
}

export default function SelectDateRangeRelatively({
  options,
  className = '',
  leftPosition = {
    web: 'right top',
    mob: 'bottom center',
  },
  rightPosition = {
    web: 'right top',
    mob: 'bottom center',
  },
  maxDate,
  onApply,
  loading = false,
  defaultValue,
}: {
  options: SelectDateRangeRelativelyOptionInterface[];
  className?: string;
  rightPosition?: {
    web: SelectWithDatePopupPosition;
    mob: SelectWithDatePopupPosition;
  };
  leftPosition?: {
    web: SelectWithDatePopupPosition;
    mob: SelectWithDatePopupPosition;
  };
  maxDate?: Date | null;
  loading?: boolean;
  onApply: (
    dateRange: { startDate: Date | null; endDate: Date | null } | null,
    selectedCustomDateRange: SelectedMonthNDateInfoInterface | null,
    activeMenu: SelectDateRangeRelativelyOptionInterface | null
  ) => void;
    defaultValue: {
      rangeStartDate: null | string;
      rangeEndDate: null | string;
      inputFieldValue: SelectDateRangeRelativelyOptionInterface | null;
      selectedMonthNDateInfo: SelectedMonthNDateInfoInterface | null
  }
  }) {
  
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [inputFieldValue, setInputFieldValue] = useState<SelectDateRangeRelativelyOptionInterface | null>(defaultValue.inputFieldValue);
  const [startDate, setStartDate] = useState<Date | null>(defaultValue?.rangeStartDate ? new Date(defaultValue?.rangeStartDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(defaultValue?.rangeEndDate ? new Date(defaultValue.rangeEndDate) : null);
  const [selectedMonthNDateInfo, setSelectedMonthNDateInfo] = useState<SelectedMonthNDateInfoInterface | null>(defaultValue.selectedMonthNDateInfo);

  const errorRef = useRef<HTMLSpanElement | null>(null);
  const getMonthRageDropdownErrorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setStartDate(defaultValue?.rangeStartDate ? new Date(defaultValue?.rangeStartDate) : null);
    setEndDate((defaultValue?.rangeEndDate ? new Date(defaultValue.rangeEndDate) : null));
    setInputFieldValue(defaultValue.inputFieldValue);
    setSelectedMonthNDateInfo(defaultValue.selectedMonthNDateInfo);
  }, [defaultValue]);


  return (
    <>
      {isDropDownOpen && (
        <div
          className=" fixed top-0 bottom-0 left-0 right-0 bg-transparent "
          onClick={() => { setIsDropDownOpen(false);  }}></div>
      )}
      <div className={`relative  ${className} filter-z-index ${loading ? ' opacity-90 ' : ''} `}>
        <div className="absolute w-full top-0 filter-border  bg-white flex flex-col rounded-lg  ">
          <div
            className={`flex cursor-pointer ${isDropDownOpen && 'filter-border-b'}  ${
              loading ? '  cursor-wait ' : ''
            } flex-row justify-between px-1 py-0.5`}
            onClick={() => !loading && setIsDropDownOpen(!isDropDownOpen)}>
            <div
              className={`patient-search p-2 w-full cursor-pointer ${
                loading ? '  cursor-wait ' : ''
              }   appearance-none focus:outline-none focus:ring-0  focus:border-transparent ${
                options.length
                  ? 'placeholder-opacity-80 placeholder-black'
                  : 'placeholder-pt-primary placeholder-opacity-50'
              } capitalize `}
            >{getInputFieldValue(defaultValue.rangeStartDate, defaultValue.rangeEndDate, defaultValue.inputFieldValue, defaultValue.selectedMonthNDateInfo, loading)}</div>
            <img src={caretDown} />
          </div>

          {isDropDownOpen && (
            <div className="flex flex-col max-h-96  rounded-b-lg rounded-t-none  bg-white  overflow-auto w-full">
              {!!options.length && (
                <React.Fragment>
                  <div className="flex flex-col overflow-auto">
                    <GetDateRangePopup
                      resetSelectedOptions={() => {
                        setSelectedMonthNDateInfo(null);
                        setInputFieldValue(null);
                        getMonthRageDropdownErrorRef.current?.classList.add('hidden');
                        errorRef.current?.classList.add('hidden');
                      }}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      leftPosition={leftPosition}
                      rightPosition={rightPosition}
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={maxDate}
                    />
                    <hr />
                    <GetMonthRageDropdown
                      options={options}
                      selectedOption={inputFieldValue}
                      onClick={(data) => {
                        if (startDate !== null || endDate !== null) {
                          setStartDate(null);
                          setEndDate(null);
                        }
                        if (inputFieldValue?.value !== data.value) {
                          setInputFieldValue(data);
                          setSelectedMonthNDateInfo(null);
                        }
                        errorRef.current?.classList.add('hidden');
                      }}
                    />
                    <span
                      className="text-red-800 hidden text-xs mt-0.5 px-2"
                      ref={getMonthRageDropdownErrorRef}></span>

                    <div className="p-2">
                      {inputFieldValue?.list.map((data) => {
                        const label = data.numberFieldRequired ? data.label.split(' ') : [data.label];
                        return (
                          <div className=" flex flex-col pb-2 text-sm w-full" key={data.value}>
                            <div className=" flex flex-row items-center ">
                              <input
                                onChange={() => {
                                  setSelectedMonthNDateInfo({
                                    selectedOption: data,
                                    numberOfDays: null,
                                  });
                                  errorRef.current?.classList.add('hidden');
                                  getMonthRageDropdownErrorRef.current?.classList.add('hidden');
                                  errorRef.current?.classList.add('hidden');
                                }}
                                checked={selectedMonthNDateInfo?.selectedOption.value === data.value}
                                type="radio"
                                id={data.value}
                                name="relativeBy"
                              />
                              <label
                                htmlFor={data.value}
                                className=" ml-2">
                                {label[0]}
                              </label>
                              {data.numberFieldRequired && (
                                <input
                                  value={selectedMonthNDateInfo?.numberOfDays || ''}
                                  onChange={(e) => {
                                    errorRef.current?.classList.add('hidden');
                                    
                                    const value = e.target.value.trim();
                                    setSelectedMonthNDateInfo({
                                      selectedOption: data,
                                      numberOfDays: value,
                                    });

                                    if (!value.length || !errorRef.current) {
                                      return;
                                    }

                                    if (( Number(value) < 0) ) {
                                      errorRef.current?.classList.remove('hidden');
                                      errorRef.current.innerHTML = messagesData.errorList.positiveValueNeeded;
                                    } else if (!Number(value) || value.includes('.') || value.length !== String((Number(value) / 1)).length) {
                                      errorRef.current?.classList.remove('hidden');
                                      errorRef.current.innerHTML = messagesData.errorList.specialCharactersNotAllowed;
                                    }
                                  }}

                                  className=" rounded w-24 py-0.5 ml-2"
                                  type="number"
                                />
                              )}
                              {data.numberFieldRequired && (
                                <label
                                  htmlFor={data.value}
                                  className=" ml-2">
                                  {label[1] ?? ''}
                                </label>
                              )}
                            </div>
                            <span
                              className="text-red-800 hidden text-xs mt-1"
                              ref={errorRef}></span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    className="rounded-none  bg-yellow-600 
                    hover:bg-yellow-800 hover:text-black p-3 cursor-pointer mt-1 text-center font-normal "
                    onClick={() => {
                      if (inputFieldValue?.value && !selectedMonthNDateInfo && getMonthRageDropdownErrorRef.current) {
                        getMonthRageDropdownErrorRef.current.classList.remove('hidden');
                        getMonthRageDropdownErrorRef.current.innerHTML = 'Please select from the options below';
                        return;
                      }

                      if (
                        selectedMonthNDateInfo?.selectedOption.numberFieldRequired &&
                        !selectedMonthNDateInfo.numberOfDays &&
                        errorRef.current
                      ) {
                        errorRef.current.classList.remove('hidden');
                        errorRef.current.innerHTML = `Please enter number of ${ selectedMonthNDateInfo.selectedOption.label }`;
                        return;
                      }
                      
                      if (selectedMonthNDateInfo?.selectedOption.numberFieldRequired && ((Number(selectedMonthNDateInfo?.numberOfDays) <= 0) ||
                        (selectedMonthNDateInfo?.numberOfDays?.includes('.') ||
                          selectedMonthNDateInfo?.numberOfDays?.length !== String((Number(selectedMonthNDateInfo?.numberOfDays) / 1)).length))) {
                        return;
                      }

                      const dateRange = (startDate || endDate) ? { ...getDateBasedOnStartEndDate(startDate, endDate) } : null;
                      onApply(dateRange, selectedMonthNDateInfo, inputFieldValue);
                      setIsDropDownOpen(false);
                    }}>
                    Apply
                  </button>
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
