import { gql } from '@apollo/client';


export const submitDaysSoberMutation = gql`mutation SubmitDaysSober($daysSober: String!) {
  pretaaHealthSubmitDaysSober(daysSober: $daysSober)
}
`;