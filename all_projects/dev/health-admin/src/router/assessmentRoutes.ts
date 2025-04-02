import { makeRoute } from "./lib-router";

export const assessmentRoutes = {


  addSurvey: {
    match: '/dashboard/pretaa-admin/survey-list/create',
    path: makeRoute('/dashboard/pretaa-admin/survey-list/create', {
      name: 'CreateSurvey ',
    }),
  },
  downloadAssessmentPdf: {
    name: 'Download Pdf',
    match: '/downloadPdf/:userId/:surveyId/:token',
    build: (userId: string, surveyId: string, token: string, visibility?: boolean) =>
      `/downloadPdf/${userId}/${surveyId}/${token}/?chart-visibility=${visibility}`,
  },
}