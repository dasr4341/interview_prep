import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import caretDown from '../../../assets/icons/icon-filled-down.svg';
import './_selectWithDate.scoped.scss';
import { SelectBox } from 'interface/SelectBox.interface';
import Popup from 'reactjs-popup';
import Calendar from 'components/icons/Calendar';
import { config } from 'config';
import DatePicker from 'react-datepicker';
import { dateContentStyle } from 'components/EventFilterToggler';
import format from 'date-fns/format';
import { ReportingDateFilter } from 'health-generatedTypes';

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

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}
export default function SelectWithDate({
  disabled = false,
  options,
  defaultValue = {
    value: '',
    label: '',
  },
  placeholder = 'Select ...',
  className = '',
  loading,
  keyToShowDateRange,
  position = {
    web: 'right top',
    mob: 'bottom center',
  },
  maxDate,
  onApply,
}: {
    disabled?: boolean;
  placeholder?: string;
  options: SelectBox[];
  defaultValue?: SelectBox;
  className?: string;
  loading?: boolean;
  keyToShowDateRange?: ReportingDateFilter;
  position?: {
    web: SelectWithDatePopupPosition;
    mob: SelectWithDatePopupPosition;
  };
  maxDate?: Date;
  onApply: (
    value: SelectBox,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
  }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [inputFieldValue, setInputFieldValue] =
    useState<SelectBox>(defaultValue);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  function getDateRangePopup() {
    return (
      <Popup
        closeOnDocumentClick
        position={`${windowDimensions > 700 ? position.web : position.mob}`}
        trigger={
          <div className="text-xs flex flex-row cursor-pointer  item-center justify-between py-2 px-4 font-semibold date-range flex-wrap" >
            <div className="text-xs font-medium ">Date Range</div>
            <div
              className="flex flex-row w-full justify-between border-gray-300
      border rounded range-date-field items-center">
              <div
                className="opacity-30 w-10/12  justify-around  flex flex-row items-center">
                <div
                   style={{ 	textOverflow: 'ellipsis', wordBreak: 'keep-all' }}
                  className="w-28 xl:w-24 font-normal text-sm text-center overflow-hidden whitespace-nowrap px-1 py-2 border-0 rounded bg-transparent">
                  { format(startDate || new Date(), config.dateFormat)}
                  </div>
                -
                <div
                   style={{ 	textOverflow: 'ellipsis', wordBreak: 'keep-all' }}
                  className="w-28 xl:w-24 font-normal text-sm text-center px-1 py-2 overflow-hidden whitespace-nowrap border-0 rounded bg-transparent"
                >{ format(endDate || new Date(), config.dateFormat) }</div>
                
              </div>
              <Calendar className="mt-2 ml-2 w-4 sm:w-5 md:w-2/12  cursor-pointer" />
            </div>
          </div>
        }
        nested
        contentStyle={{ ...dateContentStyle }}>
        <DatePicker
          maxDate={maxDate}
          dateFormat={config.dateFormat}
          wrapperClassName="date-picker"
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
            setInputFieldValue({
              label: ReportingDateFilter.CUSTOM,
              value: ReportingDateFilter.CUSTOM,
            });
          }}
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
          forceShowMonthNavigation={true}
        />
      </Popup>
    );
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth]);

  useEffect(() => {
    if (JSON.stringify(inputFieldValue) !== JSON.stringify(defaultValue)) {
      setInputFieldValue(defaultValue);
    }
  }, [defaultValue]);

  useLayoutEffect(() => {
    if (inputRef.current) {
        inputRef.current.value = defaultValue.label;
      }
  }, [defaultValue]);



  useEffect(() => {
    const checkIfClickedOutside = (e:any) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (!startDate && !endDate) {
          setIsDropDownOpen(false);
        }
      }
    };
    document.addEventListener('click', checkIfClickedOutside);
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, [endDate, startDate]);


  return (
      <div className={`relative  ${className} filter-z-index`} ref={modalRef}>
        <div className="absolute w-full top-0 filter-border  bg-white flex flex-col rounded-lg  ">
          <div
            className={`flex ${
              isDropDownOpen ? 'filter-border-b' : ''
            } flex-row justify-between px-1 py-0.5 ${disabled ? ' cursor-not-allowed opacity-20' : 'cursor-pointer'}`}
            onClick={() => !disabled && setIsDropDownOpen(!isDropDownOpen)}>
            <input
              ref={inputRef}
              disabled={disabled}
              placeholder={loading ? 'Loading ...' : placeholder}
              type="text"
              className={`patient-search  w-full focus:outline-none focus:ring-0  focus:border-transparent
              ${disabled ? 'cursor-not-allowed' : ''}
              ${
                options.length
                  ? 'placeholder-opacity-80 placeholder-black'
                  : 'placeholder-pt-primary placeholder-opacity-50'
              } ${disabled ? ' cursor-not-allowed' : ''} capitalize `}
            />
            <img src={caretDown} alt='dropdwon' />
          </div>

          {!disabled && isDropDownOpen && (
            <div className="flex flex-col max-h-64  rounded-b-lg rounded-t-none  bg-white -left-0 -right-2  overflow-auto w-full">
              {!!options.length && (
              <React.Fragment>
                 <div className="flex flex-col overflow-auto">
                  {options.map((data, i) => {
                    // ----------------------------- Date Range Starts ---------------
                    if (
                      data.value.toLowerCase() === keyToShowDateRange ||
                      i === options.length - 1
                    ) {
                      return <React.Fragment key={data.value}>{getDateRangePopup()}</React.Fragment>;
                    }
                     
                    // ------------------------ Date Range Ends-----------------

                    // --------------------------- Normal dropdown options ------------------
                    return (
                      <div
                        key={data.value}
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                          setInputFieldValue(data);
                        }}
                        className={` border-b last:border-b-0  text-xsm font-normal  text-gray-150 p-4 cursor-pointer 
                        ${
                          inputFieldValue.value === data.value
                            ? 'bg-pt-secondary text-white'
                            : ''
                        }`}
                         >
                          {data.label}
                        </div>
                      );
                      // --------------------------- Normal dropdown options Ends ------------------
                    })}
                  </div>
                <button
                    className=" bg-yellow-600 p-3 cursor-pointer mt-1 text-center font-normal "
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = inputFieldValue.label;
                      }
                      if (inputFieldValue.value === ReportingDateFilter.CUSTOM) {
                        onApply(inputFieldValue, startDate || new Date(), endDate || new Date());
                      } else {
                        onApply(inputFieldValue, startDate, endDate);
                      }
                      setIsDropDownOpen(false);
                    }}>
                    Apply
                  </button>
                </React.Fragment>
              )}
              {!options.length && !loading && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  No Options
                </div>
              )}
              {loading && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">
                  Loading ...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
