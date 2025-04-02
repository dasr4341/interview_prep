'use client';
import { GET_CAR_LIST_VIEWED_BY_USER } from '@/graphql/getCarListViewedByUser.query';
import { GET_CUSTOMER_DETAILS } from '@/graphql/getCustomersDetails.query';
import catchError from '@/lib/catch-error';
import { useQuery, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Paper } from '@mantine/core';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { IPagination } from '@/interface/pagination.interface';
import { useParams, useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { CarStatus, FuelType } from '@/generated/graphql';
import { registrationNumberFormatter } from '@/helper/registrationNumberFormatter';
import { getGridNumericOperators } from '@mui/x-data-grid';
import { DealerDetailsBox } from '../Cars/components/DealerDetailsBox';

export const UserDetails = () => {
  const { 'user-id': userId } = useParams<{
    'user-id': string;
  }>();
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 10,
  });
  const { data: userData } = useQuery(GET_CUSTOMER_DETAILS, {
    onError: (e) => catchError(e, true),
    variables: {
      userId,
    },
  });

  const [getCarList, { loading: carListLoading, data: carList }] = useLazyQuery(
    GET_CAR_LIST_VIEWED_BY_USER,
    {
      onError: (e) => catchError(e, true),
      variables: {
        userId,
      },
    }
  );
  const statusColor = (status: string) => {
    if (status === CarStatus.Pending) return 'bg-yellow-500';
    else if (status === CarStatus.Sold) return 'bg-orange-500';
    else if (status === CarStatus.Approved) return 'bg-green-600';
    else if (status === CarStatus.Disabled) return 'bg-red-500';
  };

  const columns: GridColDef[] = [
    {
      field: 'registrationNumber',
      headerName: 'Registration Number',
      flex: 1,
      renderCell: (params) => {
        return registrationNumberFormatter(
          params.row.registrationNumber as string
        );
      },
    },
    // {
    //   field: 'firstName',
    //   headerName: 'Dealer Name',
    //   flex: 1,
    //   type: 'string',
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {params.row.firstName} {params.row.lastName}
    //       </div>
    //     );
    //   },
    // },
    {
      field: 'companyName',
      headerName: 'Company Name / Model',
      flex: 1,
      type: 'string',
      renderCell: (params) => {
        return (
          <div>
            {params.row.companyName} / {params.row.model}
          </div>
        );
      },
    },
    {
      field: 'fuelType',
      headerName: 'Fuel Type',
      flex: 1,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: FuelType.Diesel, label: 'Disel' },
        { value: FuelType.Petrol, label: 'Petrol' },
        { value: FuelType.Electric, label: 'Electric' },
        { value: FuelType.Hybrid, label: 'Hybrid' },
      ],
    },
    // {
    //   field: 'leadType',
    //   headerName: 'Lead Type',
    //   flex: 1,
    // },
    {
      field: 'totalRun',
      headerName: 'Total Run (KMs) ',
      flex: 1,
      type: 'number',
      headerAlign: 'left',
      filterOperators: getGridNumericOperators().filter(
        (operator: { value: string }) =>
          operator.value === '>' ||
          operator.value === '<' ||
          operator.value === '='
      ),
      renderCell: function (params) {
        return <div className=" text-start">{params.row.totalRun}</div>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: CarStatus.Pending, label: 'Pending' },
        { value: CarStatus.Approved, label: 'Approved' },
        { value: CarStatus.Disabled, label: 'Disabled' },
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
  ];

  useEffect(() => {
    getCarList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="p-6 flex flex-col h-full gap-6 ">
      <div className="font-semibold text-3xl text-teal-900">User Details</div>
      {userData?.getCustomersDetails.data && (
        <DealerDetailsBox
          data={userData?.getCustomersDetails.data}
          className=" w-fit"
        />
      )}

      <div className="text-lg mt-10 font-extrabold text-gray-800 capitalize">
        Cars viewed by user{' '}
      </div>
      <Paper className="w-full flex-1 overflow-scroll max-h-[700px]">
        <DataGridPro
          loading={carListLoading}
          rows={carList?.getCarListViewedByUser.data || []}
          columns={columns}
          disableDensitySelector
          filterDebounceMs={300}
          disableColumnSelector
          disableRowSelectionOnClick
          pagination
          pageSizeOptions={[10, 50, 100]}
          rowCount={carList?.getCarListViewedByUser.pagination?.total || 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            border: 0,
            '& .MuiDataGrid-row:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
          filterMode="server"
          onRowClick={(params) =>
            params.id &&
            router.push(
              routes.dashboard.children.carDetails.children.dashboard.path(
                String(params.id)
              )
            )
          }
        />
      </Paper>
    </section>
  );
};
