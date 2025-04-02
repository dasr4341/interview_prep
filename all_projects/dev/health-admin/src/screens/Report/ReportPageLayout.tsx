import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { routes } from 'routes';
import { ContentHeader } from 'components/ContentHeader';
import './_reportPage-header.scoped.scss';
import ReportFilter from './ReportFilter/ReportFilter';
import {
  EventReportingDateFilterTypes,
  GetBiometricScoreSinglePatientsReport,
  GetBiometricScoreSinglePatientsReportVariables,
  GetRelativeDateRangeFilter,
  GetSummariesCountsReport,
  GetSummariesCountsReportVariables,
  GetSummariesCountsReport_pretaaHealthGetSummariesCountsReport,
  PatientName,
  PatientNameVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useLazyQuery, useQuery } from '@apollo/client';
import { getSummariesCountsReport } from 'graphql/getSummariesCountsReport.query';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { patientNameQuery } from 'graphql/get-patient-name';
import { fullNameController } from 'components/fullName';
import BiometricScale from 'components/biometricScale/BiometricScale';
import { getBiometricScoreSinglePatientsReportQuery } from 'graphql/getBiometricScoreSinglePatientsReport.query';
import { Skeleton } from '@mantine/core';
import SelectDateRangeRelatively from 'components/filters/SelectDateRangeRelatively/SelectDateRangeRelatively';
import { getRelativeDateRangeFilterQuery } from 'graphql/getRelativeDateRangeFilter.query';
import {
  SelectDateRangeRelativelyOptionInterface,
  SelectDateRangeRelativelySubOption,
  SelectedMonthNDateInfoInterface,
} from 'components/filters/SelectDateRangeRelatively/interface/selectDateRangeRelatively.interface';
import { format } from 'date-fns';
import { config } from 'config';
import { CounsellorReportingInterface } from 'lib/store/slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.interface';
import { counsellorReportingSliceActions } from 'lib/store/slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.slice';
import { getEventStatusPayload } from './helper/getEventStatusPayload.helper';
import { cloneDeep } from 'lodash';


export enum ReportPageTypes {
  ANOMALIES_REPORTED = 'ANOMALIES_REPORTED',
  POOR_SURVEY_SCORES = 'POOR_SURVEY_SCORES',
  SELF_HARM_REPORTS = 'SELF_HARM_REPORTS',
  HELP_LINE_CONTACTED = 'HELP_LINE_CONTACTED',
  GEO_FENCES_BREACHED = 'GEO_FENCES_BREACHED',
}

export interface CustomDateRangeFilter {
  startDate: null | undefined | Date;
  endDate: null | undefined | Date;
}

function getDateRangePayload(reportingFilterState: CounsellorReportingInterface, options:SelectDateRangeRelativelyOptionInterface[] ) {
  const mainMenu = options?.find(f => f.value === reportingFilterState.selectedMenu);
  const subMenu = mainMenu?.list.find(f => f.value === reportingFilterState.selectedSubMenu);

  return {
    defaultValue: {
      rangeStartDate: reportingFilterState.rangeStartDate,
      rangeEndDate: reportingFilterState.rangeEndDate,
      inputFieldValue: mainMenu || null,
      selectedMonthNDateInfo: subMenu ?  {
      numberOfDays: reportingFilterState?.lastNumber ? String(reportingFilterState.lastNumber) : null,
      selectedOption: subMenu
      } : null
    },
    options,
    className: 'w-full md:w-9/12 lg:w-full xl:w-9/12 2xl:w-4/5 rounded-xl mt-4 md:mt-0 lg:mt-4 xl:mt-0',
    maxDate: new Date()
  };
}

