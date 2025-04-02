/*  */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { eventDetailsMutation } from 'graphql/eventDetails.query';
import {
  EventTypes,
  HealthEventDetails,
  HealthEventDetailsVariables,
  HealthEventDetails_pretaaHealthEventDetails,
  SurveyStatusTypePatient,
  UserPermissionNames,
  UserTypeRole,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import EventDetailAccordion from './EventDetailAccordion';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import EventCardView from '../../EventsScreen/component/EventCard';
import CreateNoteOverlay from 'screens/notes/components/CreateNoteOverlay';
import { routes } from 'routes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import AcceptOrDeclineRequest from 'screens/EventsScreen/component/AcceptOrDeclineRequest';
import PatientDetailsCard from 'components/PatientDetailsCard';
import Button from 'components/ui/button/Button';
import GeofencingReportForEventDetails from './GeofencingReportForEventDetails';
import PageLinks from 'components/PageLink';
import useSelectedRole from 'lib/useSelectedRole';
import { useMutation } from '@apollo/client';
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';

export interface EventDetailsStateInterface {
  loading: boolean;
  data?: HealthEventDetails_pretaaHealthEventDetails | null;
  error?: string | null;
}

export default function EventDetails() {
  const { id } = useParams();
  const eventIdRef = useRef<string>();
  const location = useLocation() as any;
  const navigate = useNavigate();
  const isClinician = useSelectedRole({
    roles: [UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN, UserTypeRole.COUNSELLOR],
  });
  const isEndUser = useSelectedRole({ roles: [UserTypeRole.PATIENT, UserTypeRole.SUPPORTER] });
  const hasNotesPrivilages = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.VIEW);
  const hasGeoFencePrivilages = useGetPrivilege(UserPermissionNames.GEOFENCES, CapabilitiesType.VIEW);

  const isEventTimeline = location.pathname.includes('events');
  const [eventDetailsState, setEventDetailsState] = useState<EventDetailsStateInterface>({ loading: false });
  const [noteCount, setNoteCount] = useState<number>(0);
  const noteCreatePrivilege = useGetPrivilege(UserPermissionNames.NOTES, CapabilitiesType.CREATE);

  const [getEventDetails] = useMutation<HealthEventDetails, HealthEventDetailsVariables>(eventDetailsMutation, {
    onCompleted: (d) => {
      if (d.pretaaHealthEventDetails) {
        if (d.pretaaHealthEventDetails?.noteCount) {
          const countedNote = d.pretaaHealthEventDetails?.noteCount;
          setNoteCount(countedNote);
        }
        setEventDetailsState({
          loading: false,
          data: d.pretaaHealthEventDetails,
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (id && eventIdRef.current !== id) {
      eventIdRef.current = id;
      getEventDetails({ 
        variables: {
          eventId: id
        }
      });
    }
  }, [id])



  function updateListOnCreateNode(
    subject: string,
    text: string,
    noteId?: string,
    canModify?: boolean,
    errorExist?: boolean,
  ) {
    if (errorExist === false) {
      setNoteCount(noteCount + 1);
    }
  }

  return (
    <div className="">
      <ContentHeader
        title="Event Details" className="lg:sticky"
      />
      <ContentFrame className="overflow-auto">
        <div className="event-details">
        <React.Fragment>
      {eventDetailsState.error && <ErrorMessageFixed message={eventDetailsState.error} />}
      {eventDetailsState.data && <EventCardView eventId={String(id)} />}

      {eventDetailsState.data && (
        <AcceptOrDeclineRequest
          updateEventDetails={setEventDetailsState}
          eventType={eventDetailsState.data?.type}
          patientSupporterEventAction={eventDetailsState.data?.patientSupporterEventAction}
          eventId={String(eventDetailsState.data.id)}
        />
      )}

      {eventDetailsState.data?.noReport && (
        <div className="mt-8 bg-white p-8">
          <p className="italic">
            Reports might not be generated if your device isn't syncing correctly. This can occur if your app is not
            open, issues with Bluetooth connectivity, outdated software on the device or app, incompatible mobile
            devices, or poor internet connection. To fix this, ensure Bluetooth is on, update your device and app, and
            check device compatibility. Restart both devices if necessary. Fixing these syncing issues should allow your
            reports to be generated. If issues persist, reach out to device support.
          </p>
        </div>
      )}
      {(eventDetailsState.data?.type === EventTypes.ALERT || eventDetailsState.data?.type === EventTypes.REPORT) &&
        !eventDetailsState.data?.noReport && <EventDetailAccordion />}

      {/* add Geofencing Report  */}
      {eventDetailsState.data?.type === EventTypes.FENCE && (
        <GeofencingReportForEventDetails
          eventFenceData={eventDetailsState.data}
          loading={eventDetailsState.loading}
        />
      )}

      {eventDetailsState?.data?.patientId && <PatientDetailsCard patientId={eventDetailsState?.data?.patientId} />}

      <div className="rounded-xl border border-border bg-white mt-10">
        {hasNotesPrivilages && (
          <PageLinks
            tabIndex={2}
            text="Notes"
            count={noteCount || 0}
            linkTo={
              isEventTimeline
                ? routes.eventNotesPage.build(String(id))
                : routes.patientNotes.build(String(eventDetailsState?.data?.patientId))
            }
          />
        )}

        {isClinician && (
          <>
            <PageLinks
              tabIndex={3}
              text="Contacts"
              linkTo={
                isEventTimeline
                  ? routes.eventContactsPage.build(String(eventDetailsState?.data?.patientId))
                  : routes.patientContact.list.build(String(eventDetailsState?.data?.patientId))
              }
            />
            <PageLinks
              tabIndex={4}
              text="Timeline"
              onClick={() => {
                if (isEventTimeline) {
                  navigate(routes.eventTimeline.build(String(eventDetailsState.data?.patientId)), {
                    state: {
                      eventId: id,
                      eventFilter: String(location?.state?.eventFilter) || '',
                    },
                  });
                } else {
                  navigate(routes.patientTimeline.build(String(eventDetailsState.data?.patientId)));
                }
              }}
              count={eventDetailsState?.data?.timelineCount || 0}
            />
            <PageLinks
              tabIndex={5}
              text="Assessments"
              linkTo={
                isEventTimeline
                  ? routes.eventAssessmentsPage.eventOpenOrCompletedAssessment.build(
                      String(id),
                      String(eventDetailsState?.data?.patientId),
                      SurveyStatusTypePatient.COMPLETED,
                    )
                  : routes.patientSurvey.openOrCompletedSurvey.build(
                      String(eventDetailsState.data?.patientId),
                      SurveyStatusTypePatient.COMPLETED,
                    )
              }
            />

            {hasGeoFencePrivilages && (
              <>
                <PageLinks
                  tabIndex={6}
                  text="Geofences"
                  linkTo={
                    isEventTimeline
                      ? routes.eventsListView.build(String(eventDetailsState?.data?.patientId), String(id))
                      : routes.listView.build(String(eventDetailsState.data?.patientId))
                  }
                />
                <PageLinks
                  tabIndex={7}
                  text="Last Known Location"
                  linkTo={
                    isEventTimeline
                      ? routes.eventsLastLocations.build(String(id), String(eventDetailsState?.data?.patientId))
                      : routes.lastLocations.build(String(eventDetailsState.data?.patientId))
                  }
                />
              </>
            )}
          </>
        )}
      </div>

      {noteCreatePrivilege ? <CreateNoteOverlay onUpdate={updateListOnCreateNode} /> : ''}
      {eventDetailsState.data?.type === EventTypes.ASSESSMENT && isEndUser && (
        <div className="w-full mt-10 hidden">
          <Button
            text="Start Assessment"
            onClick={() => navigate(routes.patientSurveyList.submit.build(String(eventDetailsState.data?.surveyId)))}
          />
        </div>
      )}
    </React.Fragment>
        </div>
      </ContentFrame>
    </div>

    
  );
}
