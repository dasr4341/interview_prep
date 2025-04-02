import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { SelectWithDatePopupPosition } from '../SelectDateRangeRelatively';
import { dateContentStyle } from 'components/EventFilterToggler';
import { config } from 'config';
import { addDays, format, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}


export function getDateBasedOnStartEndDate(startDateArg: Date | string | null, endDateArg: Date | string | null) {
  const startDateP = startDateArg ? new Date(startDateArg) : null;
  const endDateP = endDateArg ? new Date(endDateArg) : null;

  let startDate = startDateP || new Date();
  let endDate = endDateP || new Date();

  if (startDateP && !endDateP) {
    endDate = addDays(startDateP, 1);
  }
  if (endDateP && !startDateP) {
    startDate = subDays(endDateP, 1);
  }
  
  return {
    startDate,
    endDate
  };
}

export default function GetDateRangePopup({
  leftPosition,
  rightPosition,
  startDate,
  endDate,
  maxDate,
  onStartDateChange,
  onEndDateChange,
  resetSelectedOptions,
}: {
  leftPosition: {
    web: SelectWithDatePopupPosition;
    mob: SelectWithDatePopupPosition;
  };
  rightPosition: {
    web: SelectWithDatePopupPosition;
    mob: SelectWithDatePopupPosition;
  };
  startDate: Date | null;
  endDate: Date | null;
  maxDate?: Date | null;
  onStartDateChange: React.Dispatch<React.SetStateAction<Date | null>>;
  onEndDateChange: React.Dispatch<React.SetStateAction<Date | null>>;
    resetSelectedOptions: () => void;
}) {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
    // 
  }, [window.innerWidth]);

  return (
    <div className="text-xs flex flex-col item-start justify-start p-2 font-semibold">
      <div className="text-xs font-medium">Date Range</div>
      <div className="opacity-80 flex flex-row space-x-1 items-center w-full mt-1">
        <Popup
          closeOnDocumentClick
          position={`${windowDimensions > 700 ? leftPosition.web : leftPosition.mob}`}
          trigger={
              <div className={`w-1/2 cursor-pointer text-sm text-center p-1 border rounded ${!startDate && ' uppercase font-light text-gray-150'}`}>
               {(startDate || endDate) ? format(getDateBasedOnStartEndDate(startDate, endDate).startDate, config.dateFormat) : config.dateFormat.toLowerCase()}
              </div>
          }
          nested
          contentStyle={{ ...dateContentStyle }}>
          <DatePicker
            maxDate={endDate || maxDate}
            dateFormat={config.dateFormat}
            wrapperClassName="date-picker"
            onChange={(dates) => {
                onStartDateChange(dates);
                resetSelectedOptions();
            }}
            selected={startDate}
            startDate={startDate}
            inline
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
            forceShowMonthNavigation={true}
          />
        </Popup>
        <span>-</span>
        <Popup
          closeOnDocumentClick
          position={`${windowDimensions > 700 ? rightPosition.web : rightPosition.mob}`}
          trigger={
            <div className={`w-1/2 text-sm cursor-pointer text-center p-1 border rounded ${!endDate && ' uppercase font-light text-gray-150'}`}>
              {(endDate || startDate) ? format(getDateBasedOnStartEndDate(startDate, endDate).endDate, config.dateFormat) : config.dateFormat.toLowerCase()}
            </div>
          }
          nested
          contentStyle={{ ...dateContentStyle }}>
          <DatePicker
            minDate={startDate}
            maxDate={maxDate}
            dateFormat={config.dateFormat}
            wrapperClassName="date-picker"
            onChange={(dates) => {
                onEndDateChange(dates);
                resetSelectedOptions();
            }}
            selected={endDate}
            startDate={endDate}
            inline
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
            forceShowMonthNavigation={true}
          />
        </Popup>
      </div>
    </div>
  );
}
