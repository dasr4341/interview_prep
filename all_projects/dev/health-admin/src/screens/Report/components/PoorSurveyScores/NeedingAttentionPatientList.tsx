import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { getPoorSurveyPatientListReportQuery } from 'graphql/getPoorSurveyPatientListReport.query';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetPoorSurveyPatientListReport,
  GetPoorSurveyPatientListReportVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  AgGridHeaderName,
  updateColumnsAndSetDefs,
} from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { formatDate } from 'lib/dateFormat';
import { NeedingAttentionList, getColsDef } from './NeedingAttentionPatientListHelper';
import { getAppData } from 'lib/set-app-data';

export default function NeedingAttentionPatientList() {
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);
  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel.formattedData);

  const [rowData, setRowData] = useState<NeedingAttentionList[]>([]);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const appData = getAppData();
  const [noOfPage, setNoOfPage] = useState(1);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.ASSESSMENT_NEEDING_ATTENTION_REPORT,
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    updateColumnsAndSetDefs({ columns: columnDefs, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name });
  }, [columnDefs, columnOrder]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const [getPatientListCallback, { loading, data }] = useLazyQuery<
    GetPoorSurveyPatientListReport,
    GetPoorSurveyPatientListReportVariables
  >(getPoorSurveyPatientListReportQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPoorSurveyPatientListReport) {
        setColumnDefs(getColsDef(d.pretaaHealthGetPoorSurveyPatientListReport.columns || [], careTeamLabels, appData.selectedFacilityId?.length === 1));
        const row =
          d.pretaaHealthGetPoorSurveyPatientListReport?.listData?.map((el) => {
            return {
              id: el.id,
              name: el.name || 'N/A',
              primaryTherapist: el.primaryTherapist || '',
              caseManager: el.caseManager || '',
              bamR: Number(el.bamR),
              bamIop: Number(el.bamIop),
              gad7: Number(el.gad7),
              phq9: Number(el.phq9),
              phq15: Number(el.phq15),
              urica: Number(el.urica),
              dischargeDate: formatDate({ date: el?.dischargeDate, formatStyle: 'agGrid-date'}),
              intakeDate: formatDate({ date: el?.intakeDate, formatStyle: 'agGrid-date'}),
              facilityName : el.facilityName || 'N/A'
            };
          }) || [];
        setRowData(row);
      }
      const moreData =
        d.pretaaHealthGetPoorSurveyPatientListReport.listData?.length === config.pagination.defaultAgGridTake;
      const prevPage = noOfPage > 1;
      setGridPagination({ prev: prevPage, next: moreData });
    },
    onError: (e) => catchError(e, true),
  });

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: data?.pretaaHealthGetPoorSurveyPatientListReport.listData || [],
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

  const [updateNeedingAttentionColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateNeedingAttentionColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.ASSESSMENT_NEEDING_ATTENTION_REPORT,
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
        data?.pretaaHealthGetPoorSurveyPatientListReport.listData?.length ? 'h-fit ' : ' h-72'
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
