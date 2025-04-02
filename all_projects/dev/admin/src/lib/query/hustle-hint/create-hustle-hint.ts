import { gql } from '@apollo/client';

export const CreateHustleHintMutation = gql`
  mutation PretaaCreateHustleAction(
    $eventId: String!,
    $hustleHintTemplateId: String!,
    $text: String!,
    $subject: String!,
    $delta: JSON!,
    $hustleContacts: HustleContactsCreateNestedManyWithoutHustleInput!,
    $sendToAddress: String
  ) {
    pretaaCreateHustleAction(
      eventId: $eventId,
      hustleHintTemplateId: $hustleHintTemplateId,
      text: $text,
      subject: $subject,
      delta: $delta,
      hustleContacts: $hustleContacts,
      sendToAddress: $sendToAddress
    ) {
      id
    }
  }
`;
