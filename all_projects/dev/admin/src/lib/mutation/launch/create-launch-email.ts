import { gql } from '@apollo/client';

export const CreateLaunchActionMutation = gql`
  mutation CreateLaunchAction(
    $eventId: String, 
    $messageTemplateId: String!, 
    $text: String!, 
    $subject: String!, 
    $companyId: String!
    $launchContacts: LaunchContactsCreateNestedManyWithoutLaunchInput!, 
    $delta: JSON!
    $sendToAddress: String,
    $opportunityId: String
  ) {
    pretaaCreateLaunchAction(
      eventId: $eventId, 
      messageTemplateId: $messageTemplateId, 
      text: $text, 
      subject: $subject, 
      launchContacts: $launchContacts, 
      delta: $delta,
      companyId: $companyId
      sendToAddress: $sendToAddress,
      opportunityId: $opportunityId
    ) {
    id
    launchContacts {
      launchId
      contactId
    }
    subject
    text
      messageTemplateId
      eventId
    }
  }
`;
