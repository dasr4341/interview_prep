import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { NavigationHeader } from 'components/NavigationHeader';
import { SearchField } from 'components/SearchField';
import AgGrid from 'components/ui/ag-grid/AgGrid';
import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { getCustomersQuery } from 'lib/query/control-panel/get-customers';
import catchError from 'lib/catch-error';
import { GridApi, GridReadyEvent, ColDef } from '@ag-grid-community/core';
import StatusCell from './components/ControlPanelStatusCell';
import DateCell from './components/RenewalCell';
import StartDateCell from './components/StartDate';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function ControlPanelListScreen(): JSX.Element {
  let api: GridApi | null = null;
  const [searchText, setSearchText] = useState<string>('');
  const pageLimit = 1000;

  const [rowData, setRowData] = useState<any>();

  const columnDef = useMemo(() => ({
    filter: true,
    sortable: true,
    filterParams: {
      newRowsAction: 'keep',
      filterOptions: ['contains'],
      defaultOption: 'contains',
      suppressAndOrCondition: true,
    },
  }), []);
  const [columnDefs] = useState<ColDef[]>([
    { field: 'name', headerName: 'Client Name', ...columnDef },
    { field: '_count.users', headerName: 'Users', ...columnDef },
    { field: 'startDate', headerName: 'Start Date', ...columnDef, cellRenderer: 'startDate' },
    { field: 'renewalDate', headerName: 'Renewal Date', ...columnDef, cellRenderer: 'dateCell' },
    { field: 'isActive', headerName: 'Status', cellRenderer: 'statusCell', ...columnDef },
  ]);

  const [getCustomers] = useLazyQuery(getCustomersQuery, {
    onCompleted: (res) => {
      const newData = res?.pretaaAdminGetCustomers.map((customer: any) => {
        return {
          ...customer
        };
      });
      setRowData(newData);
    },
    onError: (error) => catchError(error),
  });


  const initData = async () => {
    try {
      api?.showLoadingOverlay();
      getCustomers();
      api?.hideOverlay();
    } catch (error) {
      api?.hideOverlay();
      console.log(error);
    }
  };

  const handleGridReady = (e: GridReadyEvent) => {
    api = e.api;
    initData();
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.controlPanelScreen.name,
    });
  }, []);

  return (
    <>
      
      
      <ContentHeader disableGoBack={true}>
        <div className="block md:flex lg:flex items-center">
          <NavigationHeader>Control Panel</NavigationHeader>
        </div>
        <div className="flex items-center space-x-4 my-2">
          <SearchField
            label={'Search...'}
            onSearch={(v) => {
              if (v !== searchText) {
                setSearchText(v);
                getCustomers({
                  variables: {
                    searchPhrase: v,
                    take: pageLimit,
                  }
                });
              }
            }}
          />
        </div>
      </ContentHeader>

      <ContentFrame className="py-0 lg:py-0 px-0 lg:px-0 flex flex-1 h-screen md:h-5/6">
        <AgGrid
          frameworkComponents={{
            statusCell: StatusCell,
            dateCell: DateCell,
            startDate: StartDateCell,
          }}
          gridStyle={{ height: '100%', width: '100%' }}
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
        />
      </ContentFrame>
    </>
  );
}
