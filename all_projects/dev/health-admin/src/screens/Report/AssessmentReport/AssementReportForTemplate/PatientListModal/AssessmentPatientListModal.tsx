import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import AgGrid from 'components/ag-grid/AgGrid';
import { useViewportSize } from '@mantine/hooks';
import usePatientList from './usePatientList';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { useState } from 'react';
import { GridReadyEvent } from '@ag-grid-community/core';
import { NavLink } from 'react-router-dom';
import { CampaignStatsType } from '../assement-report-interface';
import { reportSliceActions } from 'lib/store/slice/assessment-report/assessment.slice';

export default function AssessmentPatientListModal({
  onClose,
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAssessmentType: boolean;
}) {
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    onClose(false);
  };

  const selectedCampaign = useAppSelector(
    (state) => state.assessmentReport.selectedCampaign
  );
  const { height } = useViewportSize();
  const { rows, columnDef, loadingForOpen, loadingForComplete } = usePatientList();
  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  useAgGridOverlay({
    detailsLoading: (loadingForComplete || loadingForOpen),
    gridApi,
    list: rows,
  });

  return (
    <div
      className="m-auto" 
      style={{ height: `${height - 170}px` }}
      onClick={(e) => e.stopPropagation()}>
      <ContentHeader
        disableGoBack={true}>
        <div className="block sm:flex sm:justify-between items-start heading-area mt-2">
          <div className="header-left w-full">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">
             Campaign Stats for {selectedCampaign?.campaignName}
            </h1>
          </div>
          <div className="header-right">
            <Button
              buttonStyle="gray"
              size="xs"
              className="whitespace-nowrap px-5 py-2"
              onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      </ContentHeader>
      <div className="flex pt-2 md:pt-0 space-x-6 px-6 lg:px-16 bg-white">
          <NavLink
          to=''
          onClick={() => {
            if (selectedCampaign?.campaignId) {
              dispatch(reportSliceActions.setSelectedCampaign({
                ...selectedCampaign,
                campaignType: CampaignStatsType.COMPLETED
              }));
            }
          
          }}
          className={ `py-1 px-4 text-primary mr-2 font-bold  
          ${selectedCampaign?.campaignType === CampaignStatsType.COMPLETED ? 'activeTabClasses' : ''}`}>
          Completed
        </NavLink>
        <NavLink
          to=''
          onClick={() => {
            if (selectedCampaign?.campaignId) {
              dispatch(reportSliceActions.setSelectedCampaign({
                ...selectedCampaign,
                campaignType: CampaignStatsType.OPEN
              }));
            }
          
          }}
          className={`py-1 px-4 text-primary font-bold ${selectedCampaign?.campaignType === CampaignStatsType.OPEN ? 'activeTabClasses' : ''}`}>
          Open
        </NavLink>
      </div>
      <ContentFrame className="h-3/4">
        <AgGrid
          rowData={rows}
          columnDefs={columnDef}
          handleGridReady={handleGridReady}
        />
      </ContentFrame>
    </div>
  );
}
