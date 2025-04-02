import { GridReadyEvent } from '@ag-grid-community/core';
import { ContentHeader } from 'components/ContentHeader';
import AgGrid from 'components/ag-grid/AgGrid';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { useLazyQuery } from '@apollo/client';
import { SurveyPatientStatsModal } from 'graphql/surveyPatientStatsModal.query';
import {
  GetSurveyPatientStats,
  GetSurveyPatientStatsVariables,
  SurveyTemplateTypes,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { fullNameController } from 'components/fullName';
import { config } from 'config';
import { SelectedCampaign } from './SurveyStats';
import { ScoreColumnStats } from './ScoreColumnStats';
import DataAndTimeColumnStats from './DataAndTimeColumnStats';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import { formatDate } from 'lib/dateFormat';

export interface BamScoreType {
  useFactors:  number,
  riskFactors: number,
  protectiveFactors: number
}

enum CompletedStatus {
  Completed = 'Completed',
  Not_Completed = 'Not completed'
}

export interface SurveyPatientStats {
  finishDate: string | null | undefined;
  finishTime: string | null;
  isCompleted: boolean | null;
  isCompletedCol: string;
  overAllPatientScore: number | null;
  surveyFinishedAt: string | null;
  surveyId: string;
  lastName: string | null;
  firstName: string | null;
  bamScore: BamScoreType | null
}

export default function SurveyStatsModal({
  onClose,
  selectedCampaign,
  templateType,
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCampaign: SelectedCampaign;
  templateType?: SurveyTemplateTypes | null;
}) {
   
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<SurveyPatientStats[]>([]);

  const [getSurveyPatientStats, { loading }] = useLazyQuery<
    GetSurveyPatientStats,
    GetSurveyPatientStatsVariables
  >(SurveyPatientStatsModal, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetSurveyPatientStats) {
        const rowListData = d.pretaaHealthGetSurveyPatientStats.map((el) => {
          return {
            finishDate: formatDate({ date: el.finishDate, formatStyle: 'agGrid-date'}),
            finishTime: el.finishTime,
            isCompleted: el.isCompleted,
            isCompletedCol: el.isCompleted ? CompletedStatus.Completed : CompletedStatus.Not_Completed,
            overAllPatientScore: el.overAllPatientScore,
            bamScore: el.bamScore,
            surveyFinishedAt: el.surveyFinishedAt,
            surveyId: el.surveyId,
            lastName: el.firstName,
            firstName: fullNameController(el.firstName, el.lastName),
          };
        });
        setRowData(rowListData);
      }
    },
    onError: (e) => catchError(e, true),
  });

  const completedStats = ({ data }: { data: SurveyPatientStats }) => {
    if (data.isCompleted === true) {
      return  <div className="bg-pt-green-500 rounded-xl py-1 px-4 inline text-white font-semibold">
      Completed
    </div>;
    } else {
      return (
        <div className="bg-red-600 rounded-xl py-1 px-3 inline text-white font-semibold">
          Not completed
        </div>
      );
    }
  };

  const [columnDefs] = useState([
    {
      field: 'firstName',
      headerName: 'Name',
      filter: 'agTextColumnFilter',
      sortable: true,
      cellClass: 'font-semibold',
      filterParams: {
        buttons: ['clear']
      }
    },
    {
      field: 'isCompleted',
      headerName: 'Completed',
      filter: 'agSetColumnFilter',
      sortable: true,
      valueGetter: (params: { data: SurveyPatientStats }) => {
        if (params?.data?.isCompletedCol) {
          return params?.data?.isCompletedCol;
        }
      },
      cellRenderer: completedStats,
    },
    {
      field: 'overAllPatientScore',
      headerName: 'Score',
      filter: false,
      cellRenderer: ScoreColumnStats,
      sortable: false,
      width: 200,
      autoHeight: true,
      hide: templateType === SurveyTemplateTypes.CUSTOM ? true : false
    },
    {
      field: 'finishDate',
      filter: 'agDateColumnFilter',
      sortable: true,
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
      cellRenderer: DataAndTimeColumnStats
    }
  ]);

  const closeModal = () => {
    onClose(false);
  };

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: rowData,
  });

  useEffect(() => {
    getSurveyPatientStats({
      variables: {
        surveyId: String(selectedCampaign.surveyId),
        skip: 0,
        take: config.pagination.defaultAgGridTake,
        dateOfAssignment: String(selectedCampaign.createdAt)
      },
    });
  }, [selectedCampaign]);

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
    e.api.sizeColumnsToFit();
  };

  return (
    <div className='lg:w-9/12 h-screen m-auto' onClick={(e) => e.stopPropagation()}>
      <ContentHeader
        className="lg:sticky"
        disableGoBack={true}>
        <div className="block sm:flex sm:justify-between items-start heading-area mt-2">
          <div className="header-left w-full">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">
            Assessment Stats
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
      <ContentFrame className="h-3/4">
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          hideSideBar={true}
        />
      </ContentFrame>
    </div>
  );
}
