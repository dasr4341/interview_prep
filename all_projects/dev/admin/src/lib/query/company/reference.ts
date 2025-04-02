import { gql } from '@apollo/client';

export const CreateCompanyReferenceMutation = gql`
  mutation CreateCompanyReference(
    $companyId: String!, 
    $offeredTo: OfferedToOptions, 
    $servedAsReferenceBefore: Boolean, 
    $servedAsReferenceForId: String, 
    $servedAsReferenceAt: DateTime, 
    $notes: String, 
    $dealClosed: Boolean, 
    $firstName: String, 
    $lastName: String, 
    $position: String, 
    $email: String, 
    $phone: String, 
    $offerOptions: ReferenceOnOfferOptionsCreateNestedManyWithoutReferenceInput
  ) {
    pretaaCreateCompanyReference(
      companyId: $companyId, 
      offeredTo: $offeredTo, 
      servedAsReferenceBefore: $servedAsReferenceBefore, 
      servedAsReferenceForId: $servedAsReferenceForId, 
      servedAsReferenceAt: $servedAsReferenceAt, 
      notes: $notes, 
      dealClosed: $dealClosed, 
      firstName: $firstName, 
      lastName: $lastName, 
      position: $position, 
      email: $email, 
      phone: $phone, 
      offerOptions: $offerOptions
    ) {
    id
    }
  }
`;

export const GetOneReference = gql`
  query GetReference(
    $referenceId: String!
  ) {
    pretaaGetReference(referenceId: $referenceId) {
      id
      companyId
      offeredTo
      servedAsReferenceBefore
      servedAsReferenceForId
      servedAsReferenceForName
      servedAsReferenceAt
      notes
      dealClosed
      firstName
      lastName
      position
      email
      phone
      companyType
      company {
        id
        name
        starredByUser {
          userId
        }
      }
      offerOptions {
        offerOption {
          id
          offerType
        }
        offerOptionBefore
      }
      user {
        firstName
        lastName
        id
      }
    }
  }
`;