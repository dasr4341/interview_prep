import { gql } from '@apollo/client';

export const GetDynamicCompanyFieldsQuery = gql`
  query GetDynamicCompanyFields {
    pretaaDynamicCompanyFields {
      id
      fieldName
      fieldLabel
      fieldType
      display
      allowedValues
      isDefault
      customerId
      order
    }
  }
`;