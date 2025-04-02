import { useLazyQuery } from '@apollo/client';
import { config } from 'config';
import { reportingEventSearchQuery } from 'graphql/reportingEventSearch.query';
import {
  EventFilterTypes,
  ReportingEventSearch,
  ReportingEventSearchVariables,
  ReportingEventSearch_pretaaHealthReportingEventSearch,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useAppSelector } from 'lib/store/app-store';
import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import EventRow from 'screens/EventsScreen/component/EventRow';
import { ReportPatientSkeletonLoading } from 'screens/Report/skeletonLoading/ReportPatientSkeletonLoading';
import { getEventStatusPayload } from '../helper/getEventStatusPayload.helper';
import { range } from 'lodash';

interface ListStateInterface {
  moreData: boolean;
  data: ReportingEventSearch_pretaaHealthReportingEventSearch[];
}

export default function ReportEventList({
  patientId,
  eventType = [],
  selfHarm = false,
  trigger
}: {
  patientId: string;
  eventType?: EventFilterTypes[];
  selfHarm?: boolean;
  trigger?: boolean
}) {
  const [listState, setListState] = useState<ListStateInterface>({
    moreData: true,
    data: [],
  });
  const reportFilter = useAppSelector(state => state.counsellorReportingSlice.reportFilter);

  const [reportTabEventCallBack, { loading }] = useLazyQuery<
    ReportingEventSearch,
    ReportingEventSearchVariables
  >(reportingEventSearchQuery, {
    onCompleted: (d) => {
      if (!!d.pretaaHealthReportingEventSearch.length) {
        setListState((prevData) => {
          return {
            moreData:
              d.pretaaHealthReportingEventSearch.length ===
              config.pagination.defaultTake,
            data: prevData.data.concat(d.pretaaHealthReportingEventSearch),
          };
        });
      }
    },
    onError: (e) => catchError(e, true)
  });

  function callAPIs(skip?: number) {
    if (patientId) {
      const { filterMonthNDate, rangeEndDate, rangeStartDate, lastNumber, all } = getEventStatusPayload(reportFilter, patientId);
      reportTabEventCallBack({
        variables: {
          patientId,
          eventType,
          selfHarm,
          trigger,
          skip: skip || 0,
          take: config.pagination.defaultTake,
          filterMonthNDate, rangeEndDate, rangeStartDate, lastNumber, all
        },
      });
    }
  }

  function handleEndReach(i: number) {
    if (listState.moreData) {
      callAPIs(i + 1);
    }
  }
  function rowRendererVirtue(
    i: number,
    data: ReportingEventSearch_pretaaHealthReportingEventSearch
  ) {
    return (
      <EventRow
        showReminder={patientId ? false : true}
        loading={loading}
        event={data}
        key={i}
      />
    );
  }
  function footerComponent() {
    if (loading) {
      return <ReportPatientSkeletonLoading />;
    }
    if (
      listState.moreData === false
    ) {
      return (
        <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">
          No more data
        </div>
      );
    }
    return <></>;
  }

  useEffect(() => {
    setListState({
      data: [],
      moreData: true
    });
    callAPIs();
    // 
  }, [patientId, reportFilter]);

  return (
    <div className="py-12">
      {loading && !listState.data.length && (
        <React.Fragment>
        { range(0, 5).map(el => (
         <div key={el}><ReportPatientSkeletonLoading /></div>
        )) }
      </React.Fragment>
      )}
      {!!listState.data.length && (
        <Virtuoso
          style={{ height: '40vh' }}
          data={listState.data}
          endReached={handleEndReach}
          itemContent={rowRendererVirtue}
          components={{ Footer: footerComponent }}
        />
      )}
    </div>
  );
}
