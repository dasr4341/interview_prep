import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import {
  EventFilterTypes,
  EventReminder,
  EventReminderVariables,
  PretaaHealthEventSearch,
  PretaaHealthEventSearchVariables,
  PretaaHealthEventSearch_pretaaHealthEventSearch,
  ToggleReadUnread,
  ToggleReadUnreadVariables,
} from 'health-generatedTypes';
import { client } from 'apiClient';
import { eventQuery } from 'graphql/event.query';
import catchError from 'lib/catch-error';
import { TicketsFilterOptions } from 'interface/url-query.interface';
import NoDataFound from 'components/NoDataFound';
import { toggleReadUnreadQuery } from 'graphql/toggleReadUnread.query';
import { toast } from 'react-toastify';
import { eventReminderMutation } from 'graphql/eventReminder.mutation';
import { config } from 'config';
import EventRowSkeletonLoading from 'screens/EventsScreen/skeletonLoading/EventRowSkeletonLoading';
import EventRow from 'screens/EventsScreen/component/EventRow';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FilterStateInterface, VirtuosoInterface } from './EventOrTimeline';
import { useViewportSize } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { range } from 'lodash';
import { useAppSelector } from 'lib/store/app-store';

export interface EventListCurrentStateInterface {
  moreData: boolean;
  data: PretaaHealthEventSearch_pretaaHealthEventSearch[];
}
interface EventFeaturesInterface {
  loading: boolean;
}

interface SelectedDateRange {
  startDate: string;
  endDate: string;
}

