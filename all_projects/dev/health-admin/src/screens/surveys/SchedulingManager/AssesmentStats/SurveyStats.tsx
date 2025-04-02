import React, { useEffect, useState } from 'react';
import { CellClickedEvent, GridReadyEvent } from '@ag-grid-community/core';
import { ContentHeader } from 'components/ContentHeader';
import AgGrid from 'components/ag-grid/AgGrid';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import SurveyStatsModal from './SurveyStatsModal';
import { useLazyQuery } from '@apollo/client';
import { getSurveyStats } from 'graphql/getSurveyStats.query';
import { GetSurveyStats, GetSurveyStatsVariables, GetTemplateForCampaign, GetTemplateForCampaignVariables, SurveyTemplateTypes } from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useParams } from 'react-router-dom';
import useQueryParams from 'lib/use-queryparams';
import { Skeleton } from '@mantine/core';
import { getTemplateForCampaign } from 'graphql/getTemplateForCampagin.query';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';

export interface SurveyStatsInterface {
  completePercentage: number;
  createdAt: string | null;
  openPercentage: number;
  patients: number;
  surveyId: string;
}

export interface SelectedCampaign {
  surveyId: string;
  createdAt: string;
}

const CreateDateCellRenderer = (props: { data: SurveyStatsInterface }) => {
  if (props.data) {
    return (<div>{formatDate({ date: props.data.createdAt })}</div>);
  }

  return (<div>{'N/A'}</div>);
}

const formattedCompletedCellRenderer = (props: { data: SurveyStatsInterface }) => {
  if (props.data) {
    return (<div>{props.data.completePercentage >= 0 ? props.data.completePercentage.toFixed(1) + '%' : ''}</div>);
  }
}

const formattedOpenCellRenderer = (props: { data: SurveyStatsInterface }) => {
  if (props.data) {
    return (<div>{props.data.openPercentage >= 0 ? props.data.openPercentage.toFixed(1) + '%' : ''}</div>);
  }
}

export default function SurveyStats() {
  const query = useQueryParams();
  const { templateId, campaignId } = useParams();
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<SurveyStatsInterface[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign | null>();

  const [columnDefs] = useState([
    {
      field: 'createdAt',
      headerName: 'Created on',
      sortable: true,
      cellClass: 'cursor-pointer text-pt-blue-300 font-semibold',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear']
      },
      cellRenderer: CreateDateCellRenderer
    },
    {
      field: 'patients',
      filter: 'agNumberColumnFilter',
      sortable: true,
      filterParams: {
        buttons: ['clear']
      }
    },
    {
      field: 'openPercentage',
      headerName: 'Open',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellClass: 'font-semibold',
      cellRenderer: formattedOpenCellRenderer,
      filterParams: {
        buttons: ['clear']
      }
    },
    {
      field: 'completePercentage',
      headerName: 'Completed',
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellClass: 'font-semibold',
      cellRenderer: formattedCompletedCellRenderer,
      filterParams: {
        buttons: ['clear']
      }
    },
  ]);

  const [getSurveyStatsData, { loading }] = useLazyQuery<GetSurveyStats, GetSurveyStatsVariables>(getSurveyStats, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetSurveyStats) {
        const rowListData = d.pretaaHealthGetSurveyStats.map((el) => {
          return {
            completePercentage: el.completePercentage,
            createdAt: formatDate({ date: el.createdAt, formatStyle: 'agGrid-date'  }),
            openPercentage: el.openPercentage,
            patients: el.patients,
            surveyId: el.surveyId
          } as SurveyStatsInterface;
        });
        setRowData(rowListData);
      }
    },
    onError: (e) => catchError(e, true)
  });

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  useAgGridOverlay({
    detailsLoading: loading,
    gridApi,
    list: rowData,
  });

  useEffect(() => {
    if (campaignId) {
      getSurveyStatsData({
        variables: {
          surveyId: campaignId
        }
      });
    }
    // 
  }, [campaignId]);

  const openSurveyModal = (d: CellClickedEvent) => {
    if (d.column.getColId() === 'createdAt') {
      setSelectedCampaign({ surveyId: d.data.surveyId, createdAt: d.data.createdAt });
    }
  };


const [getTemplateData, { data: templateData, loading: templateDataLoading }] = useLazyQuery<
GetTemplateForCampaign,
GetTemplateForCampaignVariables
>(getTemplateForCampaign);

useEffect(() => {
  getTemplateData({
    variables: {
      templateId: String(templateId),
    },
    onError: (e) => catchError(e, true),
  });
}, []);

  return (
    <>
      <ContentHeader className="lg:sticky">
        <div className="block md:flex justify-between heading-area">
          <div className="header-left">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5 mt-2">
              {query.campaignName || 'Assessment stats'}
            </h1>
          </div>
          <div className="overflow-hidden mb-4 md:mb-0 flex flex-col justify-items-start">
              <span className="text-gray-600 mb-1 text-sm font-medium md:flex flex-col items-end">
                Template Name
              </span>

              {templateDataLoading && (
               <Skeleton
               width={window.innerWidth < 640 ? '90%' : 400}
               height={24}
               mt={4}
             />
              )}
              {!templateDataLoading && (
                <h2 className="text-primary text-md font-normal truncate break-all capitalize">
                  {templateData?.pretaaHealthGetTemplate?.name || 'N/A'}
                </h2>
              )}
            </div>
        </div>
      </ContentHeader>

      <ContentFrame className="h-screen lg:h-full">
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
          onCellClicked={openSurveyModal}
        />
      </ContentFrame>

      {selectedCampaign && (
        <div
          className="h-fit fixed modal-overlay my-auto pt-10 pb-10  px-3 md:px-8 top-0 left-0 right-0 bottom-0 bg-overlay"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedCampaign(null)}>
          <SurveyStatsModal
            onClose={() => setSelectedCampaign(null)}
            selectedCampaign={selectedCampaign}
            templateType={templateData?.pretaaHealthGetTemplate?.type as SurveyTemplateTypes }
          />
        </div>
      )}
    </>
  );
}
