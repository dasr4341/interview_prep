import { ContentHeader } from 'components/ContentHeader';
import SearchField from 'components/SearchField';
import { config } from 'config';
import { eventPatientListQuery } from 'graphql/eventPatientList.query';
import {
  EventCard,
  EventCardVariables,
  PatientEventFilterTypes,
  PretaaHealthEventPatientList,
  PretaaHealthEventPatientListVariables,
  PretaaHealthEventPatientList_pretaaHealthEventPatientList,
} from 'health-generatedTypes';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import NoDataFound from 'components/NoDataFound';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import DailyReportRowElement from './component/DailyReportRowElement';
import catchError from 'lib/catch-error';
import { useLazyQuery, useMutation } from '@apollo/client';
import { eventCardMutation } from 'graphql/event-card.mutation';
import _ from 'lodash';
import { format } from 'date-fns';
import FilteredEventsAssessmentModal from './component/FilteredEventsAssessmentModal/FilteredEventsAssessmentModal';
import { fullNameController } from 'components/fullName';
import { Skeleton } from '@mantine/core';



export interface PatientListStateInterface {
  data: PretaaHealthEventPatientList_pretaaHealthEventPatientList[][];
  take: number;
  moreData: boolean;
  groupCounts: number[];
  error?: string | null;
}

export interface SearchedPhaseInterface {
  value: string;
  clear: boolean;
}

