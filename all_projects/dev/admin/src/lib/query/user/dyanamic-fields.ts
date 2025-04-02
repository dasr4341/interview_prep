import { gql } from '@apollo/client';

export const GetDynamicFieldQuery = gql`
  query UserFields {
    pretaaDynamicUserFields {
      customerId
      display
      fieldLabel
      fieldName
      fieldType
      id
      isDefault
      order
    }
  }
`;
