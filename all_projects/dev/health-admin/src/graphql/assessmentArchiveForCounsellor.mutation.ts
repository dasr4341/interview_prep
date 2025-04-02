import { gql } from '@apollo/client';

export const assessmentArchiveForCounsellor = gql`
  mutation AssessmentArchieveForCounsellors($surveyId: String!) {
    pretaaHealthSurveyArchiveForCounsellors(surveyId: $surveyId)
  }
`;

