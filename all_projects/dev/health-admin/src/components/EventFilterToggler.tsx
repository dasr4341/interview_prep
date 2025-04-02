/*  */
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import iconFilter from 'assets/icons/icon_filter.svg';
import { TicketsFilterOptions, DaysOpenInterface, DateDataInterface } from 'interface/url-query.interface';
import DatePicker from 'react-datepicker';
import 'reactjs-popup/dist/index.css';
import './filterToggler.scss';
import Button from './ui/button/Button';
import Calendar from './icons/Calendar';
import { format } from 'date-fns';
import EventsFilterTogglerSkeletonLoading from 'screens/EventsScreen/skeletonLoading/EventsFilterTogglerSkeletonLoading';
import { config } from 'config';
import './EventFilterToggler.scss';
import { toast } from 'react-toastify';
import messagesData from 'lib/messages';

export function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}

const contentStyle = {
  width: 'auto',
  borderColor: '#E5E5EF',
  padding: '0',
  borderRadius: '0.75rem 0.1rem 0.75rem 0.75rem',
};
export const dateContentStyle = {
  width: 'auto',
  height: '0',
  boxShadow: 'none',
  padding: '0',
  border: '0',
};

export default function EventsFilterToggler({
  loading = false,
  selectedOptions,
  filterOptions,
  hideOptionLabel,
  onApplyChange,
  daysOpen,
  dateRange,
}: {
  loading?: boolean;
  filterOptions: TicketsFilterOptions[];
  selectedOptions?: TicketsFilterOptions[];
  defaultValue?: any;
  hideOptionLabel?: boolean;
  onApplyChange?: any;
  daysOpen?: DaysOpenInterface;
  dateRange?: DateDataInterface;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [optionList, setOptionList] = useState<TicketsFilterOptions[]>(filterOptions);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const startDateObj = startDate ? new Date(startDate) : new Date();
  const endDateObj = endDate ? new Date(endDate) : new Date();

  const [startDateVal, setStartDateVal] = useState(format(new Date(startDateObj), config.dateFormat));
  const [endDateVal, setEndDateVal] = useState(format(endDateObj, config.dateFormat));
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (filterOptions) setOptionList(filterOptions);
    if (!dateRange?.startDate && !dateRange?.endDate) {
      setStartDateVal(format(startDateObj, config.dateFormat));
      setEndDateVal(format(endDateObj, config.dateFormat));
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [filterOptions, daysOpen, dateRange]);

  const onChangeDate = (dates:any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start) {
      setStartDateVal(format(start, config.dateFormat));
    }
    if (end) {
      setEndDateVal(format(end, config.dateFormat));
    }
  };
  
  const closeModal = () => {
    setOpen(false);
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

  function changeOption(index: number) {
    setOptionList((e) => {
      return [
        ...e.map((o, i) => {
          if (i === index) {
            return {
              ...o,
              checked: !o.checked
            };
          }
          return o;
        })
      ];
    });
  }

  useEffect(() => {
    if (selectedOptions && filterOptions) {
      setSelected(selectedOptions, filterOptions);
    } else {
      setOptionList(filterOptions);
    }
  }, [filterOptions, selectedOptions]);

  const onChangeVariables = () => {
    onApplyChange({
      optionList,
      startDate: startDate ? format(new Date(Number(startDateObj)), config.dateFormat) : '',
      endDate: endDate ? format(new Date(Number(endDateObj)), config.dateFormat) : '',
    });
    setOpen(false);
  };

  const onApply = () => {
    if (startDate) {
      if (!endDate) {
        toast.error(messagesData.errorList.endDate);
      } else {
        onChangeVariables();
      }
    } else {
      onChangeVariables();
    }
  };

  return (
    <>
      <Popup
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        closeOnDocumentClick
        onClose={closeModal}
        trigger={
          <div className="cursor-pointer mt-2 min-width-20">
            <button>
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
                      <label htmlFor="" className="flex flex-col lg:flex-row items-center text-base font-medium">
                        <p className="text-sm font-medium">Date Range</p>{' '}
                        <div
                          className="ml-4 flex flex-row border-gray-300
                        border rounded range-date-field items-center">
                          <div className="opacity-30">
                            <input className="w-20 sm:w-24 text-sm text-center px-0 sm:px-2
                             py-2 border-0 rounded bg-transparent" type="text" value={String(startDateVal)} disabled />
                             -{' '}
                            <input className="w-20 sm:w-24 text-sm text-center px-0 sm:px-2 py-2 border-0 rounded bg-transparent" type="text" value={String(endDateVal)} disabled />
                          </div>
                          <Calendar className="mt-2 ml-2 cursor-pointer" />
                        </div>
                      </label>
                    </div>
                  }
                  nested
                  contentStyle={{ ...dateContentStyle }}>
                  <DatePicker
                    dateFormat={config.dateFormat}
                    selected={startDate}
                    wrapperClassName="date-picker"
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    selectsRange
                    inline
                    formatWeekDay={nameOfDay => nameOfDay.substring(0, 3)}
                    forceShowMonthNavigation={true}
                  />
                </Popup>
              </div>
            </>
          )}
          <div>
            {/* incase we need a loading gif */}
            {/* it will be activated - only if we pass a loading prop */}
            {loading && <EventsFilterTogglerSkeletonLoading />}

            {!loading &&
              optionList.map((option, index) => {
                if (option.section) {
                  return (
                    <div key={option.label} className="text-gray-600 text-sm font-semibold pt-4 uppercase pl-3 pr-3">
                      {option.label}
                    </div>
                  );
                } else {
                  return (
                    <div className="p-3 max-w-xs mx-auto border-b last:border-0" key={option.label}>
                      <label data-testid="eventFilterOption" className="flex items-center space-x-3 uppercase">
                        <input
                          type="checkbox"
                          value={option.value}
                          defaultChecked={option?.checked}
                          className={`appearance-none h-5 w-5 border
                    border-primary-light
                    checked:bg-primary-light checked:border-transparent
                    rounded-md form-tick`}
                          onChange={() => changeOption(index)}
                        />
                        <span className="text-primary font-semibold text-xs">{option.label}</span>
                      </label>
                    </div>
                  );
                }
              })}
          </div>
          <Button text="Apply" classes={['w-full', 'rounded-t-none']} onClick={() => onApply()} />
        </div>
      </Popup>
    </>
  );
}
