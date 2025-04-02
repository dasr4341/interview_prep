import { EventReportPageTypes } from 'screens/FacilityAdmin/EventReport/EventReportPageLayout';
import { buildUrl } from './lib-router';

export const eventReportRoutes = {
  //  report for facility admin
  eventReport: {
    reportPage: {
      match: '/dashboard/report-admin',
      name: 'EventReports',
      build: (pageType: EventReportPageTypes) => `/dashboard/report-admin/${pageType}`,
    },
    EventReportTemplate: {
      name: 'EventReportTemplate',
      match: '/dashboard/report-admin/:pageType',
      build: (pageType: EventReportPageTypes) => buildUrl(`/dashboard/report-admin/${pageType}`),
    },
  },
  //  report for facility admin
};
