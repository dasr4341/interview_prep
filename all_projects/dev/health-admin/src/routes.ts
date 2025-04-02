import { SurveyCountPerParticipantType, SurveyTemplateTypes } from 'health-generatedTypes';
import { buildUrl, makeRoute } from 'router/lib-router';

import { eventRoutes } from './router/event-routes';
import { patientRoutes } from 'router/patient-routes';
import { authRoutes } from 'router/auth-routes';
import { onboardingRoutes } from 'router/onboardingRoutes';
import { pretaaAdminRoutes } from 'router/pretaa-admin';
import { geofenceRoutes } from 'router/geofenceRoutes';
import { clinicianReport } from 'router/clinicianReport';
import { userRoutes } from 'router/userRoutes';
import { employeeManagementRoutes } from 'router/employeeManagementRoutes';
import { assessmentReportRoutes } from 'router/assesmentReportRoutes';
import { eventReportRoutes } from 'router/eventReportRoutes';
import { assessmentRoutes } from 'router/assessmentRoutes';

// Note: these need to be sorted in the order they should appear in
// a navigation breadcrumb.
export const routes = {
  ...authRoutes,
  ...eventRoutes,
  ...patientRoutes,
  ...onboardingRoutes,
  ...pretaaAdminRoutes,
  ...geofenceRoutes,
  ...clinicianReport,
  ...userRoutes,
  ...employeeManagementRoutes,
  ...assessmentReportRoutes,
  ...eventReportRoutes,
  ...assessmentRoutes,
  ...pretaaAdminRoutes,

  home: makeRoute('/', { label: 'home', name: 'HOME' }),

  // supporter payment
  supporterPayment: makeRoute('/subscription', { name: 'Supporter Payment' }),
  supporterSuccessPayment: makeRoute('/subscription/payment/successful', {
    name: 'Supporter Success Payment',
  }),
  supporterCanceledPayment: makeRoute('/subscription/payment/cancel', {
    name: 'Supporter Cancel Payment',
  }),

  // dashboard
  dashboard: makeRoute('/dashboard', { name: 'dashboard' }),

  //Google Map
  googlemap: makeRoute('/dashboard/map', { name: 'GoogleMap' }),

  //profile contacts
  profileContacts: makeRoute('/dashboard/settings/contacts', {
    name: 'ProfileContacts',
  }),
  profileContactFormCreate: makeRoute('/dashboard/settings/profile/contact/create', { name: 'CreateContact' }),
  profileContactFormEdit: {
    match: '/dashboard/settings/profile/contact/edit/:id',
    name: 'EditContactForPatient',
    build: (id: string) => buildUrl(`/dashboard/settings/profile/contact/edit/${id}`),
  },
  profileContactDetails: {
    name: 'ProfileContactDetails',
    match: '/dashboard/settings/contacts/list/details/:contactType/:contactId',
    build: (contactType: string, contactId: string) =>
      `/dashboard/settings/contacts/list/details/${contactType}/${contactId}`,
  },
  contactsDetails: makeRoute('/dashboard/contacts/details/:id', {
    name: 'PretaaContactsDetails',
  }),

  //Settings
  profileSso: makeRoute('/dashboard/settings/profile/sso', {
    name: 'ProfileSso',
  }),
  profileNonSso: makeRoute('/dashboard/settings/profile/non-sso', {
    name: 'ProfileNonSso',
  }),
  twoFactorAuth: makeRoute('/dashboard/settings/authentication', {
    name: 'TwoFactorAuthentication',
  }),
  notification: makeRoute('/dashboard/settings/notification', {
    name: 'Notification',
  }),
  changePassword: makeRoute('/dashboard/settings/profile/change-password', {
    name: 'ProfileChangePassword',
  }),

  // notes
  notes: makeRoute('/dashboard/settings/notes', {
    label: 'notes',
    name: 'Notes',
  }),
  notesDetails: makeRoute('/dashboard/settings/notes/:id', {
    build: (id: string) => `/dashboard/settings/notes/${id}`,
    name: 'Notes',
  }),

  patientSetPassword: makeRoute('/patient-invitation/:token', {
    name: 'Patient invitation',
    build: (token: string) => `/patient-invitation/${token}`,
  }),

  // Others
  feedback: makeRoute('/dashboard/feedback', {
    label: 'patientFeedback',
    name: 'PatientFeedback',
  }),

  // Start Counsellor Surveys
  counsellorAssessmentTemplate: makeRoute('/dashboard/assessment/template', {
    name: 'CounsellorAssessmentTemplate',
  }),
  counsellorAssessmentTemplateList: {
    name: 'CounsellorAssessmentTemplateList',
    match: '/dashboard/assessment/template/list/:type',
    build: (type: SurveyTemplateTypes) => buildUrl(`/dashboard/assessment/template/list/${type}`),
  },

  assessmentTemplateDetailsView: makeRoute('/dashboard/assessment/template/details', {
    name: 'AssessmentDetailsTemplateView',
  }),
  assessmentTemplateDetails: {
    name: 'AssessmentTemplateDetails',
    match: '/dashboard/assessment/template/details/:templateId',
    build: (templateId: string, query?: { type: string }) => buildUrl(`/dashboard/assessment/template/details/${templateId}`, query),
  },

  assessmentScheduleCreateCampaign: {
    name: 'AssessmentScheduleCampaignCreate',
    match: '/dashboard/assessment/template/campaigns/create/:templateId',
    build: (templateId: string) => buildUrl(`/dashboard/assessment/template/campaigns/create/${templateId}`),
  },
  assessmentScheduleEditCampaign: {
    name: 'AssessmentScheduleCampaignEdit',
    match: '/dashboard/assessment/template/campaigns/edit/:templateId/:assessmentId',
    build: (templateId: string, assessmentId: string) =>
      buildUrl(`/dashboard/assessment/template/campaigns/edit/${templateId}/${assessmentId}`),
  },
  assessmentScheduleDuplicateCampaign: {
    name: 'AssessmentScheduleDuplicateCampaign',
    match: '/dashboard/assessment/template/campaigns/duplicate/:templateId/:duplicateId',
    build: (templateId: string, duplicateId: string) =>
      buildUrl(`/dashboard/assessment/template/campaigns/duplicate/${templateId}/${duplicateId}`),
  },
  assessmentTemplatePreview: {
    match: '/dashboard/assessment/template/preview/:templateId',
    name: 'AssessmentTemplatePreview',
    build: (templateId: string) => buildUrl(`/dashboard/assessment/template/preview/${templateId}`),
  },
  // end Counsellor Surveys

  // Surveys
  mobileTemplate: makeRoute('/dashboard/surveys/mobile-template', {
    name: 'Survey Templates',
  }),
  standardTemplate: makeRoute('/dashboard/surveys/mobile-template/standard', {
    name: 'Survey Templates',
  }),
  customTemplate: makeRoute('/dashboard/surveys/mobile-template/custom', {
    name: 'Survey Templates',
  }),
  templateForm: makeRoute('/dashboard/surveys/mobile-template/create', {
    name: 'New Survey Template Creation',
  }),
  updateTemplateForm: makeRoute('/dashboard/surveys/mobile-template/edit/:id', {
    build: (id: string) => `/dashboard/surveys/mobile-template/edit/${id}`,
    name: 'Survey',
  }),
  templateFormPreview: {
    match: '/dashboard/surveys/mobile-template/preview/:templateId',
    label: 'Preview Survey Template Creation',
    name: 'preview-template',
    build: (id: string) => `/dashboard/surveys/mobile-template/preview/${id}`,
    matchPath: '/dashboard/surveys/mobile-template/preview',
  },
  schedulingManagerList: makeRoute('/dashboard/surveys/schedule-manager/list', {
    name: 'SchedulingManagerList',
  }),
  scheduleManagerDetail: {
    list: makeRoute('/dashboard/surveys/schedule-manager/detail', {
      name: 'SchedulingManagerDetail',
    }),
    listCampaigns: {
      name: 'PostCompletionDetail',
      match: '/dashboard/surveys/schedule-manager/detail/:templateId/:type',
      build: (templateId: string, type: SurveyCountPerParticipantType, query?: { templateStatus: boolean }) =>
        buildUrl(`/dashboard/surveys/schedule-manager/detail/${templateId}/${type}`, query),
    },
    scheduleCampaign: {
      name: 'CreateCampaign',
      match: '/dashboard/surveys/schedule-manager/campaigns/:templateId',
      build: (templateId: string) => buildUrl(`/dashboard/surveys/schedule-manager/campaigns/${templateId}`),
    },
    editCampaign: {
      name: 'EditCampaign',
      match: '/dashboard/surveys/schedule-manager/campaigns/edit/:campaignId',
      build: (campaignId: string) => buildUrl(`/dashboard/surveys/schedule-manager/campaigns/edit/${campaignId}`),
    },

    duplicateCampaign: {
      name: 'duplicateCampaign',
      match: '/dashboard/surveys/schedule-manager/campaigns/duplicate/:duplicateId',
      build: (duplicateId: string) =>
        buildUrl(`/dashboard/surveys/schedule-manager/campaigns/duplicate/${duplicateId}`),
    },
    surveyStats: {
      name: 'SurveyStats',
      match: '/dashboard/surveys/schedule-manager/survey-stats/:templateId/:campaignId',
      build: (templateId: string, campaignId: string, query?: { campaignName: string }) =>
        buildUrl(`/dashboard/surveys/schedule-manager/survey-stats/${templateId}/${campaignId}`, query),
    },
  },
  careTeamTypesLabelEdit: makeRoute('/dashboard/settings/care-team-types', {
    name: 'CareTeamTypesLabel',
  }),
};

export const externalRoutes = {
  privacyPolicy: 'https://pretaa.com/privacy-policy/',
  termsOfService: 'https://pretaa.com/terms-of-use/',
  help: 'https://pretaa.com/contact/',
};
