import { ContentHeader } from 'components/ContentHeader';
import AgGrid from 'components/ag-grid/AgGrid';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { CommonColumnConfig } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery } from '@apollo/client';
import { getActiveUser } from 'graphql/activeUserList.query';
import { AdminActiveUserList, AdminActiveUserListVariables } from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useParams } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { formatDate } from 'lib/dateFormat';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

interface ActiveUserInterface {
  id: string;
  usersName: string | null;
  email: string;
  ofReports: number;
  ofCompletedAssessments: number;
}

export default function ActiveUserList() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the start and end dates of the previous month
  const startDateOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));
  const endDateOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));

  const [startDate, setStartDate] = useState<Date | null>(startDateOfPreviousMonth);
  const [endDate, setEndDate] = useState<Date | null>(endDateOfPreviousMonth);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<ActiveUserInterface[]>([]);
  const { facilityId } = useParams();

  const [getUsers, { loading: userLoading }] = useLazyQuery<AdminActiveUserList, AdminActiveUserListVariables>(
    getActiveUser,
    {
      onCompleted: (d) => {
        d.pretaaHealthAdminActiveUserList &&
          setRowData(
            () =>
              d.pretaaHealthAdminActiveUserList.map((u) => {
                return {
                  id: u.id,
                  usersName: u.fullName,
                  email: u.email,
                  ofReports: u.numberOfReports || 0,
                  ofCompletedAssessments: u.numberOfAssesmentCompleted || 0,
                };
              }) || [],
          );
      },
      onError: (e) => catchError(e, true),
    },
  );

  const columns: ColDef[] = [
    {
      field: 'usersName',
      headerCheckboxSelection: false,
      checkboxSelection: false,
      cellClass: 'lock-pinned capitalize',
      ...CommonColumnConfig,
    },
    {
      field: 'email',
      filter: 'agTextColumnFilter',
      sortable: true,
      filterParams: {
        buttons: ['clear'],
      }
    },
    {
      field: 'ofReports',
      headerName: '# Of Reports',
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['clear'],
      }
    },
    {
      field: 'ofCompletedAssessments',
      headerName: '# Of Completed Assessments',
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
      width: 320
    },
  ];

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  useAgGridOverlay({
    detailsLoading: userLoading,
    gridApi,
    list: rowData,
  });

  const onApply = () => {
    getUsers({
      variables: {
        facilityId: String(facilityId),
        startDate: formatDate({ date: startDate?.toString() }),
        endDate: formatDate({ date: endDate?.toString() }),
      },
    });
  };

  useEffect(() => {
    onApply();
  }, []);

  return (
    <>
      <ContentHeader title="Active Users">
        <div className="flex flex-col md:flex-row items-center flex-wrap xl:w-9/12 2xl:w-7/12">
          <div className="flex-1 flex flex-wrap">
            <div className="flex items-center pr-4 mb-2 md:w-1/2">
              <span className="w-32 mr-2 whitespace-nowrap">Start date:</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showYearDropdown
                dropdownMode="select"
                showMonthDropdown
                popperPlacement="auto"
                placeholderText="MM/DD/YYYY"
                wrapperClassName="date-picker"
                maxDate={new Date()}
                className="px-2 w-full rounded-md border-gray-400"
              />
            </div>
            <div className="flex items-center pr-4 mb-2 md:w-1/2">
              <span className="w-32 mr-2 whitespace-nowrap">End date: </span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showYearDropdown
                dropdownMode="select"
                showMonthDropdown
                popperPlacement="auto"
                placeholderText="MM/DD/YYYY"
                wrapperClassName="date-picker"
                minDate={startDate || null}
                maxDate={new Date()}
                className="px-2 w-full rounded-md border-gray-400"
              />
            </div>
          </div>
          <Button
            text="Apply"
            onClick={onApply}
            className="mb-2"
          />
        </div>
      </ContentHeader>

      <ContentFrame className="h-screen lg:h-full">
        <div className="h-screen lg:h-full">
          <AgGrid
            handleGridReady={handleGridReady}
            columnDefs={columns}
            rowData={rowData}
          />
        </div>
      </ContentFrame>
    </>
  );
}
