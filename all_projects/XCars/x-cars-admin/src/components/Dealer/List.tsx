'use client';

import { DEALERS_LIST } from '@/graphql/dealersList.query';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Paper from '@mui/material/Paper';
import catchError from '@/lib/catch-error';
import { IPagination } from '@/interface/pagination.interface';
import { routes } from '@/config/routes';
import {
  DealerDetails,
  Status,
  TableColumnType,
  UserFilterInput,
} from '@/generated/graphql';

const List = () => {
  const router = useRouter();

  const [dealerList, setDealersList] = useState<{
    data: DealerDetails[];
    hasMore: boolean;
  }>({ data: [], hasMore: true });

  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 10,
  });

  const [getAllDealersCallBack, { loading, data }] = useLazyQuery(
    DEALERS_LIST,
    {
      onCompleted: (data) => {
        if (data.viewAllDealers.data) {
          const formattedData = data.viewAllDealers.data.map((detail) => ({
            id: detail.id,
            firstName: detail.firstName as string,
            lastName: detail.lastName as string,
            companyName: detail.companyName as string,
            location: detail.location as string,
            status: detail.status as string,
            email: detail.email as string,
            phoneNumber: detail.phoneNumber as string,
            totalActiveQuotation: detail?.totalActiveQuotation || 0,
            totalCars: detail?.totalCars || 0,
            totalPendingQuotation: detail?.totalPendingQuotation || 0,
          })) as DealerDetails[];

          setDealersList({
            data: formattedData,
            hasMore: formattedData.length === paginationModel.pageSize,
          });
        }
      },
      onError: (e) => catchError(e, true),
    }
  );

  const getColType = (field: string): TableColumnType => {
    switch (columns.find((col) => col.field === field)?.type) {
      case 'boolean':
        return TableColumnType.Boolean;
      case 'dateTime':
        return TableColumnType.Date;
      case 'singleSelect':
        return TableColumnType.Enum;
      case 'number':
        return TableColumnType.Number;
      default:
        return TableColumnType.String;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'Name',
      flex: 0.18,
      minWidth: 150,
      type: 'string',
      renderCell: function (params) {
        return (
          <>
            {params.row.firstName ? (
              <div>{`${params.row.firstName} ${params.row.lastName || ''}`}</div>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 0.18,
      minWidth: 150,
      type: 'string',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.18,
      minWidth: 150,
      type: 'string',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.18,
      minWidth: 150,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: Status.Pending, label: 'Pending' },
        { value: Status.Approved, label: 'Approved' },
        { value: Status.Onboarded, label: 'Onboarded' },
        { value: Status.Disabled, label: 'Disabled' },
      ],
      renderCell: function (params) {
        return (
          <div className="flex h-full flex-col justify-center">
            <div
              className={` ${statusColor(params.row.status)} text-xs w-fit text-center px-3 py-1 rounded-full text-white capitalize font-semibold tracking-wider`}
            >
              {params.row.status}
            </div>
          </div>
        );
      },
    },
    {
      field: 'totalPendingQuotation',
      headerName: 'Pending Quotations',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
    },
    {
      field: 'totalActiveQuotation',
      headerName: 'Active Cars',
      flex: 0.09,
      minWidth: 100,
      disableColumnMenu: true,
    },
    {
      field: 'totalCars',
      headerName: 'All Cars',
      flex: 0.09,
      minWidth: 100,
      disableColumnMenu: true,
    },
  ];

  const statusColor = (status: string) => {
    if (status === Status.Pending) return 'bg-yellow-500';
    else if (status === Status.Approved) return 'bg-orange-500';
    else if (status === Status.Onboarded) return 'bg-green-600';
    else if (status === Status.Disabled) return 'bg-red-500';
  };

  const rowCountRef = React.useRef(
    data?.viewAllDealers?.pagination?.total || 0
  );

  const rowCount = React.useMemo(() => {
    if (data?.viewAllDealers?.pagination?.total !== undefined) {
      rowCountRef.current = data?.viewAllDealers?.pagination?.total;
    }
    return rowCountRef.current;
  }, [data?.viewAllDealers?.pagination?.total]);

  const onFilterChange = React.useCallback(
    (filterOptions: GridFilterModel) => {
      console.log(filterOptions);
      const dealerFilter = filterOptions.items
        .filter((filterItem) => !!filterItem?.value?.length)
        .map((filterItem) => ({
          column: filterItem.field,
          operator: filterItem.operator,
          type: getColType(filterItem.field) as TableColumnType,
          value: filterItem.value,
        }));
      if (!!dealerFilter.length || !data?.viewAllDealers?.data?.length) {
        getAllDealersCallBack({
          variables: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            dealerFilter: dealerFilter as UserFilterInput[],
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAllDealersCallBack, paginationModel.page, paginationModel.pageSize]
  );

  useEffect(() => {
    getAllDealersCallBack({
      variables: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  // eslint-disable-next-line no-unused-vars
  function debounce(cb: (args: GridFilterModel) => void, delay = 1000) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any;
    return (args: GridFilterModel) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        cb(args);
      }, delay);
    };
  }

  const debounceCallBack = debounce((filterOptions: GridFilterModel) => {
    onFilterChange(filterOptions);
  });

  return (
    <section className="p-6 w-full flex flex-col h-full gap-6">
      <div className="font-semibold text-3xl text-teal-900">Dealers</div>
      <Paper className="w-full flex-1">
        <DataGridPro
          loading={loading}
          rows={dealerList.data}
          columns={columns}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          pageSizeOptions={[10, 50, 100]}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          filterMode="server"
          onFilterModelChange={(filterOptions) =>
            debounceCallBack(filterOptions)
          }
          pagination
          // sx={{ border: 0 }}
          onRowClick={(params) =>
            params.id &&
            router.push(
              routes.dashboard.children.dealerDetails.children.dashboard.path(
                String(params.id)
              )
            )
          }
          sx={{
            border: 0,
            '& .MuiDataGrid-row:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
            width: '100%',
            overflowX: 'auto',
          }}
        />
      </Paper>
    </section>
  );
};

export default List;
