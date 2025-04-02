import { useState, useEffect } from 'react';
import { CellClickedEvent, ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useParams } from 'react-router-dom';
import AgGrid from 'components/ag-grid/AgGrid';
import { config } from 'config';
import SchedulingManagerPopoverCell from './SchedulingManagerDetailPopoverCell';
import './schedule_manager_detail.scoped.scss';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  CampaignSurveyEventTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetCampaignListByTemplateId,
  GetCampaignListByTemplateIdVariables,
  SurveyCountPerParticipantType
} from 'health-generatedTypes';
import { getCampaignListByTemplateId } from 'graphql/getCampaignListByTemplateId.query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import catchError from 'lib/catch-error';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import SurveyStatusComponent from './SurveyStatusComponent';
import SurveyNameComponent from './SurveyNameComponent';
import SurveyStatsModal from './AssesmentStats/SurveyStatsModal';
import { useDispatch } from 'react-redux';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { SelectedCampaign } from './AssesmentStats/SurveyStats';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { debounce, } from 'lodash';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import { CommonColumnConfig } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import useQueryParams from 'lib/use-queryparams';
import { getAppData } from 'lib/set-app-data';
import getColumnState from 'components/ag-grid/get-saved-columnState';
import { campaignIsEnded, campaignIsPublished } from './CampaignStatusHelpers';
import { formatDate } from 'lib/dateFormat';
import { useCampaignDetailsOutletContext } from './useCampaignDetailsOutletContext';
import { getStatus } from './getSuveyStatus';
import FormattedStartDateCellRenderer, { Campaign, FormattedCreateOnCellRenderer, FormattedEndDateCellRenderer, handleAssessmentType, handleFrequencyData } from './SchedulingCamapaign/ScheduleManagerDetailsHelper';

