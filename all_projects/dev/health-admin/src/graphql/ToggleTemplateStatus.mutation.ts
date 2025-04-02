import { gql } from '@apollo/client';

// API: Not used in UI
export const toggleTemplateStatus = gql`
mutation ToggleTemplateStatus($templateId: String!) {
  pretaaHealthToggleTemplateStatus(templateId: $templateId)
}
`;