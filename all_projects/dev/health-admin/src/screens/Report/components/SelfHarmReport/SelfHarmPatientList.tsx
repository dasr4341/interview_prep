import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { suicidalIdeationPatientListReport } from 'graphql/suicidalIdeationPatientListReport.query';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  CareTeamTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetSuicidalIdeationPatientListReport,
  GetSuicidalIdeationPatientListReportVariables,
  GetSuicidalIdeationPatientListReport_pretaaHealthGetSuicidalIdeationPatientListReport,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import {
  AgGridHeaderName,
  CommonColumnConfig,
  updateColumnsAndSetDefs,
} from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';

interface SelfHarmList {
  id: string;
  name: string | null;
  primaryTherapist: string | null;
  caseManager: string;
  selfHarmCount: number;
  facilityName : string;
  dischargeDate: string | null;
  intakeDate: string | null;
}

const LinkCellRenderer = (props: { data: GetSuicidalIdeationPatientListReport_pretaaHealthGetSuicidalIdeationPatientListReport }) => {
  if (props.data) {
    return (<Link to={routes.report.selfHarmReport.build(props.data.id)} className=" text-pt-secondary">{props.data.name}</Link>);
  }

  return (<div>{'N/A'}</div>);
}

export default function SelfHarmPatientList() {
  const appData = getAppData();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);
  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;

  const [rowData, setRowData] = useState<SelfHarmList[]>([]);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.SUICIDAL_IDEATION_REPORT,
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
      {
        field: 'selfHarmCount',
        headerName: '# of Suicidal ideation',
        filter: 'agNumberColumnFilter',
        sortable: true,
        filterParams: {
          buttons: ['clear'],
        }
      },
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

      { field: 'dischargeDate', filter: 'agDateColumnFilter', sortable: true, filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, cellRenderer: ({ data }: { data: SelfHarmList }) => (
        <div>{formatDate({ date: data.dischargeDate }) || 'N/A'}</div>
      ), },
      { field: 'intakeDate', filter: 'agDateColumnFilter', sortable: true, filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, cellRenderer: ({ data }: { data: SelfHarmList }) => (
        <div>{formatDate({ date: data.intakeDate }) || 'N/A'}</div>
      ), },
      { field: 'facilityName',  filter: 'agTextColumnFilter', sortable: true,  filterParams: {
        buttons: ['clear'],
      }, hide: appData.selectedFacilityId?.length === 1, suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1 },
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name });
  }, [columnOrder]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const [getPatientListCallback, { loading, data }] = useLazyQuery<
    GetSuicidalIdeationPatientListReport,
    GetSuicidalIdeationPatientListReportVariables
  >(suicidalIdeationPatientListReport, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetSuicidalIdeationPatientListReport) {
        const row = d.pretaaHealthGetSuicidalIdeationPatientListReport.map((el) => {
          return {
            id: el.id,
            name: el.name || 'N/A',
            primaryTherapist: el.primaryTherapist || '',
            caseManager: el.caseManager || '',
            selfHarmCount: el.selfHarmCount,
            dischargeDate: formatDate({ date: el.dischargeDate, formatStyle: 'agGrid-date' }),
            intakeDate: formatDate({ date: el.intakeDate, formatStyle: 'agGrid-date' }),
            facilityName: el.facilityName || 'N/A',
          };
        });
        setRowData(row);
      }
      const moreData =
        d.pretaaHealthGetSuicidalIdeationPatientListReport.length === config.pagination.defaultAgGridTake;
      const prevPage = noOfPage > 1;
      setGridPagination({ prev: prevPage, next: moreData });
    },
    onError: (e) => catchError(e, true),
  });

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: data?.pretaaHealthGetSuicidalIdeationPatientListReport || [],
  });

  function callAPIs(skip?: number) {
    const variables = {
      ...reportFilter,
      filterUsers: reportFilter.filterUsers.map((d) => {
        return { patientId: d.patientId };
      }),
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

  const [updateSelfHarmColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateSelfHarmColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.SUICIDAL_IDEATION_REPORT,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  useEffect(() => {
    if (
      (reportFilter.filterUsers.length > 0 && reportFilter.all === false) ||
      (reportFilter.all && reportFilter.filterUsers.length === 0)
    ) {
      callAPIs();
    }
    //
  }, [reportFilter]);

  return (
    <div
      className={`mb-5 w-full pb-12 ${
        data?.pretaaHealthGetSuicidalIdeationPatientListReport.length ? 'h-fit ' : ' h-72'
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
