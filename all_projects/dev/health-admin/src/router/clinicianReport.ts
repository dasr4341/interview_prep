import { ReportPageTypes } from "screens/Report/ReportPageLayout";

export const clinicianReport = {
  report: {
    reportPage: {
      match: '/dashboard/report',
      name: 'Reports',
      build: (pageType: ReportPageTypes) => `/dashboard/report/${pageType}`,
      getSubRoutes: ({ type, patientId }: { type: ReportPageTypes; patientId?: string }) => {
        if (type && patientId) {
          return `/dashboard/report/${type}/${patientId}`;
        } else {
          return `/dashboard/report/${type}/`;
        }
      },
    },

    anomaliesReported: {
      match: `/dashboard/report/${ReportPageTypes.ANOMALIES_REPORTED}/`,
      name: 'Anomalies Report ',
      build: (patientId: string) => `/dashboard/report/${ReportPageTypes.ANOMALIES_REPORTED}/${patientId}`,
    },
    poorSurveyScores: {
      match: `/dashboard/report/${ReportPageTypes.POOR_SURVEY_SCORES}/`,
      name: 'poorSurveyScores',
      build: (patientId: string) => `/dashboard/report/${ReportPageTypes.POOR_SURVEY_SCORES}/${patientId}`,
    },
    selfHarmReport: {
      match: `/dashboard/report/${ReportPageTypes.SELF_HARM_REPORTS}/`,
      name: 'selfHarmReport',
      build: (patientId: string) => `/dashboard/report/${ReportPageTypes.SELF_HARM_REPORTS}/${patientId}`,
    },
    helpLineContacted: {
      match: `/dashboard/report/${ReportPageTypes.HELP_LINE_CONTACTED}/`,
      name: 'helpLineContacted',
      build: (patientId: string) => `/dashboard/report/${ReportPageTypes.HELP_LINE_CONTACTED}/${patientId}`,
    },
    geoFencesBreached: {
      match: `/dashboard/report/${ReportPageTypes.GEO_FENCES_BREACHED}/`,
      name: 'geoFencesBreached',
      build: (patientId: string) => `/dashboard/report/${ReportPageTypes.GEO_FENCES_BREACHED}/${patientId}`,
    },
  },
};

