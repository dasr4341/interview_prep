import { gql } from '@apollo/client';

export const companyToggleStarMutation = gql`
  mutation CompanyToggleStarMutation($companyToggleStarCompanyId: String!) {
    companyToggleStar(companyId: $companyToggleStarCompanyId)
  }
`;