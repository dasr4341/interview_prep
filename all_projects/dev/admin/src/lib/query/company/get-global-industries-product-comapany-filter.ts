import { gql } from '@apollo/client';

export const GetGlobalIndustriesAndProductAndCompanyFilterQuery = gql`
  query PretaaGetGlobalIndustriesAndProductAndCompanyFilter{
    pretaaGetGlobalIndustries {
      id
      sector
    }
    pretaaCompanyProducts {
      id
      name
      customerProductId
    }
    pretaaGetCompanyFilterParams
  }
`;
