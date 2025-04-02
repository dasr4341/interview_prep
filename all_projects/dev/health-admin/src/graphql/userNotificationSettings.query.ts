import { gql } from '@apollo/client';

export const userNotificationSettings = gql`
  query PretaaHealthGetUserNotificationSettings {
    pretaaHealthGetUserNotificationSettings {
      email
      notification
      notificationTypesSetting
      pauseAll
    }
  }
`;