export default function ReportPageLayout() {
  const location = useLocation();
  const { patientId } = useParams();


  const ref = useRef(null);
  const dispatch = useAppDispatch();

  const reportFilter = useAppSelector((state) => state.counsellorReportingSlice.reportFilter);

  const [tabData, setTabData] = useState<
    GetSummariesCountsReport_pretaaHealthGetSummariesCountsReport[]
    >([]);
  const [biometricScale, setBiometricScale] = useState<number | null>(null);
  const [selectDateRangeRelativelyOption, setSelectDateRangeRelativelyOption] = useState<SelectDateRangeRelativelyOptionInterface[]>([]);

  // -------------- API ----------

  const [getPatientData, { data: patientData, loading: patientDataLoading }] =
    useLazyQuery<PatientName, PatientNameVariables>(patientNameQuery, {
      onError: e => catchError(e, true)
    });

  const [getSummariesCountsReportCallBack, { loading: tabLoading }] =
    useLazyQuery<GetSummariesCountsReport, GetSummariesCountsReportVariables>(
      getSummariesCountsReport,
      {
        onCompleted: (d) => {
          if (d.pretaaHealthGetSummariesCountsReport) {
            const list = cloneDeep(d.pretaaHealthGetSummariesCountsReport).map((e) => {
              // This is needed because of API returns text with spaces @API issues
              if (e.value === 'GEO_FENCES_BREACHED') {
                return {
                  ...e,
                  name: 'Geofences Compromised'
                }
              }

              return e;
            });
            setTabData(list);
          }
        },
        onError: (e) => catchError(e, true),
      }
    );

  // BiometricScore
  const [getBiometricScoreSinglePatients] = useLazyQuery<
    GetBiometricScoreSinglePatientsReport,
    GetBiometricScoreSinglePatientsReportVariables
  >(getBiometricScoreSinglePatientsReportQuery, {
    onCompleted: (d) => {
      const response =
        d.pretaaHealthGetBiometricScoreSinglePatientsReport || [];
      if (response.length > 0) {
        setBiometricScale(response[0].scale);
      } else {
        setBiometricScale(null);
      }
    },
    onError: (e) => catchError(e, true),
  });

  const { loading } = useQuery<GetRelativeDateRangeFilter>(
    getRelativeDateRangeFilterQuery,
    {
      onCompleted: (d) => {
        const formattedData: SelectDateRangeRelativelyOptionInterface[] = [];
        const { filterOf, filterBy } = d.pretaaHealthGetRelativeDateRangeFilter;

        Object.entries(filterBy).forEach((data) => {
          const { label, key } = data[1] as { key: string; label: string };

          const list: SelectDateRangeRelativelySubOption[] = filterOf[key]?.map(
            (l: { key: string; label: string }) => {
              return {
                label: l.label ?? '',
                value: l.key ?? '',
                numberFieldRequired:
                  l?.key.toLowerCase().includes('lastn') || false,
              };
            }
          );

          formattedData.push({
            label: label || '',
            value: key || '',
            list,
          });
          setSelectDateRangeRelativelyOption(formattedData);
        });
      },
      onError: (e) => catchError(e, true),
    }
  );

  // ------------------API Ends----------------------- 

  const loadSummariesCount = useMemo(() => getEventStatusPayload(reportFilter, patientId), [reportFilter, patientId]);

  useEffect(() => {
    if (patientId) {
      getPatientData({
        variables: {
          patientId,
        },
      });
    }
  }, [patientId, getPatientData]);

  useEffect(() => {
    if ((reportFilter.filterUsers.length > 0 && reportFilter.all === false) || (reportFilter.all &&  reportFilter.filterUsers.length === 0) ) {
      getSummariesCountsReportCallBack({ variables: loadSummariesCount });
    }
   
  }, [
    loadSummariesCount.filterUsers,
    loadSummariesCount.all,
    patientId,
    loadSummariesCount.lastNumber,
  ]);

  useEffect(() => {
    if (patientId) {
      (ref.current as any)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      getBiometricScoreSinglePatients({
        variables: {
          filterUsers: [{ patientId }],
          all: false,
        },
      });
    }
  }, [patientId, reportFilter]);

  useEffect(() => {
    if (!reportFilter.all && !reportFilter.filterUsers.length) {
      dispatch(
        counsellorReportingSliceActions.setReportFilter({
          ...reportFilter,
          all: true
        })
      );
    }
  }, [location]);

  
  return (
    <React.Fragment>
      <div ref={ref}></div>
      <ContentHeader
        className="shadow-none"
        disableGoBack={!patientId}
      >
        <div className="block sm:flex sm:justify-between items-center ">
          {patientDataLoading ? (
            <Skeleton
              visible={true}
              width={300}
              height={40}
              className="ml-2"
            />
          ) : (
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-md xl:text-lg">
              {`Reporting/Events s ${
                patientId && !patientDataLoading
                  ? '- ' +
                    fullNameController(
                      patientData?.pretaaHealthPatientDetails
                        .firstName as string,
                      patientData?.pretaaHealthPatientDetails.lastName as string
                    )
                  : ''
              }
          ${
            reportFilter.filterMonthNDate === EventReportingDateFilterTypes.CUSTOM_RANGE
              ? `for ${reportFilter.rangeStartDate} - ${reportFilter.rangeEndDate}`
              : ''
          }`}
            </h1>
          )}
          {patientId && biometricScale !== null && (
            <div className="w-full md:w-2/3 lg:w-1/2 flex justify-endmb-10 h-24">
              <BiometricScale scale={biometricScale} />
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-row space-x-4 items-start md:mt-12 mb-12 md:mb-0">
          <div className=" w-full flex flex-col md:flex-row lg:flex-col xl:flex-row">
            <div
              className="flex mb-16 md:mb-0 lg:mb-16 xl:mb-0 flex-col md:flex-row lg:flex-col xl:flex-row 
            relative  md:mr-4 items-start w-full md:w-7/12 lg:w-full xl:w-8/12 customWidth space-x-0 md:space-x-2 lg:space-x-0 xl:space-x-2">
              <div className="font-medium md:mt-2 text-xsmd text-gray-600 capitalize">
                Filter by:
              </div>
              <SelectDateRangeRelatively
                {...getDateRangePayload(reportFilter, selectDateRangeRelativelyOption)}
                onApply={(
                  dateRange: {
                    startDate: Date | null;
                    endDate: Date | null;
                  } | null,
                  selectedCustomDateRange: SelectedMonthNDateInfoInterface | null,
                  activeMenu: SelectDateRangeRelativelyOptionInterface | null,
                ) => {
                  const filterMonthNDate = selectedCustomDateRange?.selectedOption.value as EventReportingDateFilterTypes ?? EventReportingDateFilterTypes.CUSTOM_RANGE;

                  let rangeStartDate: string | null = null;
                  let rangeEndDate: string | null = null;

                  if (filterMonthNDate === EventReportingDateFilterTypes.CUSTOM_RANGE) {
                     rangeStartDate = dateRange?.startDate ? format(dateRange?.startDate, config.dateFormat) : null;
                     rangeEndDate = dateRange?.endDate ? format(dateRange?.endDate, config.dateFormat) : null;
                  }

                    dispatch(
                      counsellorReportingSliceActions.setReportFilter({
                        ...reportFilter,
                        selectedMenu: activeMenu?.value || null,
                        selectedSubMenu: selectedCustomDateRange?.selectedOption.value || null,
                        filterMonthNDate, 
                        rangeStartDate,
                        rangeEndDate,
                        lastNumber: selectedCustomDateRange?.numberOfDays  ? Number(selectedCustomDateRange?.numberOfDays) : null,
                      })
                    );

                }}
                loading={loading}
              />
            </div>
            {/* {!patientId && ( */}
              <div className="mb-6 md:mb-0 lg:mb-6 xl:mb-0 w-full md:w-4/12 lg:w-full xl:w-6/12 patientListWidth">
                <ReportFilter className="w-full " />
              </div>
            {/* )} */}
          </div>
        </div>
      </ContentHeader>
      <div className=" px-4 lg:px-16 bg-white pt-4 ">
        <div className="overflow-x-scroll md:overflow-hidden">
          <div className="inline-flex md:flex md:flex-row mb-6 md:mb-0">
            {tabData?.map((data) => (
              <Link
                key={data.value}
                to={routes.report.reportPage.getSubRoutes({
                  type: data.value as ReportPageTypes,
                  patientId,
                })}
                className={`flex flex-col cursor-pointer w-32 capitalize py-8 border-r-2 last:border-r-0
              ${location.pathname.includes(data.value) && 'active'} px-4`}>
                {tabLoading && (
                  <div className=" bg-gray-300 w-full rounded h-4"></div>
                )}
                {!tabLoading && (
                  <div
                    className={`font-extrabold text-sm md:text-xmd ${
                      data.count > 0 && data.name === 'Suicidal Ideation'
                        ? 'text-red-600'
                        : 'text-gray-150'
                    }`}>
                    {data.count.toLocaleString()}
                  </div>
                )}

                <div
                  className={`font-medium text-xss mt-3 ${
                    data.count > 0 && data.name === 'Suicidal Ideation'
                      ? 'text-red-600'
                      : 'text-gray-150'
                  }`}>
                  {data.name.replaceAll('_', ' ')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <ContentFrame><Outlet /></ContentFrame>
    </React.Fragment>
  );
}
