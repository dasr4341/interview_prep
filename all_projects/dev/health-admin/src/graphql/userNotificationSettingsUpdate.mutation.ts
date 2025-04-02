import { gql } from '@apollo/client';

export const userNotificationSettingsUpdate = gql`
mutation PretaaHealthCreateUpdateUserNotificationSettings
($email: Boolean!, $notification: Boolean, $notificationTypesSetting: [JSONObject!]!, $pauseAll: Boolean!) {
  pretaaHealthCreateUpdateUserNotificationSettings
  (email: $email, notification: $notification, notificationTypesSetting: $notificationTypesSetting, pauseAll: $pauseAll) {
    email
    notification
    notificationTypesSetting
    pauseAll
  }
}
`; 