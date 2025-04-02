import { gql } from '@apollo/client';

export const GetNotification = gql`
  query NotificationSettings {
    pretaaGetUserNotification {
      notificationSummaryFlag
      favoritedCompaniesFlag
      pauseAll
      receiveEmails
      notificationSummary {
        schedule
        scheduleTime
      }
    }
  }
`;
