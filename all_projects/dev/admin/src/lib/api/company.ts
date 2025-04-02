import { client } from 'apiClient';
import {
  CompanyWhereUniqueInput,
  GetCompanies,
  GetCompanyForEvent,
  PretaaCompanyFilterInput,
  CompanyToggleStarMutation,
  PretaaAddCompanyRatingsMutation,
  GetCompaniesVariables,
  OrderType,
} from 'generatedTypes';
import { getCompanyForEvent } from 'lib/query/company/company';
import { QueryVariables } from 'interface/url-query.interface';
import { GetCompaniesQuery } from 'lib/query/company/get-companies';
import { companyToggleStarMutation } from 'lib/mutation/companies/company-star-toggle';
import { addCompanyRatingsMutation } from 'lib/mutation/companies/company-add-rating';

export default function company() {
  return {
    getCompany: async (query: CompanyWhereUniqueInput): Promise<GetCompanyForEvent> => {
      const { data }: { data: GetCompanyForEvent } = await client.query({
        query: getCompanyForEvent,
        variables: {
          companyId: query.id,
        },
      });

      return data;
    },
    getCompanies: async (query: QueryVariables) => {
      const { data }: { data: GetCompanies } = await client.query<GetCompanies, GetCompaniesVariables>({
        query: GetCompaniesQuery,
        variables: {
          getFilteredCompaniesFilterList: [],
          getFilteredCompaniesSearchPhrase: query.phrase,
          getFilteredCompaniesSkip: query.skip,
          getFilteredCompaniesOrder: query.order,
          getFilteredCompaniesOrderBy: OrderType.ASC,
          filterObj: query.selectedOptions as PretaaCompanyFilterInput,
        },
      });
      return data.pretaaGetFilteredCompanies;
    },
    toggleStar: async (id: string): Promise<CompanyToggleStarMutation> => {
      const { data } = await client.mutate({
        mutation: companyToggleStarMutation,
        variables: {
          companyToggleStarCompanyId: id,
        },
      });
      return data;
    },
    addCompanyRating: async (ratingId: number, companyId: string, comment?: string): Promise<PretaaAddCompanyRatingsMutation> => {
      const { data } = await client.mutate({
        mutation: addCompanyRatingsMutation,
        variables: {
          pretaaAddCompanyRatingsRatingId: ratingId,
          pretaaAddCompanyRatingsCompanyId: companyId,
          pretaaAddCompanyRatingsComment: comment,
        },
      });
      return data;
    },
  };
}
