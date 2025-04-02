import { gql } from '@apollo/client';

export const previewLaunchAction = gql`
  query PreviewLaunchAction($text: String!, $eventId: String, $companyId: String) {
    pretaaPreviewLaunchAction(text: $text, eventId: $eventId, companyId: $companyId)
  }
`;
