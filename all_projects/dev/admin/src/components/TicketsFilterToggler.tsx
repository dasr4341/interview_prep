/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import iconFilter from 'assets/icons/icon_filter.svg';
import {
  TicketsFilterOptions,
  FilterRangeVariable,
  DaysOpenInterface,
  DateDataInterface,
} from 'interface/url-query.interface';
import { DateRangeTypes } from 'generatedTypes';
import { timeRange } from '../lib/constant/timeRange';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'reactjs-popup/dist/index.css';
import './filterToggler.scss';
import Button from './ui/button/Button';
import Calendar from './icons/Calendar';
import dayjs from 'dayjs';

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}

const contentStyle = {
  width: 'auto',
  borderColor: '#E5E5EF',
  padding: '0',
  borderRadius: '0.75rem 0.1rem 0.75rem 0.75rem',
};
const dateContentStyle = {
  width: 'auto',
  height: '0',
  boxShadow: 'none',
  padding: '0',
  border: '0',
};

export default function TicketsFilterToggler({
  selectedOptions,
  onChange,
  filterOptions,
  defaultValue,
  hideOptionLabel,
  onApplyChange,
  daysOpen,
  dateRange
}: {
  filterOptions: TicketsFilterOptions[];
  selectedOptions?: TicketsFilterOptions[];
  onChange?: (options: TicketsFilterOptions[], selectedTimeRange: DateRangeTypes) => void;
  defaultValue?: DateRangeTypes | null;
  hideOptionLabel?: boolean;
  onApplyChange?: any;
  daysOpen?: DaysOpenInterface;
  dateRange?: DateDataInterface
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<FilterRangeVariable | any>(null);
  const [optionList, setOptionList] = useState<TicketsFilterOptions[]>(filterOptions);
  const [daysOpenData, setDaysOpenData] = useState({
    from: '',
    to: '',
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const startDateObj = startDate ? new Date(startDate) : dayjs().subtract(30, 'day');
  const endDateObj = endDate ? new Date(endDate) : dayjs();

  const [startDateVal, setStartDateVal] = useState(dayjs(startDateObj).format('MM/DD/YY'));
  const [endDateVal, setEndDateVal] = useState(dayjs(endDateObj).format('MM/DD/YY'));
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (filterOptions) setOptionList(filterOptions);
    if (daysOpen) setDaysOpenData(daysOpen);
    if (!dateRange?.startDate && !dateRange?.endDate) {
      setStartDateVal(dayjs(startDateObj).format('MM/DD/YY'));
      setEndDateVal(dayjs(endDateObj).format('MM/DD/YY'));
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [filterOptions, daysOpen, dateRange]);

  const onChangeDate = (dates: any) => {
    const [start, end] = dates;
    const startDateValue = new Date(start);
    const endDateValue = new Date(end);
    const [startMonth, startDay, startYear] = [
      startDateValue.getMonth(),
      startDateValue.getDate(),
      startDateValue.getFullYear(),
    ];
    const [endMonth, endDay, endYear] = [endDateValue.getMonth(), endDateValue.getDate(), endDateValue.getFullYear()];
    setStartDateVal(
      `${startDay <= 9 ? '0' : ''}${startDay}/${startMonth <= 8 ? '0' : ''}${startMonth + 1}/${startYear}`
    );
    setEndDateVal(`${endDay <= 9 ? '0' : ''}${endDay}/${endMonth <= 8 ? '0' : ''}${endMonth + 1}/${endYear}`);
    setStartDate(start);
    setEndDate(end);
  };
  const closeModal = () => {
    setOpen(false);
    const selected = optionList.filter((option) => option.checked);
    if (onChange) {
      onChange(selected, selectedTimeRange?.value);
      setSelectedTimeRange(null);
    }
  };

  function setSelected(sOptions: TicketsFilterOptions[], list: TicketsFilterOptions[]) {
    const defaultList =
      list?.map((item) => ({
        ...item,
        checked: false,
      })) || [];
    if (sOptions?.length > 0 && Array.isArray(sOptions)) {
      sOptions.forEach((option) => {
        const index = defaultList.findIndex((o) => o.value === option.value);
        // If Found
        if (index > -1 && option.checked) {
          defaultList[index].checked = true;
        }
      });
      setOptionList(defaultList);
    } else {
      setOptionList(defaultList);
    }
  }

  function changeOption(index: number, e: any) {
    optionList[index].checked = e.target.checked as boolean;
    setOptionList(optionList);
  }

  useEffect(() => {
    if (selectedOptions && filterOptions) {
      setSelected(selectedOptions, filterOptions);
    } else {
      setOptionList(filterOptions);
    }
  }, [filterOptions, selectedOptions]);

  const handleRangeValue = () => {
    if (defaultValue) {
      const label = timeRange?.find((item) => item.value === defaultValue);
      if (label && Object.keys(label).length > 0) {
        setSelectedTimeRange(label);
      }
    }
  };

  useEffect(() => {
    handleRangeValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, open]);
  
  const onApply = () => {
    onApplyChange(optionList, daysOpenData, {
      startDate: startDate ? startDateObj.toISOString() : '',
      endDate: endDate ? endDateObj.toISOString() : '',
    });
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Popup
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        closeOnDocumentClick
        onClose={closeModal}
        trigger={
          <div className="cursor-pointer">
            <button role="event-filter">
              <img src={iconFilter} alt="filter" />
            </button>
          </div>
        }
        position="bottom right"
        nested
        {...{ contentStyle }}>
        <div>
          {!hideOptionLabel && (
            <>
              <div className="p-3 max-w-xs mx-auto border-b last:border-0 items-center flex justify-between">
                <Popup
                  closeOnDocumentClick
                  position={`${windowDimensions > 590 ? 'right top' : 'bottom center'}`}
                  trigger={
                    <div className="text-xs font-semibold">
                      <label htmlFor="" className="flex items-center text-base font-medium">
                        Range{' '}
                        <div
                          className="ml-4 flex flex-row border-gray-300
                        border rounded range-date-field items-center">
                          <div className="opacity-30">
                          <input
                            className="w-20 text-sm text-center px-1 py-2 border-0 rounded bg-transparent"
                            type="text"
                            value={String(startDateVal)}
                            disabled
                          />{' '}
                          -{' '}
                          <input
                            className="w-20 text-sm text-center px-1 py-2 border-0 rounded bg-transparent"
                            type="text"
                            value={String(endDateVal)}
                            disabled
                          />
                          </div>
                          <Calendar className="mt-2 ml-2" />
                        </div>
                      </label>
                    </div>
                  }
                  nested
                  contentStyle={{ ...dateContentStyle }}>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={startDate}
                    wrapperClassName="date-picker"
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                </Popup>
              </div>
            </>
          )}
          <div>
            {optionList.map((option, index) => {
              if (option.section) {
                return (
                  <div key={index} className="text-gray-600 text-sm font-semibold pt-4 uppercase pl-3 pr-3">
                    {option.label}
                  </div>
                );
              } else {
                return (
                  <div className="p-3 max-w-xs mx-auto border-b last:border-0" key={index}>
                    <label data-testid="option" className="flex items-center space-x-3 uppercase">
                      <input
                        type="checkbox"
                        value={option.value}
                        defaultChecked={option?.checked}
                        className={`appearance-none h-5 w-5 border
                    border-primary-light
                    checked:bg-primary-light checked:border-transparent
                    rounded-md form-tick`}
                        onChange={(e) => changeOption(index, e)}
                      />
                      <span className="text-primary font-semibold text-xs">{option.label}</span>
                    </label>
                  </div>
                );
              }
            })}
            <div className="flex justify-between items-center p-3">
              <label className="text-base font-medium">Days Open</label>
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  className="input w-16 mr-2 text-right"
                  name="from"
                  placeholder="0"
                  value={daysOpenData?.from}
                  onChange={(e) => {
                    setDaysOpenData({ ...daysOpenData, [e.target.name]: e.target.value });
                  }}
                />
                to
                <input
                  type="text"
                  className="input w-16 ml-2 text-right"
                  name="to"
                  placeholder="##"
                  value={daysOpenData?.to}
                  onChange={(e) => {
                    setDaysOpenData({ ...daysOpenData, [e.target.name]: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
          <Button text="Apply" classes={['w-full', 'rounded-t-none']} onClick={onApply} />
        </div>
      </Popup>
    </React.Fragment>
  );
}
