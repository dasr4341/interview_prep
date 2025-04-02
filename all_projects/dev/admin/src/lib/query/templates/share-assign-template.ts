import { gql } from '@apollo/client';

export const ShareOrAssignTemplate = gql`
  mutation ShareOrAssignEmailTemplateWithUsersOrGroups(
    $parentId: String!
    $userIdArrayShared: [String!]!
    $userIdArrayAssigned: [String!]!
    $groupIdArrayShared: [String!]!
    $groupIdArrayAssigned: [String!]!
  ) {
    pretaaShareOrAssignEmailTemplateWithUsersOrGroups(
      parentId: $parentId
      userIdArrayShared: $userIdArrayShared
      userIdArrayAssigned: $userIdArrayAssigned
      groupIdArrayShared: $groupIdArrayShared
      groupIdArrayAssigned: $groupIdArrayAssigned
    ) {
      id
      eventType
      companyType
      messageType
      sendToAddress
      title
      subject
      text
      customerId
      creatorId
      parentId
      messageTemplateUsers {
        userId
        isShared
      }
      messageTemplateGroups {
        groupId
        isShared
      }
    }
  }
`;
