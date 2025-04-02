'use client';
import { GET_LEADS_QUERY } from '@/graphql/getAdminLeads.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LeadFilterInput,
  LeadsStatus,
  LeadType,
  TableColumnType,
} from '@/generated/graphql';
import LeadAssignModal from './components/LeadAssignModal';
import Paper from '@mui/material/Paper';
import { GridColDef, GridFilterModel, GridRowParams } from '@mui/x-data-grid';
import { IPagination } from '@/interface/pagination.interface';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { registrationNumberFormatter } from '@/helper/registrationNumberFormatter';
import { config } from '@/config/config';

export interface ILeadsList {
  id: string;
  name?: string;
  firstName: string;
  phoneNumber?: string | null;
  registrationNumber?: string | null;
  message?: string;
  leadType: LeadType;
  leadStatus: LeadsStatus;
  dealerName?: string;
  dealerId: string;
  callCount: number;
}

export interface ISelectedRows {
  [key: string]: string[];
}

export default function LeadsList() {
  const router = useRouter();
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const [selectedRows, setSelectedRows] = useState<ISelectedRows | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [disableMultipleCheck, setDisableMultipleCheck] =
    useState<boolean>(false);
  const [leadsData, setLeadsData] = useState<ILeadsList[]>([]);
  const [paginationModel, setPaginationModel] = useState<IPagination>({
    page: 0,
    pageSize: 10,
  });

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'registrationNumber',
      headerName: 'Registration Number',
      flex: 1,
      minWidth: 200,
      renderCell: function (params) {
        const registrationNumber = registrationNumberFormatter(
          params.row.registrationNumber as string
        );
        return <div>{registrationNumber}</div>;
      },
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'callCount',
      headerName: 'Called ',
      flex: 1,
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'leadType',
      headerName: 'Type',
      flex: 1,
      minWidth: 150,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: LeadType.HotLead, label: 'Hot Lead' },
        { value: LeadType.Lead, label: 'Lead' },
      ],
      renderCell: (params) => (
        <div className="flex h-full flex-col justify-center">
          <div
            className={`${params.row.leadType === LeadType.HotLead ? 'bg-red-500' : 'bg-green-500'} text-xs w-24 text-center px-2 py-1 rounded-full text-white capitalize`}
          >
            {params.row.leadType.replace('_', ' ').toLowerCase()}
          </div>
        </div>
      ),
    },
    {
      field: 'leadStatus',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      type: 'singleSelect',
      sortable: false,
      valueOptions: [
        { value: LeadsStatus.Assigned, label: 'Assigned' },
        { value: LeadsStatus.Unassigned, label: 'Unassigned' },
      ],
    },
  ];

  const [getAllLeadsCallBack, { loading, data, refetch }] = useLazyQuery(
    GET_LEADS_QUERY,
    {
      onError: (e) => catchError(e, true),
    }
  );

  useMemo(() => {
    const leadsList =
      data?.getAdminLeads.data
        .filter((e) => !!e?.car?.userId)
        .map((lead) => {
          return {
            id: lead.id,
            firstName: `${lead.user?.firstName || ''} ${lead.user?.lastName?.length || ''}`,
            phoneNumber: lead.user?.phoneNumber,
            registrationNumber: lead.car?.registrationNumber,
            message: lead.contact?.contactMessage?.[0]?.message,
            leadType: lead.leadType,
            leadStatus: lead.status,
            dealerId: String(lead?.car?.userId),
            callCount: lead.callCount ?? 0,
            dealerName: `${lead.car?.user?.firstName} ${lead.car?.user?.lastName?.length ? lead.car?.user?.lastName : ''}`,
          };
        }) || [];

    setDisableMultipleCheck(
      !leadsList.filter((lead) => lead.leadStatus === LeadsStatus.Unassigned)
        .length
    );
    setLeadsData(() => leadsList);
  }, [data?.getAdminLeads]);

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

  const setFilterObject = (leadFilter: LeadFilterInput[]) => {
    if (carId) {
      return [
        ...leadFilter,
        {
          column: 'carId',
          operator: config.operators.isEquals,
          type: TableColumnType.String,
          value: carId,
        },
      ];
    } else if (dealerId) {
      return [
        ...leadFilter,
        {
          column: 'userId',
          operator: config.operators.isEquals,
          type: TableColumnType.String,
          value: dealerId,
        },
      ];
    }
    return [...leadFilter];
  };

  const onFilterChange = useCallback(
    (filterOptions: GridFilterModel) => {
      const leadFilter = filterOptions.items
        .filter((item) => !!item.value?.length)
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

      if (!!leadFilter.length || !data?.getAdminLeads.data.length) {
        getAllLeadsCallBack({
          variables: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            filter: setFilterObject(
              leadFilter as LeadFilterInput[]
            ) as LeadFilterInput[],
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel, getAllLeadsCallBack, dealerId, carId]
  );

  const rowCountRef = useRef(data?.getAdminLeads?.pagination?.total || 0);
  const rowCount = useMemo(() => {
    if (data?.getAdminLeads?.pagination?.total !== undefined) {
      rowCountRef.current = data?.getAdminLeads?.pagination?.total;
    }
    return rowCountRef.current;
  }, [data?.getAdminLeads?.pagination?.total]);

  useEffect(() => {
    getAllLeadsCallBack({
      variables: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        filter: setFilterObject([]) as LeadFilterInput[],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId, carId, paginationModel]);

  return (
    <section className="p-6 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <h3 className="font-semibold text-3xl text-teal-900">Leads</h3>
        <button
          onClick={() => setAssignModalOpen(true)}
          className={`bg-orange-500 hover:bg-orange-600 duration-300 text-white rounded-md px-4 py-1 ${selectedRows && Object.keys(selectedRows).length ? 'visible' : 'invisible'} tracking-wide`}
        >
          Assign to Dealer
        </button>
      </div>

      <Paper className="w-full flex-1 overflow-scroll">
        <DataGridPro
          className="no-header-checkbox"
          loading={loading}
          rows={leadsData}
          columns={columns}
          filterDebounceMs={300}
          disableDensitySelector
          disableColumnSelector
          pagination
          checkboxSelection
          hideFooterSelectedRowCount
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
          onRowClick={(params) => {
            router.push(`/dashboard/leads/${params.row.id}`);
          }}
          onRowSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRowData = leadsData
              .filter((row) => selectedIDs.has(row.id.toString()))
              .reduce((acc: ISelectedRows, curr) => {
                const id = `${curr.dealerId}_${curr?.dealerName}`;
                if (id in acc) acc[id].push(curr.id);
                else acc[id] = [curr.id];
                return acc;
              }, {});
            setSelectedRows(selectedRowData);
          }}
          isRowSelectable={(params: GridRowParams) =>
            params.row.leadStatus === LeadsStatus.Unassigned
          }
          disableMultipleRowSelection={disableMultipleCheck}
        />
      </Paper>

      <LeadAssignModal
        selectedRows={selectedRows}
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        refetch={refetch}
      />
    </section>
  );
}
