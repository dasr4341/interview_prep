import React, { useContext, useEffect, useState } from 'react';
import { Popup } from 'reactjs-popup';
import DatePicker from 'react-datepicker';

import { FacilityManagementContextData } from './FacilityManagementContext';
import Calendar from 'components/icons/Calendar';
import { config } from 'config';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

const contentStyle = {
  width: 'auto',
  borderColor: '#E5E5EF',
  padding: '0',
  borderRadius: '0.75rem 0.1rem 0.75rem 0.75rem',
};

export default function AgGridHeaderComponent(props: any) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the start and end dates of the previous month
  const startDateOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));
  const endDateOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDateOfPreviousMonth);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDateOfPreviousMonth);

  const { setStartDate, setEndDate } = useContext(FacilityManagementContextData);

  const [open, setOpen] = useState(false);

  const onChangeDate = (dates: any) => {
    const [start, end] = dates;
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    if (start) {
      setSelectedStartDate(start);
      setStartDate(start);
    }
    if (end) {
      setSelectedEndDate(end);
      setEndDate(end);
    }
  };

  useEffect(() => {
    if (selectedEndDate) {
      setOpen(false);
      setStartDate(selectedStartDate);
      setEndDate(selectedEndDate);
    }
  }, [selectedEndDate]);

  const [sortState, setSort] = useState<'asc' | 'desc' | null>(null)

  const onSortChanged = () => {
    if (!props.column.isSortAscending() && !props.column.isSortDescending()) {
      setSort(null);
    } else {
      setSort(props.column.isSortAscending() ? 'asc' : 'desc');
    }
  };

  const onSortRequested = (order, event) => {
    props.setSort(order, event.shiftKey);
  };

  useEffect(() => {
    props?.column?.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
  }, []);

  const headerSort = (event) => {
    if (!sortState || sortState === 'desc') {
      onSortRequested('asc', event)
    } else {
      onSortRequested('desc', event)
    }
  }

  let sort: any = null;

  sort = (
    <div style={{ display: 'inline-block' }}>
      {(sortState === 'desc') && (
        <div className='ag-header-icon ag-sort-ascending-icon'>
          <div
            onClick={(event) => onSortRequested('asc', event)}
            onTouchEnd={(event) => onSortRequested('asc', event)}
            className={`ag-icon ag-icon-desc`}>
            
          </div>
        </div>
      )}

      {sortState === 'asc' && (
        <div className='ag-header-icon ag-sort-descending-icon'>
          <div
            onClick={(event) => onSortRequested('desc', event)}
            onTouchEnd={(event) => onSortRequested('desc', event)}
            className={`ag-icon ag-icon-asc`}>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div className="ag-header-cell-text">
      <div className="ag-header-cell-comp-wrapper">
        {sort}
        <div className=" flex items-center justify-start space-x-2">
          <div  className='ag-header-cell-text cursor-pointer' onClick={(event) => headerSort(event)}>Active Patients</div>
          <div>
            <Popup
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              closeOnDocumentClick
              trigger={
                <div className="cursor-pointer mt-2 min-width-20">
                  <button>
                    <Calendar className="mt-2 ml-2 cursor-pointer" />
                  </button>
                </div>
              }
              position="bottom right"
              nested
              {...{ contentStyle }}>
              <div>
                <>
                  <DatePicker
                    dateFormat={config.dateFormat}
                    onChange={onChangeDate}
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    maxDate={new Date()}
                    selectsRange
                    inline
                    selected={selectedStartDate}
                    formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                    forceShowMonthNavigation={true}
                  />
                </>
              </div>
            </Popup>
          </div>
        </div>
      </div>
    </div>
  );
}
