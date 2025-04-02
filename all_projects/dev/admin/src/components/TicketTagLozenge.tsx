import React from 'react';
import classNames from 'classnames';
import { TicketsFilterOptions, DateDataInterface, DaysOpenInterface } from 'interface/url-query.interface';
import { IoIosClose } from 'react-icons/io';
import dayjs from 'dayjs';

export function TicketTagLozenge({
  onChange,
  className,
  filterOption,
  daysOpenData,
  dateData,
}: {
  onChange?: any;
  className?: Array<string>;
  filterOption?: TicketsFilterOptions[];
  daysOpenData?: DaysOpenInterface;
  dateData?: DateDataInterface;
}): JSX.Element {
  const classes = classNames(
    `mr-1.5 font-bold focus:outline-none px-2.5 py-1 rounded-full text-xxs uppercase whitespace-nowrap
     text-gray-700 flex items-center ${className}`
  );

  return (
    <React.Fragment>
      {filterOption &&
        filterOption?.filter((x) => x.checked).map((item) => {
          return (
            <button type="button" className={classes} style={{ backgroundColor: '#E5E5EF' }}>
              {item?.label}
              <IoIosClose size="20" className="ml-2" onClick={() => onChange(item, null, null)} />
            </button>
          );
        })}
      {(daysOpenData?.from || daysOpenData?.to) && (
        <button type="button" className={classes} style={{ backgroundColor: '#E5E5EF' }}>
          Days Open : {daysOpenData?.from}
          {daysOpenData?.to ? `-${daysOpenData?.to}` : ''}
          <IoIosClose size="20" className="ml-2" onClick={() => onChange(null, daysOpenData, null)} />
        </button>
      )}
      {dateData?.startDate && dateData?.endDate && (
        <button type="button" className={classes} style={{ backgroundColor: '#E5E5EF' }}>
          Range : {dayjs(dateData?.startDate).format('MM/DD/YY')}
          {dateData?.endDate ? `-${dayjs(dateData?.endDate).format('MM/DD/YY')}` : ''}
          <IoIosClose size="20" className="ml-2" onClick={() => onChange(null, null, dateData)} />
        </button>
      )}
    </React.Fragment>
  );
}
