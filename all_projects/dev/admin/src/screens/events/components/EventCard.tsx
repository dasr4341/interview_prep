/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { EventCard, EventCardVariables } from 'generatedTypes';
import { eventCard } from 'lib/query/events/event-row';
import EventView from './EventView';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';

export function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EventCardView({
  id,
  className,
  lineClamp,
  wrapperClassName,
  flaggedAt,
}: {
  id: string | null | undefined;
  className?: string;
  lineClamp?: string;
  wrapperClassName?: string;
  flaggedAt?: number;
}) {
  const [getEvent, { data: event, loading }] = useMutation<EventCard, EventCardVariables>(eventCard);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);


  useEffect(() => {
    if (id) {
      getEvent({
        variables: {
          getEventDetailsId: id,
          userEventsWhere: {
            userId: {
              equals: user?.id,
            },
          },
        },
      });
    }
  }, [id, flaggedAt]);

  return (
    <div>
      {loading && <Loading />}
      {event?.getEventDetails && (
        <EventView
          options="hide"
          event={event?.getEventDetails}
          className={className}
          lineClamp={lineClamp}
          wrapperClassName={wrapperClassName}
        />
      )}
    </div>
  );
}
