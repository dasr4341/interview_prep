import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { getFenceBreadPatientList } from 'graphql/getFenceBreadPatientList.query';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  PretaaHealthGetFenceBreachPatientsReport,
  PretaaHealthGetFenceBreachPatientsReportVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { AgGridHeaderName, CommonColumnConfig, updateColumnsAndSetDefs } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import { fullNameController } from 'components/fullName';

interface RowListInterface {
  id: string;
  name: string;
  fenceIn: number;
  fenceOut: number;
  facilityName: string;
  dischargeDate: string | null;
  intakeDate: string | null;
}

export default function GeofencesPatientList() {
  const appData = getAppData();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);

  const [rowData, setRowData] = useState<RowListInterface[]>([]);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.GEOFENCES_COMPROMISED_REPORT
    },
    onError: (e) => catchError(e, true),
  });

  const linkCellRenderer = (props: { data: RowListInterface }) => {
    if (props.data) {
      return (
        <Link to={routes.report.geoFencesBreached.build(props.data.id)} className=" text-pt-secondary">{props.data.name}</Link>
      );
    }

    return (<div>{'N/A'}</div>);
  };

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        cellClass: 'rowFontColor lock-pinned',
        cellRenderer: linkCellRenderer,
        ...CommonColumnConfig
      },
      { field: 'fenceIn', headerName: 'Entered', filter: 'agNumberColumnFilter', sortable: true,  filterParams: {
        buttons: ['clear'],
      } },
      { field: 'fenceOut', headerName: 'Exited', filter: 'agNumberColumnFilter', sortable: true,  filterParams: {
        buttons: ['clear'],
      } },
      { field: 'dischargeDate', filter: 'agDateColumnFilter', sortable: true, filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, cellRenderer: ({ data }: { data: RowListInterface }) => (
        <div>{formatDate({ date: data.dischargeDate }) || 'N/A'}</div>
      ), },
      { field: 'intakeDate', filter: 'agDateColumnFilter', filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, sortable: true, cellRenderer: ({ data }: { data: RowListInterface }) => (
        <div>{formatDate({ date: data.intakeDate }) || 'N/A'}</div>
      ), },
      { field: 'facilityName', filter: 'agTextColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      }, hide: appData.selectedFacilityId?.length === 1, suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1},
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name  });
    
  }, [columnOrder]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const [getPatientListCallback, { loading }] = useLazyQuery<
    PretaaHealthGetFenceBreachPatientsReport,
    PretaaHealthGetFenceBreachPatientsReportVariables
  >(getFenceBreadPatientList, {
    onCompleted: (d) => {
      const moreData =
        d.pretaaHealthGetFenceBreachPatientsReport?.length ===
        config.pagination.defaultAgGridTake;
      const prevPage = noOfPage > 1;
      setGridPagination({ prev: prevPage, next: moreData });

      const patientData =
        d.pretaaHealthGetFenceBreachPatientsReport?.map((data) => {
          return {
            id: data.id,
            name: fullNameController(data.firstName, data.lastName),
            fenceIn: data.breachCountIn,
            fenceOut: data.breachCountOut,
            dischargeDate: formatDate({ date: data.dischargeDate, formatStyle: 'agGrid-date' }),
            intakeDate: formatDate({ date: data.intakeDate, formatStyle: 'agGrid-date' }),
            facilityName : data.facilityName || 'N/A',
          };
        }) || [];
        console.log(patientData);
      setRowData(patientData);
    },
    onError: (e) => catchError(e, true),
  });

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: rowData || [],
  });

  function callAPIs(skip?: number) {
    const variables = {
      ...reportFilter,
      filterUsers: reportFilter.filterUsers.map(d => { return { patientId: d.patientId }; }),
      skip: skip || 0,
      take: config.pagination.defaultAgGridTake,
    };
    getPatientListCallback({
      variables,
    });
  }

  function loadMore(type: 'prev' | 'next') {
    // for --> next
    if (type === 'next') {
      callAPIs(noOfPage * config.pagination.defaultAgGridTake);
      setNoOfPage((p) => p + 1);
      return;
    }
    // for --> prev
    callAPIs((noOfPage - 2) * config.pagination.defaultAgGridTake);
    setNoOfPage((p) => p - 1);
  }

  const [updateGeofencesColumnOrder] = useMutation<
  AgGridColumnManagement,
  AgGridColumnManagementVariables
>(updateColumnOrderMutation);

function handleUpdateColumnOrder(state: ColumnState[]) {
  updateGeofencesColumnOrder({
    variables: {
      columns: state,
      agGridListType: AgGridListTypes.GEOFENCES_COMPROMISED_REPORT,
    },
  });
}

const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  useEffect(() => {
    if ((reportFilter.filterUsers.length > 0 && reportFilter.all === false) || (reportFilter.all &&  reportFilter.filterUsers.length === 0) ) {
      callAPIs();
    }
    // 
  }, [reportFilter]);

  return (
    <div
      className={`mb-5 w-full pb-12 ${
        !!rowData?.length ? 'h-fit ' : ' h-72'
      } `}>
      <div className="font-medium text-xsmd text-gray-600 pb-4 mt-10">
        Patients
      </div>
      <AgGrid
        gridStyle={{ height: '400px' }}
        rowData={rowData || []}
        columnDefs={columnDefs}
        handleGridReady={handleGridReady}
        updateColumnOrder={debounceUpdateState}
        changeVisibility={debounceUpdateState}
        pagination={
          gridPagination.prev || gridPagination.next
            ? {
                onNextPage: () => loadMore('next'),
                onPrevPage: () => loadMore('prev'),
                page: noOfPage,
                prevEnabled: gridPagination.prev,
                nextEnabled: gridPagination.next,
              }
            : null
        }
      />
    </div>
  );
}
