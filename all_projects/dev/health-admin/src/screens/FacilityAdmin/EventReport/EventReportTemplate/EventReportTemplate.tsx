import React, { useEffect, useState } from 'react';

import AgGrid from 'components/ag-grid/AgGrid';
import { useLazyQuery } from '@apollo/client';
import { getComparisonCliniciansReportQuery } from 'graphql/getComparisonCliniciansReport.query';
import catchError from 'lib/catch-error';
import {
  CareTeamTypes,
  GetComparisonCliniciansReport,
  GetComparisonCliniciansReportVariables,
  GetGeneralPopulationPatientList,
  GetGeneralPopulationPatientListVariables,
} from 'health-generatedTypes';
import { useAppSelector } from 'lib/store/app-store';
import { useParams } from 'react-router-dom';
import { EventReportPageTypes } from '../EventReportPageLayout';
import { generalPopulationList } from 'graphql/generalPopulationList.query';
import { getReportVariables } from '../get-filter-variables';
import { ICellRendererParams } from '@ag-grid-community/core';
import '../_eventReport.scoped.scss';
import { Skeleton } from '@mantine/core';
import { getAppData } from 'lib/set-app-data';

interface PopulatedStatsInterface {
  caseManager: string | null;
  gad7: number;
  name: string | null;
  phq15: number;
  phq9: number;
  primaryTherapist: string | null;
}

enum ResultTableOverCounts {
  overAllAssessmentScoreCounts = 'overAllAssessmentScoreCounts'
}
  
type ResultTableRowDataInterface = { [key: string]: string };
  
interface ResultTableRowData  {
  field: string;
  headerName: string;
  filter: () => void;
  width: number;
  cellClass?: string;
  pinned?: string;
}
interface ResultTableColDefInterface {
  allCols: ResultTableRowData[];
  cols: ResultTableRowData[];
}

function overAllSurveyScoreCounts(props: ICellRendererParams) {
  const arrayOfValues = Object.values(props.data);
  const difference = Number(String(arrayOfValues[3]).replaceAll('%', ''));
  return (
    <div
      className={`p-0.5 py-3 font-extrabold text-xmd ${
        difference >= 0 ? 'text-pt-green-500' : 'text-red-700'
      } `}>
      {isNaN(difference) ? 'N/A' : `${String(difference).replace('-', '')}%`}
    </div>
  );
}

