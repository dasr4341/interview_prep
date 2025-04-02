import { SurveyStatusTypePatient } from 'health-generatedTypes';
import { buildUrl, makeRoute } from './lib-router';

export const eventRoutes = {
  events: {
    default: makeRoute('/dashboard/events', {
      name: 'Events',
    }),
    assessment: makeRoute(
      '/dashboard/events/assessment/:eventId',
      {
        name: 'Events',
        build: (eventId: string) =>
          `/dashboard/events/assessment/${eventId}`,
      }
    ),
  },

  eventDetailsPage: {
    machPath: '/dashboard/events',
    match: '/dashboard/events/:id',
    name: 'EventDetailsPage',
    build: (eventID: string) => `/dashboard/events/${eventID}`,
  },

  eventTimeline: {
    match: '/dashboard/events/:patientId/timeline',
    name: 'EventTimeline',
    build: (id: string) => `/dashboard/events/${id}/timeline`,
  },

  //geoFence for events details
  eventsGeoFencingScreen: makeRoute('/dashboard/events/geo-fencing', {
    name: 'EventsGeoFencingScreen',
  }),
  eventsMapView: {
    match: '/dashboard/events/geo-fencing/map-view/:id/:eventId',
    name: 'EventsMapView',
    build: (id: string, eventId: string) =>
      buildUrl(`/dashboard/events/geo-fencing/map-view/${id}/${eventId}`),
  },
  eventsListView: {
    match: '/dashboard/events/geo-fencing/list-view/:id/:eventId',
    name: 'EventsListView',
    build: (patientId: string, eventId: string) =>
      buildUrl(
        `/dashboard/events/geo-fencing/list-view/${patientId}/${eventId}`
      ),
  },
  eventsLastLocations: {
    match: '/dashboard/events/:eventId/:patientId/last-locations',
    name: 'EventsLastknownLocations',
    build: (eventId: string, patientId: string) =>
      buildUrl(`/dashboard/events/${eventId}/${patientId}/last-locations`),
  },
  eventsCreateGeoFencing: {
    match: '/dashboard/events/:eventId/:patientId/geo-fencing/create',
    name: 'EventsCreateGeoFencing',
    build: (eventId: string, patientId: string) =>
      buildUrl(`/dashboard/events/${eventId}/${patientId}/geo-fencing/create`),
  },
  eventsEditGeoFencing: {
    match: '/dashboard/events/:eventId/:patientId/geo-fencing/edit/:fenceId',
    name: 'EventsUpdateGeoFencing',
    build: (eventId: string, fenceId: string, patientId?: string) =>
      buildUrl(
        `/dashboard/events/${eventId}/${fenceId}/geo-fencing/edit/${patientId}`
      ),
  },
  eventNotesPage: makeRoute('/dashboard/events/:id/notes', {
    build: (id: string) => `/dashboard/events/${id}/notes`,
    name: 'EventNotes',
  }),
  eventContactsPage: makeRoute('/dashboard/events/:id/contacts', {
    build: (id: string) => `/dashboard/events/${id}/contacts`,
    name: 'EventContacts',
  }),

  eventContactDetails: {
    name: 'EventsContactDetails',
    match: '/dashboard/events/:id/contacts/details/:contactType/:contactId',
    build: (id: string, contactType: string, contactId: string) =>
      `/dashboard/events/${id}/contacts/details/${contactType}/${contactId}`,
  },

  eventNotesDetails: makeRoute('/dashboard/events/:id/notes/details', {
    build: (id: string) => `/dashboard/events/${id}/notes/details`,
    name: 'EventNotesDetails',
  }),

   // assessments for event
   eventAssessmentsPage: {
    eventAssessmentList: makeRoute('/dashboard/events/:eventId/:id/assessments', {
      name: 'EventAssessmentList',
    }),
    eventOpenOrCompletedAssessment: {
      name: 'EventOpenOrCompletedAssessment',
      match: '/dashboard/events/:eventId/:id/assessments/:type',
      build: (eventId: string, id: string, type: SurveyStatusTypePatient) =>
        buildUrl(`/dashboard/events/${eventId}/${id}/assessments/${type}`),
    },

    eventSubmittedAssessment: {
      match: '/dashboard/events/:patientId/assessments/submitted/:surveyId',
      name: 'EventsAssessmentSubmitted',
      build: (patientId: string, surveyId: string) =>
        `/dashboard/events/${patientId}/assessments/submitted/${surveyId}`,
    },
  },

  eventSurveyDetailsPage: {
    name: 'EventSurveyDetailsPage',
    match: '/dashboard/event/survey/:surveyId/:patientId/:eventId',
    matchPath: '/dashboard/event/survey',
    build: (surveyId: string, userId: string, eventId: string) =>
      buildUrl(`/dashboard/event/survey/${surveyId}/${userId}/${eventId}`),
  },

  eventSurveySubmitPage: {
    name: 'EventSurveySubmitPage',
    match: '/dashboard/event/survey/submit/:surveyId/:eventId',
    matchPath: '/dashboard/event/survey/submit',
    build: (surveyId: string, eventId: string) =>
      buildUrl(`/dashboard/event/survey/submit/${surveyId}/${eventId}`),
  },

  eventsReports: {
    withReport: {
      match: '/dashboard/events/reports/:eventId/with-report',
      name: 'EventsReport',
      build: (eventID: string, query?: { reportType: string }) =>
        buildUrl(`/dashboard/events/reports/${eventID}/with-report`, query),
    },

    noReport: {
      match: '/dashboard/events/reports/:eventId/without-report',
      name: 'EventsReport',
      build: (eventID: string, query?: { reportType: string }) =>
        buildUrl(`/dashboard/events/reports/${eventID}/without-report`, query),
    },
  },

};
