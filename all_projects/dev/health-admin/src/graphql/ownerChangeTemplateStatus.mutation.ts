import { gql } from '@apollo/client';

export const ownerChangeTemplateStatusMutation = gql`
  mutation OwnerChangeTemplateStatus($templateId: String!) {
    pretaaHealthAdminChangeTemplateStatus(templateId: $templateId)
  }
`;
