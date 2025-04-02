import { gql } from '@apollo/client';

export const OnboardMultiClientMutation = gql`
  mutation OnboardMultiClient(
    $clientName: String!, 
    $configuration: JSON!, 
    $connectors: [JSON!]!, 
    $description: String
  ) {
    pretaaOnboardMultiClient(
      clientName: $clientName, 
      configuration: $configuration, 
      connectors: $connectors, 
      description: $description
    )
  }
`;