import { graphql } from '@/generated/gql';

export const RAISE_QUOTATION = graphql(`
  mutation RaiseQuotationQuery(
    $carId: String!
    $noOfLeads: Float!
    $validityDays: Float!
    $amount: Float!
  ) {
    raiseQuotation(
      carId: $carId
      noOfLeads: $noOfLeads
      validityDays: $validityDays
      amount: $amount
    ) {
      message
      success
    }
  }
`);
