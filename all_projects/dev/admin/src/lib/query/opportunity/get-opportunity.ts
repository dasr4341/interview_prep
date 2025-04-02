import { gql } from '@apollo/client';

export const PretaaGetOpportunity = gql`
   query PretaaGetCompanyOpportunity(
    $opportunityId: String!
    $industriesWhere: CompanyOnIndustriesWhereInput
    $contactsWhere: OpportunityContactWhereInput
  ) {
    pretaaGetCompanyOpprtunity(opportunityId: $opportunityId) {
      id
      name
      status
      lastUpdatedOn
      expectedClose
      potentialArrVal {
        data
        hasAccess
      }
      isClosed
      isWon
      closeDate

      company {
        id
        name

        companyIndustries(where: $industriesWhere) {
          industry {
            sector
          }
        }
      }


      primarySalesContact {
        id
        name
        email
      }

      primaryCSMContact {
        id
        email
        name
      }
     
      launchCount
      noteCount

      pipelineStage {
        stageNumber
      }

      products {
        id
        orderStartDate
        orderEndDate
        product {
          name
        }
        quantity
        monthlyUnitPrice
        orderTerms
      }

      opportunityContact(where: $contactsWhere) {
        contact {
          firstName
          lastName
        }
      }
    }
  }
`;
