import React, { useEffect, useState } from 'react';
import { GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery } from '@apollo/client';
import { useViewportSize } from '@mantine/hooks';

import { ContentHeader } from 'components/ContentHeader';
import AgGrid from 'components/ag-grid/AgGrid';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import Button from 'components/ui/button/Button';
import {
  GetAdHocSurveysPatientListForCounsellors,
  GetAdHocSurveysPatientListForCounsellorsVariables,
  SurveyTemplateTypes,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { getPatientListModalForCounsellor } from 'graphql/getPatientListModalForCounsellor.query';
import {
  PatientListModalData,
  SelectedCampaignDetails,
} from '../lib/assessment-template-interface';
import { formatDate } from 'lib/dateFormat';

export default function PatientListModal({
  onClose,
  selectedCampaign,
  templateType
}: {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCampaign: SelectedCampaignDetails;
  templateType?: SurveyTemplateTypes | null;
}) {
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<PatientListModalData[]>([]);
  const { height } = useViewportSize();


  const [getPatientListForModal, { loading }] = useLazyQuery<
    GetAdHocSurveysPatientListForCounsellors,
    GetAdHocSurveysPatientListForCounsellorsVariables
  >(getPatientListModalForCounsellor, {
    onCompleted: (d) => {
      if (d?.pretaaHealthGetAdHocSurveysPatientListForCounsellors) {
        const row = d?.pretaaHealthGetAdHocSurveysPatientListForCounsellors.map(
          (el) => {
            return {
              name: el.patientFulltName || 'N/A',
              completed: formatDate({ date: el.completedAt, formatStyle: 'agGrid-date' }),
              score: Number(el.score),
              patientId: el.patientId,
            };
          }
        );
        setRowData(row);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    getPatientListForModal({
      variables: {
        surveyId: String(selectedCampaign.surveyId),
      },
    });
  }, []);

  const completedAssessment = ({ data }: { data: PatientListModalData }) => {
    if (data.completed) {
      return  <div>
      {formatDate({ date: data.completed })}
    </div>;
    } else {
      return (
        <div className="bg-red-600 rounded-xl py-1 px-3 text-more inline text-white font-medium">
          Not completed
        </div>
      );
    }
  };

  const assessmentScoreCellRenderer = ({ data }: { data: PatientListModalData }) => {
    if (typeof data.score === 'number') {
      return  <div>
      {data.score || 'N/A'}
    </div>;
    } 
  };

  const [columnDefs] = useState([
    {
      field: 'name',
      filter: 'agTextColumnFilter',
      sortable: true,
      cellClass: 'font-semibold',
    },
    {
      field: 'completed',
      filter: 'agDateColumnFilter',
      sortable: true,
      cellRenderer: completedAssessment
    },
    {
      field: 'score',
      filter: 'agNumberColumnFilter',
      sortable: true,
      maxWidth: 150,
      cellRenderer: assessmentScoreCellRenderer,
      hide: templateType === SurveyTemplateTypes.CUSTOM ? true : false
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

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  return (
    <div
      className="m-auto"
      style={{ height: `${height - 200}px` }}
      onClick={(e) => e.stopPropagation()}>
      <ContentHeader
        className="lg:sticky"
        disableGoBack={true}>
        <div className="block sm:flex sm:justify-between items-start heading-area mt-2">
          <div className="header-left w-full">
            <h2 className="h2 leading-none text-primary font-bold text-md lg:text-lg mb-5">
              Patient Details
            </h2>
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
      <ContentFrame className="h-5/6">
        <AgGrid
          rowData={rowData}
          gridStyle={{ height: '100%' }}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          hideSideBar={true}
        />
      </ContentFrame>
    </div>
  );
}
