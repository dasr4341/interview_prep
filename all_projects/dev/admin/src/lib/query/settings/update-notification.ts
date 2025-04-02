import { gql } from '@apollo/client';

export const UpdateUserNotification = gql`
mutation UpdateNotification(
  $createSummaries: [NotificationSummaryCreateWithoutUserInput!]
  $favoritedCompaniesFlag: Boolean
  $notificationSummaryFlag: Boolean
  $pauseAll: Boolean
  $receiveEmails: Boolean
) {
  pretaaUpdateUserNotification(
    createSummaries: $createSummaries
    favoritedCompaniesFlag: $favoritedCompaniesFlag
    notificationSummaryFlag: $notificationSummaryFlag
    pauseAll: $pauseAll
    receiveEmails: $receiveEmails
  ) {
    id
    favoritedCompaniesFlag
    notificationSummaryFlag
    pauseAll
    receiveEmails
    notificationSummary {
      schedule
      scheduleTime
    }
  }
}

`;