import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import { getAnomaliesPatientListReportQuery } from 'graphql/getAnomaliesPatientListReport.query';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  CareTeamTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetAnomaliesPatientListReport,
  GetAnomaliesPatientListReportVariables,
  GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport,
} from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import React, { useEffect, useState } from 'react';
import catchError from 'lib/catch-error';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import AnomaliesBiometricScale from './AnomaliesBiometricScale';
import './_patientRowView.scoped.scss';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { debounce } from 'lodash';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import {
  AgGridHeaderName,
  CommonColumnConfig,
  updateColumnsAndSetDefs,
} from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';

export interface AnomaliesPatientList {
  id: string;
  scale: number;
  name: string | null;
  heartAnomaly: number | null;
  spo2Anomaly: number | null;
  sleepAnomaly: number | null;
  hrvAnomaly: number | null;
  tempAnomaly: number | null;
  primaryTherapist: string | null;
  caseManager: string;
  total: number;
  dischargeDate: string | null;
  intakeDate: string | null;
}

const LinkCellRenderer = (props: { data: GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport }) => {
  if (props.data) {
    return (
      <Link
        to={routes.report.anomaliesReported.build(props.data.id)}
        className=" text-pt-secondary">
        {props.data.name}
      </Link>
    );
  }

  return <div>{'N/A'}</div>;
};

const dischargeDateCellRenderer = (props: { data: GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport }) => {
  const cellValue = props?.data?.dischargeDate;
  if (cellValue) {
    return <div>{formatDate({ date: cellValue })}</div>
  }
return <div>N/A</div>
}

const intakeDateCellRenderer = (props: { data: GetAnomaliesPatientListReport_pretaaHealthGetAnomaliesPatientListReport }) => {
  const cellValue = props?.data?.intakeDate;
  if (cellValue) {
    return <div>{formatDate({ date: cellValue })}</div>
  }
return <div>N/A</div>
}

export default function AnomalyPatientList() {
  const appData = getAppData();
  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;

  const { filterMonthNDate, lastNumber, filterUsers, all, rangeStartDate, rangeEndDate } = useAppSelector(
    (state) => state.counsellorReportingSlice.reportFilter,
  );

  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [rowData, setRowData] = useState<AnomaliesPatientList[]>([]);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.ANOMALIES_REPORT,
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        cellClass: 'rowFontColor lock-pinned',
        cellRenderer: LinkCellRenderer,
        ...CommonColumnConfig,
      },
      { field: 'total', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      {
        field: 'scale',
        headerName: 'Biometric Scale',
        width: 400,
        cellRenderer: AnomaliesBiometricScale,
        filter: false,
        sortable: false,
      },
      { field: 'hrvAnomaly', headerName: 'HRV Anomaly', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      { field: 'heartAnomaly', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      { field: 'sleepAnomaly', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      { field: 'spo2Anomaly', headerName: 'SpO2 Anomaly', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      { field: 'tempAnomaly', filter: 'agNumberColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      {
        field: 'primaryTherapist',
        headerName:
          careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].updatedValue ||
          careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].defaultValue,
        filter: 'agTextColumnFilter',
        sortable: true,
        filterParams: {
          buttons: ['clear'],
        }
      },
      {
        field: 'caseManager',
        headerName:
          careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].updatedValue ||
          careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].defaultValue,
        filter: 'agTextColumnFilter',
        sortable: true,
        filterParams: {
          buttons: ['clear'],
        }
      },
      {
        field: 'dischargeDate',
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        },
        cellRenderer: dischargeDateCellRenderer,
        sortable: true,
      },
      {
        field: 'intakeDate',
        filter: 'agDateColumnFilter',
        sortable: true,
        filterParams: {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        },
        cellRenderer: intakeDateCellRenderer,
      },
      {
        field: 'facilityName',
        headerName: 'Facility',
        filter: 'agTextColumnFilter',
        sortable: true,
        hide: appData.selectedFacilityId?.length === 1,
        suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1,
        filterParams: {
          buttons: ['clear'],
        }
      },
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name });
  }, [columnOrder, rowData]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const [getPatientListCallback, { loading, data }] = useLazyQuery<
    GetAnomaliesPatientListReport,
    GetAnomaliesPatientListReportVariables
  >(getAnomaliesPatientListReportQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetAnomaliesPatientListReport) {
        const row = d.pretaaHealthGetAnomaliesPatientListReport.map((el) => {
          const totalAnomalies =
            Number(el.hrvAnomaly) +
            Number(el?.heartAnomaly) +
            Number(el.sleepAnomaly) +
            Number(el.spo2Anomaly) +
            Number(el.tempAnomaly);
          return {
            id: el.id,
            name: el.name || 'N/A',
            primaryTherapist: el.primaryTherapist || '',
            caseManager: el.caseManager || '',
            hrvAnomaly: el.hrvAnomaly,
            heartAnomaly: el.heartAnomaly,
            sleepAnomaly: el.sleepAnomaly,
            spo2Anomaly: el.spo2Anomaly,
            tempAnomaly: el.tempAnomaly,
            total: totalAnomalies,
            scale: el.scale,
            dischargeDate: el.dischargeDate === "N/A" ? null : formatDate({ date: el?.dischargeDate, formatStyle: 'agGrid-date' }) || null,
            intakeDate: el.intakeDate === 'N/A' ? null : formatDate({ date: el?.intakeDate, formatStyle: 'agGrid-date' }) || null,
            facilityName: el.facilityName || 'N/A',
          };
        });
        setRowData(row);
      }
      const moreData = d.pretaaHealthGetAnomaliesPatientListReport?.length === config.pagination.defaultAgGridTake;
      const prevPage = noOfPage > 1;
      setGridPagination({ prev: prevPage, next: moreData });
    },
    onError: (e) => catchError(e, true),
  });

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: data?.pretaaHealthGetAnomaliesPatientListReport || [],
  });

  function callAPIs(skip?: number) {
    const variables = {
      filterMonthNDate,
      all,
      rangeStartDate,
      rangeEndDate,
      filterUsers: filterUsers.map((d) => {
        return { patientId: d.patientId };
      }),
      skip: skip || 0,
      take: config.pagination.defaultAgGridTake,
      lastNumber,
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

  const [updateAnomaliesColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateAnomaliesColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.ANOMALIES_REPORT,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  useEffect(() => {
    if ((filterUsers.length > 0 && all === false) || (all && filterUsers.length === 0)) {
      callAPIs();
    }
  }, [filterMonthNDate, filterUsers, all, rangeStartDate, rangeEndDate]);

  return (
    <div
      className={`grid-item mb-5 w-full pb-12 ${
        !!data?.pretaaHealthGetAnomaliesPatientListReport?.length ? 'h-fit ' : ' h-72'
      } `}>
      <div className="font-medium text-xsmd text-gray-600 pb-4 mt-10">Patients</div>
      <AgGrid
        gridStyle={{ height: '400px' }}
        rowData={rowData}
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
