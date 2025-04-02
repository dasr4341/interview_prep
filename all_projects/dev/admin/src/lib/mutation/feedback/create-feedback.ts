import { gql } from '@apollo/client';

export const createFeedback = gql`
 mutation CreateFeedback(
  $feedback: String!
  $feedbackValue: Float!
  $feedbackId: String
) {
  pretaaCreateFeedback(
    feedback: $feedback
    feedbackValue: $feedbackValue
    feedbackId: $feedbackId
  ) {
    feedbackId
    feedbackValue
    feedback
    userId
  }
}
`;