export default function SchedulingManagerDetail() {
  const excludeList = ['campaignName', 'facility'];
  const appData = getAppData();
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign | null>();
  const [rowData, setRowData] = useState<Campaign[]>([]);
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const query = useQueryParams();
  const { templateId, type } = useParams();
  const dispatch = useDispatch();
  const [multipleColumnDefs, setMultipleColumnDefs] = useState<ColDef[]>([]);
  const [singleColumnDefs, setSingleColumnDefs] = useState<ColDef[]>([]);
  const { templateType } = useCampaignDetailsOutletContext()

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.CAMPAIGN_LIST,
    },
    onError: (e) => catchError(e, true),
  });

  const commonColumns = [
    {
      field: 'createdOn',
      headerName: 'Created on',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
      cellClass: 'font-medium text-gray-150',
      width: 180,
      cellRenderer: FormattedCreateOnCellRenderer
    },
    {
      field: 'startDate',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
      cellClass: 'font-medium text-gray-150',
      width: 230,
      cellRenderer: FormattedStartDateCellRenderer
    },
    {
      field: 'endDate',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
      cellClass: 'font-medium text-gray-150',
      cellRenderer: FormattedEndDateCellRenderer
    },
    {
      field: 'facility',
      headerName: 'Facility Name',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear'],
      },
      cellClass: 'font-medium text-gray-150',
      sortable: true,
      hide: Number(appData.selectedFacilityId?.length) <= 1 ? true : false,
      suppressColumnsToolPanel: appData.selectedFacilityId?.length === 1
    },
  ]

  // multiple saved column
  useEffect(() => {
    let columns: (ColDef | any)[] = [
      {
        field: 'campaignName',
        width: 400,
        cellRenderer: SurveyNameComponent,
        cellClass: 'lock-pinned',
        ...CommonColumnConfig,
      },
      {
        field: 'actions',
        headerName: '',
        width: 120,
        sortable: false,
        filter: false,
        cellClass: 'lock-pinned',
        resizable: false,
        cellRenderer: SchedulingManagerPopoverCell,
        suppressMovable: true,
        suppressColumnsToolPanel: true,
        hide: String(query.templateStatus) === 'false' ? true : false,
        pinned: window.innerWidth >= 640 ? 'left' : 'none',
      },
      {
        field: 'status',
        filter: 'agSetColumnFilter',
        cellRenderer: SurveyStatusComponent,
        width: 150,
        valueGetter: (params: { data: Campaign }) => {
          if (params?.data?.statusEl) {
            return params?.data?.status.split('_').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ');
          }
        },
      },
      {
        field: 'triggerType',
        headerName: 'Type',
        filter: 'agSetColumnFilter',
        width: 180,
        cellClass: 'w-full text-xsm capitalize leading-5 font-semibold text-gray-150',
      },
      {
        field: 'frequency',
        filter: 'agTextColumnFilter',
        cellClass: 'text-xsm leading-5 font-semibold text-gray-150',
        width: 180,
        hide: type === SurveyCountPerParticipantType.SINGLE ? true : false,
      },
      ...commonColumns
    ];
    setMultipleColumnDefs(
      getColumnState({
        columnDefs: columns,
        savedColumns: columnOrder?.pretaaHealthGetAgGridColumn?.columnList,
        excludeList: excludeList,
      }),
    );
  }, [columnOrder]);

  const onDelete = (id: string) => {
    setRowData((prev) => prev.filter(e => e.id !== id));
  }

  // single saved column
  useEffect(() => {
    const columns: (ColDef | any)[] = [
      {
        field: 'campaignName',
        width: 400,
        cellRenderer: SurveyNameComponent,
        cellClass: 'text-pt-blue-300 lock-pinned',
        resizable: false,
        ...CommonColumnConfig,
      },
      {
        field: 'options',
        headerName: '',
        width: 120,
        filter: false,
        cellClass: 'lock-pinned',
        resizable: false,
        cellRenderer: SchedulingManagerPopoverCell,
        cellRendererParams: {
          onDelete
        },
        suppressMovable: true,
        suppressColumnsToolPanel: true,
        hide: String(query.templateStatus) === 'false' ? true : false,
        pinned: window.innerWidth >= 640 ? 'left' : 'none',
      },
      {
        field: 'status',
        filter: 'agSetColumnFilter',
        cellRenderer: SurveyStatusComponent,
        width: 150,
        valueGetter: (params: { data: Campaign }) => {
          if (params?.data?.status) {
            return params?.data?.status.split('_').map(el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()).join(' ');
          }
        },
      },
      ...commonColumns
    ];

    setSingleColumnDefs(
      getColumnState({
        columnDefs: columns,
        savedColumns: columnOrder?.pretaaHealthGetAgGridColumn?.columnList,
        excludeList: excludeList,
      }),
    );
  }, [columnOrder]);


  const [getCampaignList, { loading: campaignsListLoading }] = useLazyQuery<
    GetCampaignListByTemplateId,
    GetCampaignListByTemplateIdVariables
  >(getCampaignListByTemplateId, {
    onCompleted: (d) => {
      if (d?.pretaaHealthGetAllCampaignSurveys) {
        const row: Campaign[] = d?.pretaaHealthGetAllCampaignSurveys.map((el) => {
          return {
            id: el.id,
            campaignName: el.title || 'N/A',
            frequencyType: el.campaignSurveyFrequencyType || 'N/A',
            startDate: formatDate({ date: el.startDate, timeZone: 'UTC', formatStyle: 'agGrid-date'}), // Do not format as per scope it need to format as UTC date
            startTime: formatDate({ date: el.startDate, timeZone: 'UTC', formatStyle: 'agGrid-time'}),
            endDate: formatDate({ date: el.campaignSurveyEndDate, formatStyle: 'agGrid-date' }),
            createdOn: formatDate({ date: el.createdAt, formatStyle: 'agGrid-date' }),
            pause: el.pause,
            campaignSurveyFrequencyCustomData: el.campaignSurveyFrequencyCustomData || 0,
            surveyCountPerParticipantType: el.surveyCountPerParticipantType,
            triggerType: handleAssessmentType(el.triggerType),
            surveyEventType: (el.surveyEventType as CampaignSurveyEventTypes) || null,
            publishedAt: el.publishedAt,
            published: el.published,
            facility: el.facility?.name,
            frequency: handleFrequencyData(
              el.campaignSurveyFrequencyType || '',
              el.campaignSurveyFrequencyCustomData || 0,
            ),
            status: el.currentStatus,
            statusEl: getStatus({ campaignData: el }),
          };
        });
        setRowData(row);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  const [updateCampaignColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );


  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  const methodFromParent = () => {
      getCampaignList({
        variables: {
          surveyTemplateId: String(templateId),
          surveyCountPerParticipantType: type as SurveyCountPerParticipantType,
        }
      });
  };

  const openSurveyModal = (params: CellClickedEvent) => {
    if (type === SurveyCountPerParticipantType.SINGLE && params.column.getColId() === 'campaignName' && (campaignIsPublished(params.data) || campaignIsEnded(params.data))) {
      setSelectedCampaign({ surveyId: params.data.id, createdAt: params.data.createdOn });
    }
  };

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateCampaignColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.CAMPAIGN_LIST,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  useEffect(() => {
    dispatch(appSliceActions.setSelectedPatientList([]));
    dispatch(appSliceActions.setSelectedPatientRows([]));
  
      getCampaignList({
        variables: {
          skip: 0,
          take: config.pagination.defaultTake,
          surveyTemplateId: String(templateId), 
          surveyCountPerParticipantType: type as SurveyCountPerParticipantType,
          searchPhrase: query.searchedPhase
        },
      });
    
  }, [type, query.searchedPhase]);

  useAgGridOverlay({
    detailsLoading: campaignsListLoading,
    gridApi,
    list: rowData
  })

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AgGrid
        rowData={rowData}
        columnDefs={type === SurveyCountPerParticipantType.SINGLE ? singleColumnDefs : multipleColumnDefs}
        handleGridReady={handleGridReady}
        methodFromParent={methodFromParent}
        onCellClicked={openSurveyModal}
        updateColumnOrder={debounceUpdateState}
        changeVisibility={debounceUpdateState}
      />

      {selectedCampaign && (
        <div
          className="fixed modal-overlay pt-8 pb-20 px-3 md:px-8 top-0 left-0 right-0 bottom-0 bg-overlay"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedCampaign(null)}>
          <SurveyStatsModal
            onClose={() => setSelectedCampaign(null)}
            selectedCampaign={selectedCampaign}
            templateType={templateType}
          />
        </div>
      )}
    </div>
  );
}
