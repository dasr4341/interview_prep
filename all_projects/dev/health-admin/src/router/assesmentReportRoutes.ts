import { BiometricScoreLabel } from "screens/Report/AssessmentReport/enum/AssessmentChartColorScheme";
import { buildUrl, makeRoute } from "./lib-router";

export const assessmentReportRoutes = {
  // start assessments Report
  assessmentsReport: {
    reportPage: {
      match: '/dashboard/report',
      path: makeRoute('/dashboard/report', {
        name: 'assessmentsReport',
      }),
    },
    patientsOverview: {
      match: '/dashboard/report/assessment-stats/PATIENTS_OVERVIEW/',
      path: makeRoute('/dashboard/report/assessment-stats/PATIENTS_OVERVIEW/', {
        name: 'EventReportTemplate',
      }),
    },
    assessmentReportByTemplateCode: {
      match: '/dashboard/report/assessment-stats/:templateCode',
      name: 'AssessmentReportByTemplate',
      build: ({ templateCode }: { templateCode: string }) =>
        buildUrl(`/dashboard/report/assessment-stats/${templateCode}`),
    },
    assessmentReportTimeline: {
      match: '/dashboard/report/assessment-stats/:patientId/timeline/:type',
      name: 'AssessmentReportTimeline',
      build: (patientId: string, type: BiometricScoreLabel) =>
        buildUrl(`/dashboard/report/assessment-stats/${patientId}/timeline/${type}`),
    },
  },
};