export default function FilteredEvents() {
  
  const { eventId } = useParams();
  const location = useLocation();

  const ref = useRef<GroupedVirtuosoHandle>(null);

  const [modalState, setModalState] = useState<{
    state: boolean;
    title: string;
    patientId: string;
  }>({
    state: false,
    title: '',
    patientId: '',
  });
  const [searchedPhase, setSearchedPhase] = useState<SearchedPhaseInterface>({
    value: '',
    clear: false,
  });
  const [patientListState, setPatientListState] =
    useState<PatientListStateInterface>({
      groupCounts: [],
      moreData: true,
      take: config.pagination.defaultTake,
      data: [],
    });

  const onChangeSearchPhase = (value: string) =>
    setSearchedPhase((e) => {
      return { ...e, value };
    });

  const [getEvent, { data: eventResponse, loading: eventLoading }] =
    useMutation<EventCard, EventCardVariables>(eventCardMutation, {
      variables: {
        eventId: String(eventId),
      },
    });

  const [getPatientList, { loading: patientListLoading }] = useLazyQuery<
    PretaaHealthEventPatientList,
    PretaaHealthEventPatientListVariables
  >(eventPatientListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthEventPatientList) {
        // we have to find if more data is present
        const moreData = d?.pretaaHealthEventPatientList?.length > 0;

        // maintaining an array -> we are calculating the group counts
        const groupCounts: number[] = [];

        // we are arranging the data in groups according to the alphabets
        const data = _(
          patientListState.data.flat().concat(d.pretaaHealthEventPatientList)
        )
          .sortBy((a: any) => a.firstName)
          .groupBy((a) => {
            if (a.firstName) {
              return a.firstName[0];
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
          return {
            ...e,
            moreData,
            groupCounts,
            data,
          };
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  async function callApis(skip: number, refreshData?: boolean) {
    // in case we want to refresh the data
    if (refreshData) {
      setPatientListState({ ...patientListState, data: [] });
    }
    const variables: PretaaHealthEventPatientListVariables = {
      eventId: String(eventId),
      search: searchedPhase.value,
      skip: !skip ? skip : patientListState.data.flat().length,
      take: patientListState.take,
      eventFilterType: PatientEventFilterTypes.ASSESSMENT,
    };
    getPatientList({
      variables,
    });
  }

  const handleEndReach = (i: number) =>
    patientListState.moreData && callApis(i, false);
  const rowRendererVirtue = (index: number) => (
    <DailyReportRowElement
      key={index}
      onClick={() => {
        const data = patientListState?.data.flat()[index];
        setModalState({
          title: fullNameController(data.firstName, data.lastName) + "'s",
          state: !modalState.state,
          patientId: data.id,
        });
      }}
      patient={patientListState?.data.flat()[index]}
    />
  );

  const groupedContent = (index: number) => {
    return (
      <div className="bg-gray-200 px-2 py-1 text-base font-bold">
        {patientListState.data[index][0]?.firstName?.charAt(0) || ''}
      </div>
    );
  }

  const footerComponent = () => {
    if (patientListLoading) {
     return (
      <div className="mt-10 font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
        <Skeleton height={32} />
      </div>
     )
    }
    return (
      <div className="p-4 text-center text-gray-150 text-sm">No more data</div>
    );
  };

  useEffect(() => {
    if (eventId) {
      getEvent();
    }
  }, [eventId]);

  useEffect(() => {
    setPatientListState({
      ...patientListState,
      groupCounts: [],
      moreData: true,
      data: [],
    });
    callApis(0, true);
  }, [location.pathname, searchedPhase]);

  return (
    <React.Fragment>
      <ContentHeader
        titleLoading={eventLoading}
        title={
          <React.Fragment>
            Assessments completed on{' '}
            {eventResponse?.pretaaHealthEventDetails.createdAt &&
              format(new Date(eventResponse?.pretaaHealthEventDetails.createdAt), config.dateFormat)}
          </React.Fragment>
        }
        className="lg:sticky">
        <div className="flex items-center space-x-4 my-5 ">
          <SearchField
            clear={searchedPhase.clear}
            onChange={onChangeSearchPhase}
          />
        </div>
      </ContentHeader>
      <div className="px-5 pb-5 lg:px-16 lg:pb-8 sm: px-15 sm:pb-10 flex flex-col flex-1">
        <div className="flex flex-col flex-1 max-h-screen overflow-auto justify-center">
          {!!searchedPhase.value.length && (
            <div className="flex flex-row justify-end items-center p-2">
              <button
                className="text-gray-150 font-medium text-sm underline cursor-pointer"
                onClick={() => setSearchedPhase({ value: '', clear: !searchedPhase.clear })}>
                Clear all
              </button>
            </div>
          )}
          {/* for search loading  */}
          {patientListLoading && !patientListState.data.length && (
            <div className="mt-10 font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
              <Skeleton height={32} />
            </div>
          )}

          <div className="pt-5 lg:pt-8 sm:pt-10 flex flex-col flex-1 justify-center">
            {/* no data found in search */}
            {!patientListLoading &&
              !patientListState.data.length &&
              (searchedPhase.value ? (
                <NoDataFound
                  type="SEARCH"
                  heading="No results"
                  content="Refine your search and try again"
                />
              ) : (
                <NoDataFound
                  type="NODATA"
                  heading="No patients yet"
                />
              ))}

            {/* here we are showing the data in the list using virtual scroll and pagination */}
            {!!patientListState.data.length && (
              <GroupedVirtuoso
                style={{ height: '70vh' }}
                ref={ref}
                groupCounts={patientListState.groupCounts}
                // groupContent={(index) => {
                //   return (
                //     <div className="bg-gray-200 px-2 py-1 text-base font-bold">
                //       {patientListState.data[index][0]?.firstName?.charAt(0) || ''}
                //     </div>
                //   );
                // }}

                groupContent={groupedContent}

                
                endReached={handleEndReach}
                itemContent={rowRendererVirtue}
                components={{ Footer: footerComponent }}
              />
            )}
          </div>

          {/* to show error */}
          {!patientListLoading && patientListState.error && <ErrorMessageFixed message={patientListState.error} />}
        </div>
      </div>
      {modalState.state && eventId && (
        <FilteredEventsAssessmentModal
          title={modalState.title}
          onClose={() => setModalState({ ...modalState, state: false })}
          parentEventId={eventId}
          patientId={modalState.patientId}
        />
      )}
    </React.Fragment>
  );
}
