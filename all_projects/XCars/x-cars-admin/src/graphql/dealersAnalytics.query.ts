import { graphql } from '@/generated/gql';

export const DEALERS_ANALYTICS = graphql(`
  query GetDealerAnalytics($input: DealerAnalyticsDto) {
    getDealerAnalytics(input: $input) {
      message
      success
      data {
        cars {
          totalCarsPosted
          totalCarsApproved
          totalCarsPending
        }
        leads {
          assignedLeads {
            year
            data {
              month
              data {
                id
                leadId
                seen
                note
              }
            }
          }
          totalUnAssignedLeadsCount
          totalAssignedLeadsCount
          totalLeadsInRange {
            id
            createdAt
            updatedAt
          }
        }
        quotations {
          activeQuotations
          pendingQuotations
          totalActiveQuotationsInRange {
            id
            createdAt
            updatedAt
          }
          totalPendingQuotationsInRange {
            id
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`);
