import React, { useEffect, useRef, useState } from 'react';
import { client } from '../../../apiClient';
import { eventCardMutation } from '../../../graphql/event-card.mutation';
import { EventCard, EventCardVariables, EventCard_pretaaHealthEventDetails, EventTypes } from 'health-generatedTypes';
import SafeHtml from 'components/SafeHtml';
import DateFormat from 'components/DateFormat';
import EventRowSkeletonLoading from '../skeletonLoading/EventRowSkeletonLoading';
import { format } from 'date-fns';
import { config } from 'config';

export default function EventCardView({ eventId, assignedDate }: { eventId: string; assignedDate?: string }) {
  const eventRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<EventCard_pretaaHealthEventDetails | null>(null);

  async function getEvent() {
    setLoading(true);
    const { data: eventData } = await client.mutate<EventCard, EventCardVariables>({
      mutation: eventCardMutation,
      variables: {
        eventId,
      },
    });
    if (eventData) {
      setEvent(eventData.pretaaHealthEventDetails);
    }
    setLoading(false);
  }

  const eventText = (s: string) => {
    const textHighlight = s.replace('link no-underline', 'text-black font-bold');
    if (event?.type === EventTypes.FENCE) {
      return textHighlight.slice(0, -1).concat(` at ${format(new Date(event.eventAt), config.timeFormat)}.`);
    } else {
      return textHighlight;
    }
  };

  useEffect(() => {
    // Prevent Multiple Call
    if (eventRef.current !== eventId && eventId) {
      getEvent();
      eventRef.current = eventId;
    }
  }, [eventId]);

  return (
    <React.Fragment>
      {loading && <EventRowSkeletonLoading />}
      {!loading && event?.text && (
        <React.Fragment>
          <div className="flex flex-col py-6 px-5 border-b border-gray-100 relative bg-white border rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="flex-1 cursor-default">
                <h3 className="font-medium text-xs text-primary opacity-50 mb-1  uppercase">{event?.type.replaceAll('_', ' ')}</h3>
                <div className="text-primary opacity-75">
                  {event?.text && (
                    <div className="mt-0 cursor-default">
                      <SafeHtml
                        rawHtml={eventText(event.text)}
                      />
                      {event.surveyDetails?.createdAt && (event.type === EventTypes.ALERT || event.type === EventTypes.ASSESSMENT) && (
                        <SafeHtml
                          className="normal-case italic text-gray-150 font-medium text-base"
                          rawHtml={String(`Assessment was issued on ${format(new Date(assignedDate ? assignedDate : event.surveyDetails?.createdAt), config.dateFormat)}`)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray opacity-50" data-test-id="event-created-at">
                {event?.createdAt && <DateFormat date={event.createdAt} />}
              </span>
              
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
