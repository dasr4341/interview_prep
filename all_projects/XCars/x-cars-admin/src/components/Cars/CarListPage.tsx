'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  getGridNumericOperators,
  GridColDef,
  GridFilterModel,
} from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_CARS } from '@/graphql/getAllCarsList.query';
import { toast } from 'react-toastify';
import { IPagination } from '@/interface/pagination.interface';
import { routes } from '@/config/routes';
import {
  CarStatus,
  FuelType,
  TableColumnType,
  CarsFilterInput,
} from '@/generated/graphql';
import { registrationNumberFormatter } from '@/helper/registrationNumberFormatter';
import { config } from '@/config/config';

interface ICarListData {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  registrationNumber: string;
  status: string;
  model: string;
  fuelType: string;
  totalRun: number;
}

export default function CarList() {
  const router = useRouter();
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();
  const [carsList, setCarsList] = useState<ICarListData[]>([]);
  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 10,
  });

  const [getAllCarsCallBack, { data, loading }] = useLazyQuery(GET_ALL_CARS, {
    onCompleted: (d) => {
      if (d.getCarsAdmin.data) {
        const carListData = d.getCarsAdmin.data.map((detail) => {
          return {
            id: detail.id,
            firstName: detail.user?.firstName as string,
            lastName: detail.user?.lastName as string,
            companyName: detail.companyName as string,
            registrationNumber: detail.registrationNumber as string,
            status: detail.status as string,
            model: detail.model as string,
            fuelType: detail.fuelType as string,
            totalRun: detail.totalRun as number,
          };
        });
        setCarsList(carListData as ICarListData[]);
      }
    },
    onError: (e) => toast.error(e.message),
  });

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

  const setFilterObject = (carFilter: CarsFilterInput[]) => {
    if (dealerId) {
      return [
        ...carFilter,
        {
          column: 'userId',
          operator: config.operators.isEquals,
          type: TableColumnType.String,
          value: dealerId,
        },
      ];
    }
    return [...carFilter];
  };

  const onFilterChange = React.useCallback(
    (filterOptions: GridFilterModel) => {
      const carFilter = filterOptions.items
        .filter((filterItem) => !!filterItem.value?.length)
        .map((filterItem) => {
          const type = getColType(filterItem.field);
          return {
            column: filterItem.field,
            operator: filterItem.operator,
            type: type as TableColumnType,
            value:
              type === TableColumnType.Number
                ? String(filterItem.value)
                : filterItem.value,
          };
        });

      if (!!carFilter.length || !data?.getCarsAdmin.data.length) {
        getAllCarsCallBack({
          variables: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            filter: setFilterObject(
              carFilter as CarsFilterInput[]
            ) as CarsFilterInput[],
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dealerId,
      getAllCarsCallBack,
      paginationModel.page,
      paginationModel.pageSize,
    ]
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
      minWidth: 200,
      renderCell: (params) => {
        return registrationNumberFormatter(
          params.row.registrationNumber as string
        );
      },
    },
    {
      field: 'firstName',
      headerName: 'Dealer Name',
      flex: 1,
      minWidth: 150,
      type: 'string',
      renderCell: (params) => {
        return (
          <div>
            {params.row.firstName} {params.row.lastName}
          </div>
        );
      },
    },
    {
      field: 'companyName',
      headerName: 'Company Name / Model',
      flex: 1,
      minWidth: 200,
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
      minWidth: 150,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: FuelType.Diesel, label: 'Disel' },
        { value: FuelType.Petrol, label: 'Petrol' },
        { value: FuelType.Electric, label: 'Electric' },
        { value: FuelType.Hybrid, label: 'Hybrid' },
      ],
    },
    {
      field: 'totalRun',
      headerName: 'Total Run (KMs) ',
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
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

  const rowCountRef = React.useRef(data?.getCarsAdmin.pagination?.total || 0);
  const rowCount = React.useMemo(() => {
    if (data?.getCarsAdmin.pagination?.total !== undefined) {
      rowCountRef.current = data?.getCarsAdmin.pagination?.total;
    }
    return rowCountRef.current;
  }, [data?.getCarsAdmin.pagination?.total]);

  useEffect(() => {
    getAllCarsCallBack({
      variables: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        filter: setFilterObject([]) as CarsFilterInput[],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, dealerId]);

  return (
    <section className="p-6 flex flex-col h-full gap-6 ">
      <div className="font-semibold text-3xl text-teal-900">Cars</div>
      <Paper className="w-full flex-1 overflow-scroll h-full">
        <DataGridPro
          loading={loading}
          rows={carsList}
          columns={columns}
          disableDensitySelector
          disableRowSelectionOnClick
          filterDebounceMs={300}
          disableColumnSelector
          pagination
          pageSizeOptions={[10, 50, 100]}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            border: 0,
            '& .MuiDataGrid-row:hover': {
              color: 'blue',
              cursor: 'pointer',
            },
            width: '100%',
            overflowX: 'auto',
          }}
          filterMode="server"
          onFilterModelChange={onFilterChange}
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
}
