import { gql } from '@apollo/client';

export const previewHustleHintLaunchAction = gql`
  query PreviewHustleHintLaunchAction(
    $text: String!, $eventId: String!
  ) {
    pretaaPreviewHustleAction(
      text: $text, eventId: $eventId
    )
  }
`;
