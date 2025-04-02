import { gql } from '@apollo/client';

export const getSurveyHealthReportPdf = gql`
 query GetSurveyHealthReportPdf($surveyAssignId: String!, $userId: String!) {
  pretaaHealthGetSurveyReportPdf(surveyAssignId: $surveyAssignId, patientId: $userId)
}
`;
