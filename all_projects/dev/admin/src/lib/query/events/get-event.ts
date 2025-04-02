/* eslint-disable max-len */
import { gql } from '@apollo/client';

export const GetEventQuery = gql`
 mutation GetEvent(
    $id: String!
    $whereUserEvent: UserEventsWhereInput
    $whereHustleHintTemplates: HustleHintTemplatesWhereInput
  ) {
    getEventDetails(id: $id) {
      id
      text
      type
      createdAt
      customerId
      needsAttention
      ratingId
      
      userEvents(where: $whereUserEvent) {
        readAt
        flaggedAt
        hideAt
      }
      referenceId
      timelineCount
      launchCount
      noteCount
      reference {
        deletedBy {
          name
        }
        deletedOn
      }

      company {
        id
      }

      useCase {
        useCasePretaa {
          name
          hustleHintTemplates(where: $whereHustleHintTemplates) {
            id
            templateName
            emailSubject
            hustleHintLanguage
          }
        }
      }
      data
      launchId
      hustleId
      defaultTemplateId
    }
  }
`;
