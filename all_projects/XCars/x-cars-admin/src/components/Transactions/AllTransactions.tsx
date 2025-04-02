import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import catchError from '@/lib/catch-error';
import { Paper } from '@mantine/core';
import { GridColDef, DataGrid, GridToolbar } from '@mui/x-data-grid';
import Link from 'next/link';
import { ALL_TRANSACTIONS } from '@/graphql/getAllPaymentHistory.query';
import { routes } from '@/config/routes';
import { Roles } from '@/generated/graphql';

const AllTransactions = () => {
  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt).toLocaleDateString();
        return <div>{date}</div>;
      },
    },
    {
      field: 'razorpayOrderId',
      headerName: 'Razorpay OrderId',
      flex: 2,
      minWidth: 200,
    },

    {
      field: 'amount',
      headerName: 'Amount INR',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'invoiceStatus',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'userId',
      headerName: 'User',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-col h-full justify-center items-start">
          <Link
            target="_blank"
            href={
              params.row.userRole === Roles.Dealer
                ? routes.dashboard.children.dealerDetails.children.dashboard.path(
                    params.row.userId
                  )
                : routes.dashboard.children.userList.children.userDetails.path(
                    params.row.userId
                  )
            }
            className="flex items-center justify-center gap-2 p-1 px-2 rounded-sm hover:bg-gray-200"
          >
            <div className=" text-blue-600 text-sm">{params.row.userName}</div>
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md">
              {params.row.userRole === Roles.Dealer ? 'Dealer' : 'User'}
            </span>
          </Link>
        </div>
      ),
    },
    {
      field: 'carId',
      headerName: 'Car',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          target="_blank"
          className=" text-blue-600 underline"
          href={routes.dashboard.children.carDetails.children.dashboard.path(
            params.row.carId
          )}
        >
          {params.row.carDetail}
        </Link>
      ),
    },
    {
      field: 'receipt',
      headerName: 'Receipt',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          target="_blank"
          className=" text-blue-600 underline"
          href={params.row.receipt}
        >
          {params.row.receipt}
        </Link>
      ),
    },
  ];

  const [getAllTransactionData, { data: dealerData, loading: dealerLoading }] =
    useLazyQuery(ALL_TRANSACTIONS, {
      onError: (e) => catchError(e, true),
    });

  useEffect(() => {
    getAllTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="p-6 flex flex-col h-full gap-6">
      <div className="font-semibold text-3xl text-teal-900">Transactions</div>
      {dealerLoading && (
        <div className=" bg-gray-300 w-full animate-pulse h-[400px] rounded-md "></div>
      )}

      {!dealerLoading && !dealerData?.getPaymentHistoryList?.data?.length && (
        <div className="text-center mt-10">No transactions found!!</div>
      )}

      {dealerData?.getPaymentHistoryList?.data?.length && (
        <Paper className="w-full flex-1 overflow-scroll">
          <DataGrid
            loading={dealerLoading}
            rows={dealerData?.getPaymentHistoryList.data || []}
            columns={columns}
            sx={{ border: 0, width: '100%', overflowX: 'auto' }}
            getRowId={(row) => `${row.id}`}
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooterPagination
            disableDensitySelector
            disableColumnSelector
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </Paper>
      )}
    </section>
  );
};

export default AllTransactions;
