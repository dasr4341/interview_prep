/* eslint-disable no-unused-vars */
'use client';
import Paper from '@mui/material/Paper';
import { GridColDef } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useQuery } from '@apollo/client';
import { GET_CAR_VIEWERS_LIST } from '@/graphql/getCarViewersList.query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { IPagination } from '@/interface/pagination.interface';
import { routes } from '@/config/routes';

export default function CarViewerList() {
  const { 'car-detail': carId } = useParams<{ 'car-detail': string }>();
  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 20,
  });
  const { data, loading } = useQuery(GET_CAR_VIEWERS_LIST, {
    variables: {
      carId: carId,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'userId',
      headerName: 'User',
      flex: 0.16,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div>
            {params.row.userId ? (
              <Link
                href={routes.dashboard.children.userList.children.userDetails.path(
                  params.row.userId
                )}
                className="text-blue-600 underline bg-gray-100 px-4 py-2 text-sm rounded-full underline-offset-2"
              >
                {params.row?.user?.firstName} {params.row?.user?.lastName}
              </Link>
            ) : (
              <span className="bg-gray-100 px-4 py-2 text-sm rounded-full">
                Not registered
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'latestViewedAt',
      headerName: 'Latest Viewed At',
      flex: 0.16,
      minWidth: 160,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.row.latestViewedAt).toString().substring(0, 25)}
          </div>
        );
      },
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      flex: 0.2,
      minWidth: 200,
      disableColumnMenu: true,
    },
    {
      field: 'viewsCount',
      headerName: 'Views Count',
      flex: 0.1,
      minWidth: 100,
      disableColumnMenu: true,
    },
    {
      field: 'userAgent',
      headerName: 'User Agent',
      flex: 0.38,
      minWidth: 300,
      disableColumnMenu: true,
    },
  ];

  const rowCountRef = useRef(data?.getCarViewers.pagination?.total || 0);
  const rowCount = useMemo(() => {
    if (data?.getCarViewers.pagination?.total !== undefined) {
      rowCountRef.current = data?.getCarViewers.pagination?.total;
    }
    return rowCountRef.current;
  }, [data?.getCarViewers.pagination?.total]);

  return (
    <section className="p-6 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <h3 className="font-semibold text-3xl text-teal-900 capitalize">
          viewers list
        </h3>
      </div>

      <Paper className="w-full flex-1 overflow-scroll remove-checkbox">
        <DataGridPro
          getRowId={(row) => row.ipAddress}
          loading={loading}
          rows={data?.getCarViewers.data || []}
          columns={columns}
          rowCount={rowCount}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 50, 100]}
          paginationMode="server"
          sx={{
            border: 0,
            '& .MuiDataGrid-row:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
          }}
        />
      </Paper>
    </section>
  );
}
