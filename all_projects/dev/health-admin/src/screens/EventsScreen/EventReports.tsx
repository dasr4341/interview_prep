/*  */
import React, { useEffect, useRef, useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import SearchField from 'components/SearchField';
import { getGraphError } from 'lib/catch-error';
import { client } from 'apiClient';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import NoDataFound from 'components/NoDataFound';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import {
  EventCard,
  EventCardVariables,
  EventCard_pretaaHealthEventDetails,
  PatientEventFilterTypes,
  PretaaHealthEventPatientList,
  PretaaHealthEventPatientListVariables,
  PretaaHealthEventPatientList_pretaaHealthEventPatientList,
  ReportFrequency,
} from 'health-generatedTypes';
import { eventPatientListQuery } from 'graphql/eventPatientList.query';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DailyReportRowElement from './component/DailyReportRowElement';
import { config } from 'config';
import { eventCardMutation } from 'graphql/event-card.mutation';
import DateFormat from 'components/DateFormat';
import { routes } from 'routes';
import { format, subDays } from 'date-fns';
import _ from 'lodash';
import { Skeleton } from '@mantine/core';

export interface PatientListStateInterface {
  loading: boolean;
  data: any[];
  take: number;
  moreData: boolean;
  groupCounts: number[];
  error?: string | null;
  patients: PretaaHealthEventPatientList_pretaaHealthEventPatientList[];
}

export interface SearchedPhaseInterface {
  value: string;
  clear: boolean;
}

export default function EventReports() {

  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const reportFrequency: ReportFrequency | null = searchParams.get('reportType') as any;
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<GroupedVirtuosoHandle>(null);


  const [searchedPhase, setSearchedPhase] = useState<SearchedPhaseInterface>({ value: '', clear: false });
  const [tabState, setTabState] = useState<PatientEventFilterTypes>(PatientEventFilterTypes.REPORT);
  const [event, setEvent] = useState<EventCard_pretaaHealthEventDetails | null>(null);
  const [patientListState, setPatientListState] = useState<PatientListStateInterface>({
    loading: false,
    groupCounts: [],
    moreData: true,
    take: config.pagination.defaultTake,
    data: [],
    patients: [],
  });

  const onChangeSearchPhase = (value: string ) => setSearchedPhase((e) => {
    return { ...e, value };
  });

  async function getEvent() {
    const { data: eventResponse } = await client.mutate<EventCard, EventCardVariables>({
      mutation: eventCardMutation,
      variables: {
        eventId: String(eventId),
      },
    });
    if (eventResponse && eventResponse.pretaaHealthEventDetails) {
      setEvent(eventResponse.pretaaHealthEventDetails);
    }
  }

  async function getPatientData(skip: number, refreshData?: boolean) {
    // we are maintaining the previous data, so that we can concatenate will the recent data got from api
    let prevPatientData = patientListState.data ? patientListState.data : [];
    let patients: PretaaHealthEventPatientList_pretaaHealthEventPatientList[] = [];

    setPatientListState({ ...patientListState, loading: true });

    // in case we want to refresh the data
    if (refreshData) {
      prevPatientData = [];
    } else {
      patients = patientListState.patients;
    }

    const patientData: PretaaHealthEventPatientListVariables = {
      eventId: String(eventId),
      search: searchedPhase.value,
      skip: !skip ? skip : patientListState.data.flat().length,
      take: patientListState.take,
      eventFilterType: reportFrequency === ReportFrequency.DAILY ? tabState : PatientEventFilterTypes.REPORT,
    };

    const response = await client.query<PretaaHealthEventPatientList, PretaaHealthEventPatientListVariables>({
      query: eventPatientListQuery,
      variables: patientData,
    });

    if (response.errors) {
      setPatientListState({ ...patientListState, loading: false, error: getGraphError(response.errors).join(',') });
    } else if (response?.data?.pretaaHealthEventPatientList) {
      patients = patients.concat(response.data.pretaaHealthEventPatientList);

      // we have to find if more data is present
      const moreData = response?.data?.pretaaHealthEventPatientList?.length > 0;

      // maintaining an array -> we are calculating the group counts
      const groupCounts: number[] = [];

      // we are arranging the data in groups according to the alphabets
      const data = _(prevPatientData.flat().concat(response.data.pretaaHealthEventPatientList))
        .sortBy((a: any) => a.firstName.toUpperCase())
        .groupBy((a) => {
          if (a.firstName) {
            return a.firstName.toUpperCase()[0];
          }
        })
        .map((comps) => {
          // we are calculating the group counts
          groupCounts.push(comps.length);
          // we are arranging the data in groups according to the alphabets
          return comps;
        })
        .value();

      setPatientListState((e) => {
        return { ...e, loading: false, moreData, groupCounts, data, patients };
      });
    }
  }

  const handleEndReach = (i: number) => patientListState.moreData && getPatientData(i, false);
  const rowRendererVirtue = (index: number) => (
    <DailyReportRowElement
      key={index}
      patient={patientListState?.data.flat()[index]}
    />
  );
  const footerComponent = () =>
    patientListState.loading ? (
      <div className="mt-10 font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
        <Skeleton height={32} />
      </div>
    ) : (
      <div className="p-4 text-center text-gray-150 text-sm">No more data</div>
    );

  useEffect(() => {
    getEvent();
  }, [eventId]);

  useEffect(() => {
    getPatientData(0, true);
  }, [searchedPhase, tabState]);

  useEffect(() => {
    setTabState(
      location.pathname === routes.eventsReports.withReport.build(String(eventId))
        ? PatientEventFilterTypes.REPORT
        : PatientEventFilterTypes.NO_REPORT
    );

    setPatientListState({
      ...patientListState,
      loading: false,
      groupCounts: [],
      moreData: true,
      data: [],
      patients: [],
    });
  }, [location.pathname]);

  const datePeriod = (createdAt: string) => {
    const pastDate = format(subDays(new Date(createdAt), reportFrequency === ReportFrequency.WEEKLY ? 7 : 30), config.dateFormat);
    const currentDate = format(new Date(createdAt), config.dateFormat);
    return pastDate + ' - ' + currentDate;
  };

  function groupContentVirtue(index: number) {
    return (
      <div className="bg-gray-200 px-2 py-1 text-base font-bold">
        {patientListState.data[index][0]?.firstName?.charAt(0).toUpperCase() || ''}
      </div>
    );
  }

  return (
    <div>
      <ContentHeader
        titleLoading={event?.createdAt ? false : true}
        title={
          <div>
            {reportFrequency === ReportFrequency.DAILY && event?.createdAt &&
              <span>Daily Reports (<DateFormat date={event?.createdAt} />)</span>
            }
            {reportFrequency === ReportFrequency.WEEKLY && event?.createdAt &&
              <span>Weekly Reports ({datePeriod(event?.createdAt)})</span>
            }
            {reportFrequency === ReportFrequency.MONTHLY && event?.createdAt &&
              <span>Monthly Reports ({datePeriod(event?.createdAt)})</span>
            }
          </div>
        }
        className="lg:sticky">
        <div className="flex items-center space-x-4 my-5 ">
          <SearchField clear={searchedPhase.clear} onChange={onChangeSearchPhase} />
        </div>

        {/* 
          Note: if report type is Daily only with filter and without filter available 
        */}
        {reportFrequency === ReportFrequency.DAILY &&
          <div className="">
            <div className=" flex items-center mt-2 space-x-4 border-b md:w-full ">
              <div
                onClick={() => navigate(routes.eventsReports.withReport.build(String(eventId), { reportType: String(reportFrequency) }), { replace: true })}
                className={`flex md:text-base text-sm font-bold items-center space-x-2 py-4 cursor-pointer ${
                  tabState === PatientEventFilterTypes.REPORT ? ' border-b-2 border-primary-light text-primary-light' : 'text-primary'
                } `}>
                With Report
              </div>

              <div
                onClick={() => navigate(routes.eventsReports.noReport.build(String(eventId), { reportType: String(reportFrequency) }), { replace: true })}
                className={`flex md:text-base text-sm font-bold items-center space-x-2 py-4 cursor-pointer ${
                  tabState === PatientEventFilterTypes.NO_REPORT ? ' border-b-2 border-primary-light text-primary-light' : 'text-primary'
                } `}>
                No Report
              </div>
            </div>
          </div>
        }
      </ContentHeader>
      <div className="px-5 pb-5 lg:px-16 lg:pb-8 sm: px-15 sm:pb-10 flex flex-col flex-1">
        <div className="flex flex-col flex-1 max-h-screen overflow-auto justify-center">
          {!!searchedPhase.value.length && (
            <div className="flex flex-row justify-end items-center p-2">
              <div className="text-gray-150 font-medium text-sm underline cursor-pointer" onClick={() =>  setSearchedPhase({ value: '', clear: !searchedPhase.clear })}>
                Clear all
              </div>
            </div>
          )}
          {/* for search loading  */}
          {
            patientListState.loading && !patientListState.data.length && (
              <div className="mt-10 font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
                <Skeleton
                  height={32}
                />
              </div>
            )
          }

          <div className="pt-5 lg:pt-8 sm:pt-10 flex flex-col flex-1 justify-center">
            {/* no data found in search */}
            {!patientListState.loading &&
              !patientListState.data.length &&
              (searchedPhase.value ? (
                <NoDataFound type="SEARCH" heading="No results" content="Refine your search and try again" />
              ) : (
                <NoDataFound type="NODATA" heading="No patients yet" />
              ))}

            {/* here we are showing the data in the list using virtual scroll and pagination */}
            {!!patientListState.data.length && (
              <GroupedVirtuoso
                style={{ height: '70vh' }}
                ref={ref}
                groupCounts={patientListState.groupCounts}
                groupContent={groupContentVirtue}
                endReached={handleEndReach}
                itemContent={rowRendererVirtue}
                components={{ Footer: footerComponent }}
              />
            )}
          </div>

          {/* to show error */}
          {!patientListState.loading && patientListState.error && <ErrorMessageFixed message={patientListState.error} />}
        </div>
      </div>
    </div>
  );
}