export default function EventOrTimelineView({
  filterState,
  searchPhrase,
  patientId,
  clearAll,
  getVisibleRange,
  headerHeight,
}: {
  filterState: FilterStateInterface;
  searchPhrase: string;
  patientId?: string;
  clearAll: () => void;
  getVisibleRange: (val: VirtuosoInterface) => void;
  headerHeight: number;
}) {
  const { height } = useViewportSize();
  const { type } = useParams();

  const [eventState, setEventState] = useState<EventListCurrentStateInterface>({
    moreData: true,
    data: [],
  });
  const [eventFeatures, setEventFeatures] = useState<EventFeaturesInterface>({ loading: false });
  const [eventRange, setEventRange] = useState<VirtuosoInterface>({ startIndex: 0, endIndex: 0 });

  const [selectedEventType, setSelectedEventType] = useState<EventFilterTypes[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<SelectedDateRange>();
  const [isSelectedFilterOption, setIsSelectedFilterOption] = useState(false);
  const isClinicalDirector = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser.isClinicalDirector);

  useEffect(() => {
    const el =
      (filterState?.optionList
        .filter((e) => e.checked)
        .map((e: TicketsFilterOptions) => {
          return e.value;
        }) as EventFilterTypes[]) || [];
    if (selectedEventType.length !== el.length || !!selectedEventType.length) {
      setSelectedEventType(el);
    }
    setSelectedDateRange({
      startDate: filterState.startDate || '',
      endDate: filterState.endDate
    })
  }, [filterState.optionList, filterState.endDate]);

  useEffect(() => {
    if (isClinicalDirector && filterState.optionList.length > 0) {
      setIsSelectedFilterOption(true);
    } else if (!isClinicalDirector) {
      setIsSelectedFilterOption(true);
    } else {
      setIsSelectedFilterOption(false);
    }
  }, [isClinicalDirector, filterState.optionList.length]);

  const [getEventData, { loading: eventStateLoading }] = useLazyQuery<
    PretaaHealthEventSearch,
    PretaaHealthEventSearchVariables
  >(eventQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthEventSearch) {
        const response = d.pretaaHealthEventSearch;
        setEventState({
          moreData: config.pagination.defaultTake <= response.length,
          data: (eventState?.data.length ? eventState.data : []).concat(response),
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  // to toggle the read and unread
  async function toggleReadUnread(id: string) {
    setEventFeatures({ loading: true });
    try {
      const response = await client.query<ToggleReadUnread, ToggleReadUnreadVariables>({
        query: toggleReadUnreadQuery,
        variables: { eventId: id },
      });
      if (response.data.pretaaHealthEventReadToggle) {
        setEventFeatures({ loading: false });
        toast.success(response.data.pretaaHealthEventReadToggle.message);

        const data = eventState.data.map((e) => {
          if (e.id === id) {
            return {
              ...e,
              userevent: e?.userevent?.readAt
                ? { ...e?.userevent, readAt: null }
                : { ...e?.userevent, readAt: String(Date.now()) },
            };
          }
          return e;
        }) as PretaaHealthEventSearch_pretaaHealthEventSearch[];

        setEventState({ ...eventState, data });
      }
    } catch (e: any) {
      setEventFeatures({ loading: false });
      toast.success(e.message);
    }
  }

  const [eventReminder] = useMutation<EventReminder, EventReminderVariables>(eventReminderMutation, {
    onCompleted: (d) => {
      if (d.pretaaHealthEventReminder) {
        toast.success(d.pretaaHealthEventReminder.message);
      }
    },
    onError: (e) => catchError(e, true),
  });

  // to set the event reminder
  function setEventReminder(id: string, reminderType: string) {
    eventReminder({
      variables: {
        eventId: id,
        reminderType,
      },
    });
  }

  function handleEndReach() {
    // load more data, for that we have some prerequisite:
    // 1. see that we have any more data
    if (eventState.moreData) {
      getEventData({
        variables: {
          skip: eventState.data.length,
        },
      });
    }
  }

  function rowRendererVirtue(i: number, e: PretaaHealthEventSearch_pretaaHealthEventSearch) {
    return (
      <EventRow
        showReminder={patientId ? false : true}
        loading={eventFeatures.loading}
        actions={{
          setEventReminder,
          toggleReadUnread,
        }}
        event={e}
        key={i}
        updateEventList={setEventState}
      />
    );
  }

  function footerComponent() {
    if (eventStateLoading) {
      return <EventRowSkeletonLoading />;
    } else if (!eventState.moreData) {
      return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
    }
    return <></>;
  }

  useEffect(() => {
    setEventState({
      data: [],
      moreData: true,
    });

    if (isSelectedFilterOption) {
      getEventData({
        variables: {
          dateRange: {
            startDate: selectedDateRange?.startDate || '',
            endDate: selectedDateRange?.endDate || '',
          },
          eventType: selectedEventType,
          take: config.pagination.defaultTake,
          skip: 0,
          searchPhrase,
          patientId,
        },
      });
    }
  }, [selectedEventType.length, searchPhrase, selectedDateRange?.endDate, isSelectedFilterOption]);

  useEffect(() => {
    getVisibleRange(eventRange);
  }, [eventRange]);

  return (
    <div className="overflow-hidden relative">
      {((filterState.optionList.find((e) => e.checked)?.checked && !type) ||
        (!!filterState.startDate.length && !type) ||
        (!!searchPhrase.length && !type) ||
        (searchPhrase.length > 0 && type)) && (
        <div className="flex flex-row justify-end items-center p-0 sm:p-2 absolute right-2 top-0 md:-top-2">
          <div
            className="text-sm font-medium underline text-gray-150 cursor-pointer"
            onClick={clearAll}>
            Clear all
          </div>
        </div>
      )}
      <div className="pt-8 sm:pt-10 h-full">
        {/* loading animation */}
        {(!filterState.optionList.length || (eventStateLoading && !eventState.data.length)) && (
          <React.Fragment>
            {range(0, 7).map((el) => (
              <div key={el}>
                <EventRowSkeletonLoading />
              </div>
            ))}
          </React.Fragment>
        )}

        {/* in case no data  */}
        {!!filterState.optionList.length &&
          !eventStateLoading &&
          !eventState.data.length &&
          (searchPhrase.trim().length ||
          filterState.endDate.length ||
          filterState.startDate.length ||
          filterState.optionList.filter((e) => e.checked).length ? (
            <div
              className="flex flex-auto justify-center"
              style={{ height: '60vh' }}>
              <NoDataFound
                type="SEARCH"
                heading="No results"
                content="Refine your search and try again"
              />
            </div>
          ) : (
            <div
              className="flex flex-auto justify-center"
              style={{ height: '60vh' }}>
              <NoDataFound
                type="NODATA"
                heading="No events yet"
              />
            </div>
          ))}

        {!!eventState.data.length && (
          <Virtuoso
            style={{ height: `${height - headerHeight - 100}px` }}
            rangeChanged={setEventRange}
            data={eventState.data}
            endReached={handleEndReach}
            itemContent={rowRendererVirtue}
            components={{ Footer: footerComponent }}
          />
        )}
      </div>
    </div>
  );
}
