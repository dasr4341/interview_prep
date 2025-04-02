import { buildUrl, makeRoute } from "./lib-router";

export const pretaaAdminRoutes = {
  owner: {
    matchPath: '/pretaa-admin',
    login: makeRoute('/pretaa-admin/login', { name: 'PretaaAdminLogin' }),

    setPassword: makeRoute('/staff-invitation/:token', {
      name: 'Staff Invitation',
      build: (token: string) => `/staff-invitation/${token}`,
    }),

    clientManagement: makeRoute('/dashboard/pretaa-admin/client-management', {
      name: 'ClientManagement',
    }),
    clientDetails: makeRoute('/dashboard/pretaa-admin/client-management/:clientId', {
      name: 'clientDetails',
      build: (clientId: string) => `/dashboard/pretaa-admin/client-management/${clientId}`,
    }),
    addNewClient: makeRoute('/dashboard/pretaa-admin/client-management/new-client', { name: 'NewClient' }),

    editClient: makeRoute('/dashboard/pretaa-admin/client-management/client/:clientId', {
      name: 'clientEdit',
      build: (clientId: string) => `/dashboard/pretaa-admin/client-management/client/${clientId}`,
    }),
    facilityDetails: makeRoute('/dashboard/pretaa-admin/client-management/facilities-management/facilities/:id', {
      name: 'FacilityDetails',
      build: (id: string) => `/dashboard/pretaa-admin/client-management/facilities-management/facilities/${id}`,
    }),
    
    sendInvitation: makeRoute('/dashboard/pretaa-admin/client-management/client/send-invitation/:id', {
      matchPath: '/dashboard/pretaa-admin/client-management/client/send-invitation',
      name: 'SendInvitation',
      build: (clientId: string, query?: { clientName: string }) => buildUrl(`/dashboard/pretaa-admin/client-management/client/send-invitation/${clientId}`, query),
    }),
    FacilityManagement: makeRoute('/dashboard/pretaa-admin/client-management/facilities-management/facilities/:clientId/list', {
      name: 'FacilityManagement',
      build: (clientId: string) => `/dashboard/pretaa-admin/client-management/facilities-management/facilities/${clientId}/list`,
    }),
    sourceSystem: {
      match: '/dashboard/pretaa-admin/client-management/:clientId/source-system',
      path: makeRoute('/dashboard/pretaa-admin/client-management/source-system', {
        name: 'ClientSourceSystem',
      }),
      build: (clientId: string) =>
        buildUrl(`/dashboard/pretaa-admin/client-management/${clientId}/source-system`),
    },
    addFacility: {
      match: '/dashboard/pretaa-admin/client-management/:clientId/facilities/create',
      name: 'AddFacility',
      build: (clientId: string, query?: { systemId: string; systemName: string, systemSlug: string }) =>
        buildUrl(`/dashboard/pretaa-admin/client-management/${clientId}/facilities/create`, query),
    },
    updateFacility: {
      match: '/dashboard/pretaa-admin/client-management/:clientId/facilities/:facilityId/update',
      name: 'EditFacility',
      build: (clientId: string, facilityId: string, query?: {systemId: string, systemName: string, facilityName: string }) =>
        buildUrl(`/dashboard/pretaa-admin/client-management/${clientId}/facilities/${facilityId}/update`, query),
    },
    facilityChooseLocation: {
      match: '/dashboard/pretaa-admin/client-management/facilities/create/:clientId/choose-location',
      name: 'ChooseLocation',
      build: (clientId: string, query?: { systemId: string }) =>
        buildUrl(`/dashboard/pretaa-admin/client-management/facilities/create/${clientId}/choose-location`, query),
    },

    surveyList: {
      match: '/dashboard/pretaa-admin/survey-list',
      path: makeRoute('/dashboard/pretaa-admin/survey-list', {
        name: 'SurveyList',
      }),
    },
    addSurvey: {
      match: '/dashboard/pretaa-admin/survey-list/create',
      path: makeRoute('/dashboard/pretaa-admin/survey-list/create', {
        name: 'CreateSurvey ',
      }),
    },
    surveyDetails: {
      outlet: makeRoute('/dashboard/pretaa-admin/survey-list/survey', {
        name: 'SurveyDetail',
      }),
      details: makeRoute('/dashboard/pretaa-admin/survey-list/survey/:templateId/details', {
        name: 'SurveyDetails',
        build: (templateId: string) => `/dashboard/pretaa-admin/survey-list/survey/${templateId}/details`,
      }),
      jsonView: makeRoute('/dashboard/pretaa-admin/survey-list/survey/:templateId/json', {
        name: 'SurveyDetails',
        build: (templateId: string) => `/dashboard/pretaa-admin/survey-list/survey/${templateId}/json`,
      }),
    },
    activeUserForFacility: {
      match: '/dashboard/pretaa-admin/client-management/facilities-management/facilities/:facilityId/active-user',
      name: 'ActiveUser',
      build: (facilityId: string) => 
      `/dashboard/pretaa-admin/client-management/facilities-management/facilities/${facilityId}/active-user`
    }
  },
}
