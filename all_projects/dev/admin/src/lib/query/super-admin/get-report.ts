import { gql } from '@apollo/client';

export const getReportQuery = gql`
  query GetReport($customerId: Int!) {
    # For internal purpose
    pretaaAdminGetCustomer(customerId: $customerId) {
      name
    }
    # Client Summary table
    pretaaAdminGetClientSummary(customerId: $customerId) {
      data {
        department
        num_of_employees
        num_of_logins
        total_feedbacks
        avg_stars
      }
      summary {
        totalEmployees
        totalLogins
        totalFeedbacks
        totalAverageStars
      }
    }

    # Companies Table
    pretaaAdminGetCompaniesBySource(customerId: $customerId) {
      avgCompanyViews
      avgCustomerViews
      avgProspectViews
      total
      totalCsm
      totalInCrm
      totalInMarketing
    }

    # Company Filters - General
    pretaaAdminGetCompanyFilters(customerId: $customerId) {
      filterCounts {
        starred
        arr
        customer
        employee_seats
        has_offered
        industry
        has_served
        nps_score
        product
        prospect
        reference_manual
        surveyed
        total_searched
      }
      percentages {
        prospect
        customer
        arr
        employee_seats
        has_offered
        has_served
        industry
        nps_score
        product
        reference_manual
        starred
        surveyed
      }
    }

    pretaaAdminGetCompanyFilterIndustry(customerId: $customerId) {
      industry
      searchedCount
    }

    pretaaAdminGetCompanyFilterProduct(customerId: $customerId) {
      product
      searchedCount
    }

    pretaaAdminGetEventsReport(customerId: $customerId) {
      total_generated
      avg_generated
      total_details_views
      avg_details_views
    }

    pretaaAdminGetTopEventSearchTerms(customerId: $customerId) {
      search_text
      search_count
    }

    pretaaAdminGetEventFilters(customerId: $customerId) {
      filterCounts {
        starred
        my_companies
        potential_reference
        company_rating
        support
        product
        renewal
        in_the_news
        contact_change
        onboarding
        performance
        pipeline
        revenue_change
        launch
        needs_attention
        hidden
        total_searched
      }
      percentages {
        starred
        my_companies
        potential_reference
        company_rating
        support
        product
        renewal
        in_the_news
        contact_change
        onboarding
        performance
        pipeline
        revenue_change
        launch
        needs_attention
        hidden
      }
    }

    # References Given by Company
    pretaaAdminReferencesGivenByCompanies(customerId: $customerId) {
      commaDelimitedTypes
      counts

      reference {
        arr
        companyId
        employees
        name
        offer_types
        sectors
        total
      }
    }

    # References Given by Users
    pretaaAdminReferencesGivenByUsers(customerId: $customerId) {
      references {
        id
        email
        company {
          id
          name
          annualRecurringRevenueVal {
            hasAccess
            data
          }
          companyIndustries {
            industry {
              sector
              id
            }
          }
          employeeCount
          customerId
        }
        user {
          email
          id
        }
        isDeleted
        createdAt
        offerOptions {
          offerOption {
            id
            offerType
          }
        }
        firstName
        lastName
      }
      counts
      commaDelimitedTypes
    }

    pretaaAdminGetCompanyRatingsByARR(customerId: $customerId) {
      name
      neutral
      unhappy
      total
      happy
      arr
      sectors
      employees
    }

    pretaaAdminGetCompanyRatingsByTotal(customerId: $customerId) {
      name
      neutral
      unhappy
      total
      happy
      arr
      sectors
      employees
    }

    pretaaAdminGetLaunches(customerId: $customerId) {
      title
      totalCount
      averageCount
    }

    pretaaAdminGetHustleHints(customerId: $customerId) {
      title
      totalCount
      averageCount
    }

    pretaaAdminWillingReferencesByCompany(customerId: $customerId) {
      companies {
        annualRecurringRevenue
        name
        employeeCount
        sectorList
        offerTypesList
      }
      counts {
        count
        allOfferTypesList
      }
    }
    pretaaAdminGetTopLaunches(customerId: $customerId)
    pretaaAdminGetTopHustleHints(customerId: $customerId)
  }
`;
