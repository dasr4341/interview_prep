import { gql } from '@apollo/client';

export const getAdhocAssessmentForCounsellor = gql`
  query GetAdHocSurveyForCounsellors(
    $surveyId: String!
  ) {
    pretaaHealthGetAdHocSurveyForCounsellors(
      surveyId: $surveyId
    ) {
      published
      publishedAt
      scheduledAt
      campaignSurveySignature
      surveyReceipientList {
        patientFulltName
        patientFirstName
        patientId
        surveyId
        patientLasttName
      }
      surveyId
    }
  }
`;
