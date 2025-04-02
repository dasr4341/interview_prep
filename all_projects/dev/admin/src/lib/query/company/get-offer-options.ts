import { gql } from '@apollo/client';

export const GetOfferOptionsQuery = gql`
  query GetOfferOptions {
    pretaaGetCompanyOfferOptions {
      id
      offerType
      status
    }
}`;