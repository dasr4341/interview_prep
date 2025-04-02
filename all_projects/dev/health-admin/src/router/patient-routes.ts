import { SurveyStatusTypePatient } from 'health-generatedTypes';
import { buildUrl, makeRoute } from './lib-router';

export const patientRoutes = {
  //geoFence for patients
  geoFencingScreen: makeRoute('/dashboard/patient/list/geo-fencing', {
    name: 'GeoFencingScreen',
  }),
  mapView: {
    match: '/dashboard/patient/list/geo-fencing/map-view/:id',
    name: 'MapView',
    build: (id: string) =>
      buildUrl(`/dashboard/patient/list/geo-fencing/map-view/${id}`),
  },
  listView: {
    match: '/dashboard/patient/list/geo-fencing/list-view/:id',
    name: 'ListView',
    build: (patientId: string) =>
      buildUrl(`/dashboard/patient/list/geo-fencing/list-view/${patientId}`),
  },
  createGeoFencing: {
    match: '/dashboard/patient/list/:patientId/geo-fencing/create',
    name: 'CreateGeoFencing',
    build: (patientId: string) =>
      buildUrl(`/dashboard/patient/list/${patientId}/geo-fencing/create`),
  },
  editGeoFencing: {
    match: '/dashboard/patient/list/:patientId/geo-fencing/edit/:fenceId',
    name: 'UpdateGeoFencing',
    build: (fenceId: string, patientId?: string) =>
      buildUrl(
        `/dashboard/patient/list/${patientId}/geo-fencing/edit/${fenceId}`
      ),
  },
  lastLocations: {
    match: '/dashboard/patient/list/:patientId/last-locations',
    name: 'Last known locations',
    build: (patientId: string) =>
      buildUrl(`/dashboard/patient/list/${patientId}/last-locations`),
  },
  patientNotesDetails: makeRoute('/dashboard/patient/notes-details/:id', {
    build: (id: string) => `/dashboard/patient/notes-details/${id}`,
    name: 'Notes',
  }),
  

  patientNotes: makeRoute('/dashboard/patient/list/:id/notes', {
    build: (id: string) => `/dashboard/patient/list/${id}/notes`,
    name: 'PatientNotes',
  }),

  // patient
  patientList: {
    match: '/dashboard/patient/list',
    name: 'PatientList',
  },

  patientDetails: makeRoute('/dashboard/patient/list/:id', {
    name: 'patientDetails',
    build: (id: string) => `/dashboard/patient/list/${id}`,
  }),
  patientTimeline: makeRoute('/dashboard/patient/list/:patientId/timeline', {
    name: 'patientDetails',
    build: (id: string) => `/dashboard/patient/list/${id}/timeline`,
  }),

  timelineEventDetails: makeRoute('/dashboard/patient/event/:id', {
    name: 'PatientTimelineDetailsPage',
    build: (eventID: string) => `/dashboard/patient/event/${eventID}`,
  }),
  patientTimelineDetails: makeRoute('/dashboard/patient/list/:patientId/timeline/details', {
    name: 'PatientTimelineDetails',
    build: (id: string) => `/dashboard/patient/list/${id}/timeline`,
  }),
  patientContact: {
    list: {
      name: 'PatientContacts',
      match: '/dashboard/patient/list/:id/contacts',
      build: (id: string) => `/dashboard/patient/list/${id}/contacts`,
    },
    details: {
      name: 'PatientContacts',
      match:
        '/dashboard/patient/list/:id/contacts/details/:contactType/:contactId',
      build: (id: string, contactType: string, contactId: string) =>
        `/dashboard/patient/list/${id}/contacts/details/${contactType}/${contactId}`,
    },
  },
  patientSurvey: {
    surveyList: makeRoute('/dashboard/patient/list/:id/surveys', {
      name: 'SurveyList',
    }),
    openOrCompletedSurvey: {
      name: 'OpenOrCompletedSurvey',
      match: '/dashboard/patient/list/:id/surveys/:type',
      build: (id: string, type: SurveyStatusTypePatient) =>
        buildUrl(`/dashboard/patient/list/${id}/surveys/${type}`),
    },
    submittedSurvey: {
      match: '/dashboard/patient/list/:patientId/surveys/submitted/:surveyId',
      name: 'SurveySubmitted',
      build: (patientId: string, surveyId: string) =>
        `/dashboard/patient/list/${patientId}/surveys/submitted/${surveyId}`,
    },
  },

   // patient survey
   patientSurveyList: {
    list: makeRoute('/dashboard/patient/surveys/list', { name: 'Surveys ' }),
    open: {
      match: '/dashboard/patient/surveys/list/open',
      name: 'Surveys open',
      build: (query: { showModal: boolean }) =>
        buildUrl('/dashboard/patient/surveys/list/open', query),
    },
    completed: makeRoute('/dashboard/patient/surveys/list/completed', {
      name: 'Surveys completed',
    }),
    submitted: {
      name: 'Surveys form submitted',
      match: '/dashboard/patient/surveys/list/submitted/:surveyId',
      matchPath: '/dashboard/patient/surveys/list/submitted',
      build: (id: string) =>
        buildUrl(`/dashboard/patient/surveys/list/submitted/${id}`),
    },
    submit: {
      match: '/dashboard/patient/surveys/list/submit/:surveyId',
      label: 'Surveys Submit',
      name: 'survey-submit',
      build: (surveyId: string) =>
        `/dashboard/patient/surveys/list/submit/${surveyId}`,
      matchPath: '/dashboard/patient/surveys/list/submit',
    },
    preview: makeRoute('/dashboard/patient/surveys/list/preview/:id', {
      build: (id: string) => `/dashboard/patient/surveys/list/preview/${id}`,
      name: 'Surveys Submit',
    }),
  },


  patientSurveyDetailsPage: {
    name: 'PatientSurveyDetailsPage',
    match: '/dashboard/patient/survey/:surveyId/:patientId/:eventId',
    matchPath: '/dashboard/patient/survey',
    build: (surveyId: string, userId: string, eventId: string) =>
      buildUrl(`/dashboard/patient/survey/${surveyId}/${userId}/${eventId}`),
  },


};
