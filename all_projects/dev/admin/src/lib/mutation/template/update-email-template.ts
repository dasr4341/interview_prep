import { gql } from '@apollo/client';

export const updateEmailTemplate = gql`
  mutation UpdateEmailTemplate(
    $text: String!, 
    $subject: String!, 
    $title: String!, 
    $delta: JSON!, 
    $id: String!) 
  {
    pretaaUpdateEmailTemplate(
      text: $text, 
      subject: $subject, 
      title: $title, 
      delta: $delta, 
      id: $id) 
    {
      eventType
      companyType
      text
      title
      subject
      messageType
      delta
    }
  }
`;
