import { gql } from '@apollo/client';

export const getSurveyListForCounsellor = gql`
  query SurveyListForCounsellors(
    $surveyTemplateId: String!
    $take: Int
    $skip: Int
    $searchPhrase: String
  ) {
    pretaaHealthSurveyListForCounsellors(
      surveyTemplateId: $surveyTemplateId
      take: $take
      skip: $skip
      searchPhrase: $searchPhrase
    ) {
      surveytemplatetitle
      surveytemplatename
      surveytemplateid
      surveyid
      createdat
      issuedat
      patients
      createdbylastname
      createdbyid
      createdbyfullname
      createdbyfirstname
      completepercentage
      openpercentage
      editable
      published
      facilityName
    }
  }
`;
