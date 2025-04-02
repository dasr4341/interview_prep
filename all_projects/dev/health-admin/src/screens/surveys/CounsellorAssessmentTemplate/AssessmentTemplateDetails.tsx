import { useState } from 'react';
import { CellClickedEvent, ColDef } from '@ag-grid-community/core';
import { Modal } from '@mantine/core';

import AgGrid from 'components/ag-grid/AgGrid';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import AssessmentTemplateDetailsPopover from './lib/AssessmentTemplateDetailsPopover';
import useAssessmentTemplateDetails from './useAssessmentTemplateDetails';
import {
  AssessmentDetails,
  SelectedCampaignDetails,
} from './lib/assessment-template-interface';
import PatientListModal from './component/PatientListModal';
import { useDisclosure } from '@mantine/hooks';
import { getAppData } from 'lib/set-app-data';
import useQueryParams from 'lib/use-queryparams';
import { SurveyTemplateTypes } from 'health-generatedTypes';
import { formatDate } from 'lib/dateFormat';
import { useCampaignDetailsOutletContext } from '../SchedulingManager/useCampaignDetailsOutletContext';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';

const FormatIssueDateCellRenderer = (props: { data: AssessmentDetails }) => {
  if (props.data) {
    return (<div>{formatDate({ date: `${props.data.issuedAt} ${props.data.issuedTime}`, formatStyle: 'agGrid-date-time' })}</div>);
  }
};

const FormatCreateDateCellRenderer = (props: { data: AssessmentDetails }) => {
  if (props.data) {
    return (<div>{formatDate({ date: props.data.createdAt })}</div>);
  }

  return 'N/A';
}

const OpenPercentageCellRenderer = (props: { data: AssessmentDetails }) => {
  if (props.data && typeof props.data.openPercentage === 'number') {
    return (<div>{props.data.openPercentage + '%'}</div>);
  }

  return (<div>{'N/A'}</div>);
}

const completePercentageCell = ({ data }: { data: AssessmentDetails }) => (
  <div>
    {(typeof data.completePercentage === 'number' &&
      data.completePercentage + '%') ||
      'N/A'}
  </div>
)


export default function AssessmentTemplateDetails() {
  const appData = getAppData();
  const query = useQueryParams();
  const { templateType } = useCampaignDetailsOutletContext();
  const [selectedCampaign, setSelectedCampaign] =
    useState<SelectedCampaignDetails | null>();
  const [opened, { open, close }] = useDisclosure(false);

  const { loading, gridApi, handleGridReady, rowData, onDelete } =
    useAssessmentTemplateDetails();

 

  const [colDef] = useState<(ColDef | any)[]>([
    {
      field: 'issuedAt',
      headerName: 'Date of issue',
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 250,
      cellClass: 'text-pt-blue-300 font-semibold cursor-pointer',
      cellRenderer: FormatIssueDateCellRenderer,
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created on',
      sortable: true,
      filter: 'agDateColumnFilter',
      cellRenderer: FormatCreateDateCellRenderer,
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
    },
    {
      field: 'patients',
      headerName: 'Patients',
      sortable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['clear']
      },
    },
    {
      field: 'openPercentage',
      headerName: 'Open',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: OpenPercentageCellRenderer,
      filterParams: {
        buttons: ['clear']
      },
    },
    {
      field: 'completePercentage',
      headerName: 'Completed',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: completePercentageCell,
      filterParams: {
        buttons: ['clear']
      },
    },
    {
      field: 'facilityName',
      headerName: 'Facility Name',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear']
      },
      hide: (query.type === SurveyTemplateTypes.CUSTOM || (query.type !== SurveyTemplateTypes.CUSTOM && appData.selectedFacilityId?.length === 1)),
      suppressColumnsToolPanel: (query.type === SurveyTemplateTypes.CUSTOM || (query.type !== SurveyTemplateTypes.CUSTOM && appData.selectedFacilityId?.length === 1))
    },
    {
      field: '',
      headerName: '',
      sortable: false,
      filter: false,
      cellRenderer: AssessmentTemplateDetailsPopover,
      cellRendererParams: {
        onDelete
      },
      suppressColumnsToolPanel: true,
    },
  ]);

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: rowData,
  });

  const openPatientModal = (params: CellClickedEvent) => {
    if (params.column.getColId() === 'issuedAt') {
      open();
      setSelectedCampaign({
        surveyId: params.data.surveyId,
        issuedOn: params.data.issuedAt,
      });
    }
  };


  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AgGrid
        rowData={rowData}
        columnDefs={colDef}
        handleGridReady={handleGridReady}
        onCellClicked={openPatientModal}
      />

      {selectedCampaign && (
        <Modal
          closeOnClickOutside={true}
          opened={opened}
          onClose={close}
          transitionProps={{ transition: 'fade', duration: 200 }}
          withCloseButton={false}
          size="xl">
          <PatientListModal
            onClose={() => setSelectedCampaign(null)}
            selectedCampaign={selectedCampaign}
            templateType={templateType}
          />
        </Modal>
      )}
    </div>
  );
}
