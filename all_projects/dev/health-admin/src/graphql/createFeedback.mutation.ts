import { gql } from '@apollo/client';

export const healthCreateFeedback = gql`
  mutation CreateFeedback($feedback: String!, $feedbackValue: Float!) {
    pretaaHealthCreateFeedback(feedback: $feedback, feedbackValue: $feedbackValue) {
      feedback
      feedbackValue
    }
  }
`;
