import React, { useEffect, useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import AgGrid from '../../../components/ag-grid/AgGrid';
import StatusCell, { CustomClientList } from './component/StatusCell';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { useLazyQuery } from '@apollo/client';
import { clientListAccountsQuery } from 'graphql/ownerListAccounts.query';
import { config } from 'config';
import catchError, { getGraphError } from 'lib/catch-error';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import { ClientListAccounts, ClientListAccountsVariables } from 'health-generatedTypes';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import EditCellPopOver from './component/EditCellPopOver';
import { useElementSize } from '@mantine/hooks';
import CustomSearchField from 'components/CustomSearchField';

export interface GridRowDataInterface {
  id: string;
  name: string | null;
  status: boolean;
  email: string | undefined;
  facilities: number | null;
  superAdminId?: string;
}

export default function ClientManagement() {
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [gridPagination, setGridPagination] = useState({
    prev: true,
    next: true,
  });
  const [paginationLoading, setPaginationLoading] = useState({
    prevLoad: false,
    nextLoad: false,
  });
  const [rowData, setRowData] = useState<GridRowDataInterface[]>([]);


  function updatedStatus(props: CustomClientList) {
    return (
      <StatusCell
        updatedRowValue={setRowData}
        props={props}
      />
    );
  }

  const [columnDefs] = useState<(ColDef | any)[]>([
    {
      field: 'name',
      headerName: 'Client Name',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear']
      }
    },
    {
      field: 'facilities',
      headerName: '# Of Facilities',
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['clear']
      }
    },
    { field: 'email', headerName: 'Super Admin Email', width: 230, filter: 'agTextColumnFilter', filterParams: {
      buttons: ['clear']
    }, sortable: true },
    { field: 'status', cellRenderer: updatedStatus, sortable: true },
    {
      field: '',
      sortable: false,
      filter: false,
      cellRenderer: EditCellPopOver,
      suppressColumnsToolPanel: true,
      suppressMovable: true,
      width: window.innerWidth < 640 ? '100' : 'auto',
    },
  ]);

  const [getClientsCallBack, { loading: detailsLoading, error: getClientError, data: clientListData }] = useLazyQuery<
    ClientListAccounts,
    ClientListAccountsVariables
  >(clientListAccountsQuery, {
    onCompleted: (c) => {
      if (!!c?.pretaaHealthAdminListAccounts.length) {
        gridApi?.api.hideOverlay();
        setGridPagination({
          next: c?.pretaaHealthAdminListAccounts.length === config.pagination.defaultAgGridTake,
          prev: true,
        });
        setRowData(() =>
          c.pretaaHealthAdminListAccounts.map((e) => {
            return {
              id: e.id,
              name: e?.name || 'N/A',
              status: e.status,
              email: e.superAdmin?.email || 'N/A',
              superAdminId: e.superAdmin?.id,
              facilities: e._count?.facilities ? Number(e._count.facilities) : 0,
            };
          }),
        );
      } else {
        setGridPagination({
          next: false,
          prev: false,
        });
        setRowData([]);
      }
    },
    onError: (e) => catchError(e, true),
  });

  function getClientData(skip: number) {
    getClientsCallBack({
      variables: {
        searchPhrase,
        skip,
        take: config.pagination.defaultAgGridTake,
      },
    });
  }

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
    getClientData(0);
  };

  function loadMore(type: 'prev' | 'next', e: any) {
    if (gridApi !== null) {
      let gridAPI = gridApi;
      gridAPI.api = e;
      setGridApi(gridAPI);
    }
    if (type === 'next') {
      getClientData(noOfPage * config.pagination.defaultTake);
      setNoOfPage((p) => p + 1);
      setPaginationLoading({ prevLoad: false, nextLoad: true });
    } else {
      getClientData((noOfPage - 2) * config.pagination.defaultTake);
      setNoOfPage((p) => p - 1);
      setPaginationLoading({ prevLoad: true, nextLoad: false });
    }
  }

  useEffect(() => {
    getClientData(0);
  }, [searchPhrase]);

  useAgGridOverlay({ detailsLoading, gridApi, list: clientListData?.pretaaHealthAdminListAccounts });

  const { ref, height } = useElementSize();
  const gridHeight = { height: window.innerHeight - height };

  return (
    <>
      <div className="flex flex-col flex-1">
        <div ref={ref}>
          <ContentHeader
            disableGoBack={true}
            className="lg:sticky">
            <div className="flex items-center justify-between pt-3 mb-5">
              <div>
                <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg pr-1 sm:pr-0">
                  Client Management
                </h1>
              </div>

              <div>
                <Link to={routes.owner.addNewClient.match}>
                  <Button className="whitespace-nowrap">Add</Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <CustomSearchField
                defaultValue={searchPhrase}
                onChange={setSearchPhrase}
              />
            </div>
          </ContentHeader>
        </div>

        <div
          className="px-6 py-5 md:py-10 lg:px-16 flex flex-col flex-1"
          style={gridHeight}>
          <AgGrid
            rowData={rowData}
            columnDefs={columnDefs}
            handleGridReady={handleGridReady}
            pagination={
              rowData.length < config.pagination.defaultAgGridTake
                ? null
                : {
                    onNextPage: (e) => loadMore('next', e),
                    onPrevPage: (e) => loadMore('prev', e),
                    page: noOfPage,
                    prevEnabled: noOfPage > 1 && gridPagination.prev,
                    nextEnabled: gridPagination.next,
                    prevLoading: detailsLoading && paginationLoading.prevLoad,
                    nextLoading: detailsLoading && paginationLoading.nextLoad,
                  }
            }
          />
          {getClientError && <ErrorMessageFixed message={getGraphError(getClientError.graphQLErrors).join(',')} />}
        </div>
      </div>
    </>
  );
}
