import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { getHelpLinePatientReport } from 'graphql/getHelpLinePatientReport.query';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  CareTeamTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetHelplinePatientsReport,
  GetHelplinePatientsReportVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { AgGridHeaderName, CommonColumnConfig, updateColumnsAndSetDefs } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { getEventStatusPayload } from 'screens/Report/helper/getEventStatusPayload.helper';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getAppData } from 'lib/set-app-data';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import { fullNameController } from 'components/fullName';
interface RowListInterface {
  id: string;
  name: string;
  helplineCountCall: number;
  helplineCountText: number;
  primaryTherapist: string;
  caseManager: string;
  facilityName : string;
  dischargeDate: string | null;
  intakeDate: string | null;
}

const FormattedDischargeDate = ({ data } : { data: RowListInterface }) => {
  return <div>{formatDate({ date: data.dischargeDate }) || 'N/A'}</div>
};

const FormattedIntakeDate = ({ data } : { data: RowListInterface }) => {
  return <div>{formatDate({ date: data.intakeDate }) || 'N/A'}</div>
};
const LinkCellRender = (props: { data: RowListInterface }) => {
  if (props.data) {
    return (<Link to={routes.report.helpLineContacted.build(props.data.id)} className=' text-pt-secondary'>{props.data.name}</Link>);
  }

  return (<div>{'N/A'}</div>);
}

export default function ContactedPatientList() {
  const appData = getAppData();
  const { patientId } = useParams();
  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);
  const careTeamLabels = useAppSelector(state => state.app.careTeamTypesLabel).formattedData;
  
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [noOfPage, setNoOfPage] = useState(1);
  const [gridPagination, setGridPagination] = useState({
    prev: false,
    next: false,
  });
  const [rowData, setRowData] = useState<RowListInterface[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.HELP_LINE_CONTACTED_REPORT
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        cellClass: 'rowFontColor lock-pinned',
        cellRenderer: LinkCellRender,
        ...CommonColumnConfig
      },
      { headerName: 'Call', field:'helplineCountCall', filter: 'agNumberColumnFilter', sortable: true,  filterParams: {
        buttons: ['clear'],
      } },
      { headerName: 'Text', field:'helplineCountText', filter: 'agNumberColumnFilter', sortable: true,  filterParams: {
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
      { field: 'dischargeDate', filter: 'agDateColumnFilter', sortable: true, filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, cellRenderer: FormattedDischargeDate },
      { field: 'intakeDate', filter: 'agDateColumnFilter', filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      }, sortable: true, cellRenderer: FormattedIntakeDate },
      {field:'facilityName', filter: 'agTextColumnFilter', sortable: true,  filterParams: {
        buttons: ['clear'],
      }, hide: appData.selectedFacilityId?.length === 1, suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1}
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name  });
    
  }, [columnOrder]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const [getPatientListCallback, { loading }] = useLazyQuery<
  GetHelplinePatientsReport,
    GetHelplinePatientsReportVariables
  >(getHelpLinePatientReport, {
    onCompleted: (d) => {
      const moreData = d.pretaaHealthGetHelplinePatientsReport?.length === config.pagination.defaultAgGridTake;
      const prevPage = noOfPage > 1;
      setGridPagination({ prev: prevPage, next: moreData });
      const patientData = d.pretaaHealthGetHelplinePatientsReport?.map((data) => {
        return {
          id: data.id,
          name: fullNameController(data.firstName, data.lastName),
          helplineCountCall: data.HelplineCountCall,
          helplineCountText: data.HelplineCountText,
          primaryTherapist: data.primaryTherapist || '',
          caseManager: data.caseManager || '',
          dischargeDate: formatDate({ date: data?.dischargeDate, formatStyle: 'agGrid-date'}),
          intakeDate: formatDate({ date: data?.intakeDate, formatStyle: 'agGrid-date' }),
          facilityName: data.facilityName || 'N/A',
        };
      }) || [];
      setRowData(patientData);
    },
    onError: (e)=> catchError(e, true)
  });

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: rowData || [],
  });

  function callAPIs(skip?: number) {
    const variables = {
      ...getEventStatusPayload(reportFilter, patientId),
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

  const [updateContactedColumnOrder] = useMutation<
    AgGridColumnManagement,
    AgGridColumnManagementVariables
  >(updateColumnOrderMutation);

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateContactedColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.HELP_LINE_CONTACTED_REPORT,
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
    <div className={`mb-5 w-full pb-12 ${!!rowData?.length ? 'h-fit ' : ' h-72' } `}>
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
       (gridPagination.prev ||
         gridPagination.next) ?  {
              onNextPage: () => loadMore('next'),
              onPrevPage: () => loadMore('prev'),
              page: noOfPage,
              prevEnabled: gridPagination.prev,
              nextEnabled: gridPagination.next,
      } : null }
    />
  </div>
  );
}
