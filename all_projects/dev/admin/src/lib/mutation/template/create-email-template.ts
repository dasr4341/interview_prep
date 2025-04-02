import { gql } from '@apollo/client';

export const createEmailTemplate = gql`
mutation CreateEmailTemplate(
  $text: String!, 
  $subject: String!, 
  $title: String!, 
  $delta: JSON!) {
  pretaaCreateEmailTemplate(
    text: $text,
    subject: $subject, 
    title: $title, 
    delta: $delta) {
    id
    title
    subject
    text
    delta
  }
}
`;
