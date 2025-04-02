/*  */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import EventRowPopOver from './EventRowPopover';
import {
  EventTypes,
  PretaaHealthEventSearch_pretaaHealthEventSearch,
  ReportingEventSearch_pretaaHealthReportingEventSearch,
  UserTypeRole,
} from 'health-generatedTypes';
import DateFormat from 'components/DateFormat';
import SafeHtml from 'components/SafeHtml';
import './_event-row.scoped.scss';
import AcceptOrDeclineRequest from './AcceptOrDeclineRequest';
import { EventListCurrentStateInterface } from 'components/EventOrTimelineView';
import { format } from 'date-fns';
import { config } from 'config';
import { Spoiler } from '@mantine/core';
import useSelectedRole from 'lib/useSelectedRole';

export default function EventRow({
  loading,
  actions,
  event,
  showReminder,
  updateEventList,
}: {
  loading: boolean;
  actions?: {
    toggleReadUnread: (id: string) => void;
    setEventReminder: (id: string, reminderType: string) => void;
  };
  event: PretaaHealthEventSearch_pretaaHealthEventSearch | ReportingEventSearch_pretaaHealthReportingEventSearch;
  showReminder?: boolean;
  updateEventList?: React.Dispatch<
    React.SetStateAction<EventListCurrentStateInterface>
  >;
}) {
  const navigate = useNavigate();
  const isEndUser = useSelectedRole({ roles: [UserTypeRole.PATIENT, UserTypeRole.SUPPORTER] });
  const isClinician = useSelectedRole({ roles: [UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN, UserTypeRole.COUNSELLOR] });

  function getRoutes() {
    const surveyId = event.surveyAssignmentId;
    const userId = event?.patientId;
    

    const isCompletedAssessment = event.surveyAssignmentDetails?.isCompleted;
    const isConsolidatedReport = event.consolidated &&  event.type === EventTypes.REPORT;
    const isTimelineView = location?.pathname.includes(routes.patientList.match);
    const isConsolidatedAssessment = event.consolidated &&  event.type === EventTypes.ASSESSMENT;
    const isAssessment = Boolean(event.surveyAssignmentDetails);
    const isPatientTimeline = location.pathname.includes('patient');

    

    /*
    Assessment 
    */
   if (isTimelineView) {
    if (isCompletedAssessment && isClinician) {
      return routes.patientSurvey.submittedSurvey.build(
        String(userId),
        String(surveyId),
      );
     }

     if (isPatientTimeline) {
      return routes.timelineEventDetails.build(String(event.id));
     }

      return routes.timelineEventDetails.build(String(event.id)); 
   } else {
    if (isConsolidatedAssessment) {
      return routes.events.assessment.build(event.id);
    }

    if (isCompletedAssessment && isClinician) {
      return routes.eventSurveyDetailsPage.build(
        String(surveyId),
        String(userId),
        event.id
      );
     }
  
  
      if (isEndUser && isAssessment && !event.surveyAssignmentDetails?.isCompleted) {
          return routes.eventSurveySubmitPage.build(String(surveyId), String(event.id));
      } else if (isEndUser && event.surveyAssignmentDetails?.isCompleted) {
        return routes.eventSurveyDetailsPage.build(String(surveyId), String(userId), String(event.id));
      }
   }

    /*
    Report
    */

    if (
      isClinician && isConsolidatedReport
    ) {
      return routes.eventsReports.withReport.build(event.id, {
        reportType: event.frequency,
      });
    }
   
    /*
    And for other redirect to event details page 
    */
    return routes.eventDetailsPage.build(String(event.id));
  }

  return (
    <div
      data-testid="event-row"
      cy-event-status={`${event?.userevent?.readAt ? 'read' : 'unread'}`}
      className={`flex flex-col px-3 md:px-5 border-b border-gray-100 relative 
      ${event.type === EventTypes.REQUESTS && event.patientSupporterEventAction === null && 'bg-register'}
      ${event?.userevent?.readAt ? 'read-block' : 'unread-block'}`}>
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Info:  This is required */}
        <span className="link no-underline hidden"></span>
        {/* Info:  This is required */}
        <div className="flex-1 cursor-pointer py-6">
          <Spoiler
            maxHeight={70}
            showLabel="Show more"
            hideLabel="Hide"
            transitionDuration={0}>
            <div
              className="flex flex-col"
              onClick={() => {
                const url = getRoutes();
                navigate(url);
              }}>
              <h3 className="font-semibold text-xs text-primary opacity-50 mb-0 uppercase">
                {event.type.replaceAll('_', ' ')}
              </h3>
              <div
                className="opacity-75 line-clamp-7"
                data-testid="event-desc">
                <div className="mt-0 font-bold note-text capitalize">
                  <SafeHtml
                    id="event-heading"
                    rawHtml={String(
                      event.type === EventTypes.FENCE
                        ? event.text?.slice(0, -1).concat(` at ${format(new Date(event.eventAt), config.timeFormat)}.`)
                        : event.text
                    )}
                  />
                </div>
              </div>
            </div>
          </Spoiler>
          <AcceptOrDeclineRequest
            eventType={event.type}
            patientSupporterEventAction={event.patientSupporterEventAction}
            eventId={event.id}
            updateEventList={updateEventList}
          />
        </div>
   
          <span className="text-sm text-gray opacity-50">
            <DateFormat date={event.createdAt} />
          </span>

        {actions && (
          <React.Fragment>
            <div className="w-px bg-gray-400 h-4"></div>
            <EventRowPopOver
              showReminder={showReminder}
              loading={loading}
              setEventReminder={actions.setEventReminder}
              toggleReadUnread={actions.toggleReadUnread}
              event={event}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

