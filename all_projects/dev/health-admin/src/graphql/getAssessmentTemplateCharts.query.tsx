import { gql } from '@apollo/client';

export const getAssessmentTemplateChartsQuery = gql`
query GetAssessmentTemplateCharts(
  $all: Boolean!
  $code: String!
  $filterMonthNDate: ReportingDateFilter
  $rangeStartDate: String
  $rangeEndDate: String
  $patients: [AssessmentReportingPatientsIds!]
  $admittanceStatus: AssessmentPatientsDischargeFilterTypes
) {
  pretaaHealthGetAssessmentTemplateCharts(
    all: $all
    code: $code
    filterMonthNDate: $filterMonthNDate
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    patients: $patients
    admittanceStatus: $admittanceStatus
  ) {
    code
    chart {
      chartTopLeftScale {
        min
        max
      }
      chartTopRightScale {
        min
        max
      }
      chartBotomRightScale {
        min
        max
      }
      chartBotomLeftScale {
        min
        max
      }
    }
    legends {
      key
      value
    }
    data {
      label
      assignment
    }
    resultText
  }
}
`;