export default function EventReportTemplate() {
  const params: { pageType?: string; } = useParams();
  const appData = getAppData();
  const [populatedStats, setPopulatedStats] = useState<
    PopulatedStatsInterface[]
    >([]);


  const [resultTableColDef, setResultTableColDef] =
    useState<ResultTableColDefInterface>({
      allCols: [],
      cols: [],
    });
  const [comparisonResult, setComparisonResult] = useState<
    {
      allRows: ResultTableRowDataInterface[],
    rowData: ResultTableRowDataInterface[],
    }>({
    allRows: [],
    rowData: [],
  });

  const clinicianFilter = useAppSelector((state) => state.app.clinicianFilter);
  const careTeamLabels = useAppSelector(state => state.app.careTeamTypesLabel).formattedData;

  const [patientListColumnDef, setPatientListColumnDef] = useState([]);

  const [getComparisonResultCallback, { loading: getComparisonResultLoading }] =
    useLazyQuery<
      GetComparisonCliniciansReport,
      GetComparisonCliniciansReportVariables
    >(getComparisonCliniciansReportQuery, {
      onCompleted: (d) => {
        if (d.pretaaHealthGetComparasionCliniciansReport) {
          const [col, result] = Object.values(
            d.pretaaHealthGetComparasionCliniciansReport
          );
          const colDef = col?.map(
            (data: { key: string; label: string }, i: number) => {
              if (!i) {
                return {
                  cellClass: 'text-black font-medium',
                  field: data.key,
                  headerName: data.label + '(Allow Arranging)',
                  filter: 'agTextColumnFilter',
                  filterParams: {
                    buttons: ['clear']
                  },
                  width: 200,
                  lockPosition: 'left',
                  pinned: 'left',
                  lockVisible: true,
                };
              }

              return {
                field: data.key,
                headerName:
                data.label + ' Decrease From Admittance To Discharge',
                filter: 'agNumberColumnFilter',
                  filterParams: {
                    buttons: ['clear']
                  },
                width: 200,
                valueGetter: (params: any) => {
                  return parseInt(params?.data?.[data.key]);
                },
                cellRenderer: (params : { data: { key: string }}) => {
                  if (params.data) {
                    return <div>{params?.data?.[data.key]}</div>
                  }
                }
              };
            }
          );

          // overall
          colDef.push({
              field: ResultTableOverCounts.overAllAssessmentScoreCounts,
              headerName: 'Difference',
              width: 200,
              filter: 'agNumberColumnFilter',
              filterParams: {
                buttons: ['clear']
              },
              sortable: true,
              cellRenderer: overAllSurveyScoreCounts,
          });

       
          setResultTableColDef(() => {
            return {
              allCols: colDef,
              cols: colDef.filter((colData: ResultTableRowData) => {
                if ((clinicianFilter.filterClinicianList.length === 1 && colData.field === ResultTableOverCounts.overAllAssessmentScoreCounts) ||
                  colData.field !== ResultTableOverCounts.overAllAssessmentScoreCounts) {
                  return true;
                } 
                return false;
              }),
            };
          });


          // Transforming data 
          const formattedResult: ResultTableRowDataInterface[] = result.map((e: ResultTableRowDataInterface) => {
            const obj = Object.entries(e).reduce((init: ResultTableRowDataInterface, [k, v]: [k: string, v: string]) => {
              const value = Number(v);
              init[k] = !isNaN(value) ? `${Math.round(value)}%` : v;
              return init;
            }, {});
            
      
            // finding the difference 
            const arrayOfValues = Object.values(obj);
            
            const count1 = Number(String(arrayOfValues[1]).replaceAll('%', ''));
            const count2 = Number(String(arrayOfValues[2]).replaceAll('%', ''));

            let difference = Math.round(count1 - count2);
            if (count2 < 0) {
              difference = difference * -1;
            }
            
            return { ...obj, 'overAllAssessmentScoreCounts' : difference };
          });

          setComparisonResult(() => {
            return {
              allRows: formattedResult,
              rowData:
                params.pageType === EventReportPageTypes.ALL
                  ? formattedResult
                  : formattedResult?.filter((data) => data?.type === params.pageType),
            };
          });
        }
      },
      onError: (e) => catchError(e, true),
    });

  // PatientList data implementation
  const [getPopulationPatientLists, { loading: populationLoading }] =
    useLazyQuery<
      GetGeneralPopulationPatientList,
      GetGeneralPopulationPatientListVariables
    >(generalPopulationList, {
      onCompleted: (d) => {
        const { listData,  columns } = d.pretaaHealthGetGeneralPopulationPatientList;

        const patientListColumnDef: any = [
          {
            field: 'name',
            cellClass: ' text-black font-medium',
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['clear']
            },
            width: 300,
            lockPosition: 'left',
            pinned: 'left',
            lockVisible: true,
          },
          {
            field: 'primaryTherapist',
            headerName:
              careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].updatedValue ||
              careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].defaultValue,
              filter: 'agTextColumnFilter',
              filterParams: {
                buttons: ['clear']
              },
            width: 250,
          },
          {
            field: 'caseManager',
            headerName:
              careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].updatedValue ||
              careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].defaultValue,
              filter: 'agTextColumnFilter',
              filterParams: {
                buttons: ['clear']
              },
            width: 250,
          },
          {
            field: 'facilityName',
            headerName: 'Facility Name',
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['clear']
            },
          },
        ];

        columns?.forEach(col => {
          if (col.key !== 'name' && col.key !== 'primaryTherapist' && col.key !== 'caseManager' && col.key !== 'facilityName') {
            patientListColumnDef.push({
              field: col.key,
              headerName: col.label,
              filter: 'agNumberColumnFilter',
              sortable: true,
              filterParams: {
                buttons: ['clear'],
              },
            });
          }
        });

        patientListColumnDef.push({
          field: 'total',
          filter: 'agNumberColumnFilter',
          sortable: true,
          filterParams: {
            buttons: ['clear'],
          },
         
        });

        setPatientListColumnDef(changeVisibilityOfPatientListColumn(patientListColumnDef));
        
        const populatedData = listData?.map((e) => {
            return {
              name: e.name || 'N/A',
              primaryTherapist: e.primaryTherapist || 'N/A',
              caseManager: e.caseManager || 'N/A',
              facilityName: e.facilityName || 'N/A',
              gad7: Number(e.gad7),
              phq15: Number(e.phq15),
              phq9: Number(e.phq9),
              total: Number(e.total)
            };
          }) || [];

        setPopulatedStats(populatedData);
      },
      onError: (e) => catchError(e, true),
    });


  useEffect(() => {
    getComparisonResultCallback({
      variables: {
        ...getReportVariables(clinicianFilter),
      },
    });
    getPopulationPatientLists({
      variables: {
        ...getReportVariables(clinicianFilter),
      },
    });
  }, [clinicianFilter]);

  function changeVisibilityOfPatientListColumn(columns) {
    
      return columns.map(col => {
        let hidden = true;
        const visibleList = ['name', 'primaryTherapist', 'caseManager'];
        if (visibleList.includes(col.field) || (col.headerName === params.pageType) || params.pageType === 'ALL') {
          hidden = false;
        }
        if (col.field === 'facilityName'){
             hidden = appData.selectedFacilityId?.length === 1 || false
        }
        return {
          ...col,
          hide: hidden,
          suppressColumnsToolPanel: hidden
        }
      })
  }

  useEffect(() => {
    // Filter comparison tables data based on user selected on page types 
    // It can be all, PHQ-9, GAD-7
    // console.log(params.pageType, comparisonResult);
    setComparisonResult((row) => {
      return {
        ...row,
        rowData:
          params.pageType === EventReportPageTypes.ALL
            ? row.allRows
            : row.allRows?.filter((data: any) => data?.type === params.pageType),
      };
    });

    // Show column based on page type selections 
    // console.log(params.pageType, patientListColumnDef);

    setPatientListColumnDef((columns: any) => {
      return changeVisibilityOfPatientListColumn(columns);
    })
    
  }, [params.pageType]);

  return (
    <div>
      <div className="font-medium text-xsmd text-gray-600">
        Comparison of results between selected Care Team and General Population
      </div>

      <div className="h-fit ag-theme-alpine w-full mt-5 grid-item">
        {Boolean(comparisonResult.rowData.length) &&
          !getComparisonResultLoading && (
            <AgGrid
              gridStyle={{ height: '270px' }}
              rowData={comparisonResult.rowData}
              columnDefs={resultTableColDef.cols as any}
              headerHeight={80}
              sideBarWidth={450}
              hideSideBar={(clinicianFilter.filterClinicianList.length === 1)}
            />
          )}
        {getComparisonResultLoading && (
            <Skeleton height={270} />
        )}
       
      </div>

      {!comparisonResult.rowData.length && !getComparisonResultLoading && (
          <div className="bg-gray-100 rounded p-4 mb-12 flex justify-center items-center text-sm my-12 text-gray-600">
            No data available
          </div>
        )}

      <div className="font-medium text-xsmd text-gray-600 mt-10">
        List of people that make up the above stats
      </div>

      <div className="h-fit w-full mt-5 mb-20 grid-item">
        {Boolean(populatedStats.length) && !populationLoading && (
          <AgGrid
            gridStyle={{ height: '400px' }}
            rowData={populatedStats}
            columnDefs={patientListColumnDef}
          />
        )}

        {populationLoading && (
          <Skeleton height={270} />
        )}

        
      </div>
      {!populatedStats.length && !populationLoading && (
          <div className="bg-gray-100 rounded p-4 mb-12 flex justify-center items-center text-sm my-12 text-gray-600">
            No data available
        </div>
        )}
    </div>
  );
}
