import { gql } from '@apollo/client';

export const GetContactsQuery = gql`
  query GetContacts($orderBy: OrderType, $companyId: String, $skip: Int, $take: Int) {
    pretaaFindManyContacts(orderBy: $orderBy, companyId: $companyId, order: "name", skip: $skip, take: $take) {
      primary
      companyId
      image
      mobilePhone
      workPhone
      firstName
      lastName
      email
      id
    }
  }
`;

export const GetUniqueContactQuery = gql`
  query GetUniqueContact($contactId: String!) {
    pretaaFindUniqueContact(contactId: $contactId) {
      primary
      firstName
      lastName
      email
      companyId
      company {
        name
      }
      mobilePhone
      workPhone
      image
    }
  }
`;
