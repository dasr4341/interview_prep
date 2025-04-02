'use client';
import { GET_CAR_BUNDLE } from '@/graphql/getCarBundle.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { Paper } from '@mantine/core';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IBundleDetail {
  amount: string | number;
  name: string;
}

const CarBundleDetails = () => {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const { 'bundle-id': bundleId } = useParams<{
    'bundle-id': string;
  }>();

  const [bundleDetails, setBundleDetails] = useState<IBundleDetail[]>([]);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [getBundleDetail, { data }] = useLazyQuery(GET_CAR_BUNDLE, {
    onCompleted: (d) => {
      if (d.getCarBundle.data) {
        const bundleArray = d.getCarBundle.data.bundledItems.map((detail) => ({
          id: detail.CarProduct.id,
          amount: detail.CarProduct.amount,
          name: detail.CarProduct.fileType,
        }));
        setBundleDetails(bundleArray as IBundleDetail[]);
      }
    },
    onError: (e) => catchError(e, true),
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product name', flex: 1, type: 'string' },
    {
      field: 'amount',
      headerName: 'Amount (in $)',
      flex: 1,
      type: 'string',
    },
  ];

  useEffect(() => {
    getBundleDetail({
      variables: {
        bundleId: bundleId,
        carId: carId,
      },
    });
    setDisabled(true);
  }, [bundleId, carId, getBundleDetail]);

  return (
    <section className="flex flex-col h-full gap-6 ">
      <div className="flex justify-between items-center w-full">
        <div className="font-semibold text-3xl text-teal-900 flex flex-col ">
          <span>{data?.getCarBundle.data?.fileType}</span>
          <span className="text-sm text-gray-600  font-bold">
            This bundle is sold for ${data?.getCarBundle.data?.amount}
          </span>
        </div>
        <button
          className={`bg-red-500 font-medium py-2 px-4 min-w-xs rounded-md border-red-500 text-white border 
              hover:text-red-500 hover:bg-white
              ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed  hover:text-red-500 ' : 'cursor-pointer '}`}
          disabled={disabled}
        >
          Delete Bundle
        </button>
      </div>
      <Paper className="w-full flex-1 overflow-scroll">
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          rows={bundleDetails}
          columns={columns}
          sx={{ border: 0 }}
          getRowId={(row) => `${row.id}`}
          disableColumnFilter
          disableColumnMenu
          hideFooterPagination
        />
      </Paper>
    </section>
  );
};

export default CarBundleDetails;
