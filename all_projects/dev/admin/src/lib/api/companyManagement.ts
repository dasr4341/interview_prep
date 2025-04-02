import {
  UpdateDynamicCompanyFields,
  UpdateDynamicCompanyFieldsVariables,
  UpdateUserStatus,
  UpdateUserStatusVariables,
  GetCompanyMngtList,
  GetCompanyMngtListVariables,
  GetDynamicCompanyFields,
  GetDynamicCompanyFields_pretaaDynamicCompanyFields,
  GetUsersCompanies,
  GetUsersCompaniesVariables,
  GetCompanyMngtList_getFilteredCompaniesAdmin,
  GetSelectedCompanyList,
} from 'generatedTypes';
import { GetDynamicCompanyFieldsQuery } from 'lib/query/company-management/dynamic-company-field';
import { GetCompanyMngtListQuery } from 'lib/query/company-management/get-companies';
import { GetUsersCompaniesQuery } from 'lib/query/company-management/get-user-company';
import { toggleUserStatus } from 'lib/query/user/toggle-user-status';
import { UpdateDynamicCompanyFieldsMutation } from 'lib/mutation/company-management/update-dynamic-field';
import sortBy from 'lodash/sortBy';
import { client } from '../../apiClient';
import { getSelectedCompanyListQuery } from 'lib/query/company-management/get-selected-companies-list';

function tranformCompanies(list: Array<any>, fields: any) {
  return list.map((u) => {
    const dynamicFields: any = {};

    if (u.dynamicFields) {
      for (const [key, value] of Object.entries(u.dynamicFields)) {
        const fieldConfig = fields.find((f: any) => f.fieldName);
        if (fieldConfig && fieldConfig.display) {
          dynamicFields[key] = value;
        }
      }
    }

    return {
      ...u,
      ...dynamicFields,
    };
  });
}
const companyManagement = {
  getCompanies: async ({
    query,
    fields,
  }: {
    query?: GetCompanyMngtListVariables;
    fields: GetDynamicCompanyFields_pretaaDynamicCompanyFields[];
  }) => {
    const { data }: { data: GetCompanyMngtList } = await client.query({
      query: GetCompanyMngtListQuery,
      variables: query ? query : {},
    });
    if (!data.getFilteredCompaniesAdmin) {
      return [];
    }
    // Company dynamic fields need to flat json struct
    // User dynamic fields need to flat json struct
    return tranformCompanies(data.getFilteredCompaniesAdmin, fields);
  },

  getCompanyList: async ({
    companyList,
    fields,
  }: {
    companyList?: GetCompanyMngtList_getFilteredCompaniesAdmin[];
    fields: GetDynamicCompanyFields_pretaaDynamicCompanyFields[];
  }) => {
    if (!companyList) {
      return [];
    }
    // Company dynamic fields need to flat json struct
    // User dynamic fields need to flat json struct
    return tranformCompanies(companyList, fields);
  },

  getSelectedCompanies: async ({ query, fields }: { query?: any; fields: any[] }) => {
    const { data }: { data: GetSelectedCompanyList } = await client.query({
      query: getSelectedCompanyListQuery,
      variables: query ? query : {},
    });

    if (!data?.pretaaGetList?.listCompanies) {
      return [];
    }
    // Company dynamic fields need to flat json struct
    // User dynamic fields need to flat json struct
    return data.pretaaGetList.listCompanies.map((u) => {
      const dynamicFields: any = {};

      if (u.company.dynamicFields) {
        for (const [key, value] of Object.entries(u.company.dynamicFields)) {
          const fieldConfig = fields.find((f) => f.fieldName);
          if (fieldConfig && fieldConfig.display) {
            dynamicFields[key] = value;
          }
        }
      }

      return {
        ...u.company,
        listCompanies: [{ listId: u.listId }],
        companyId: u.companyId,
        ...dynamicFields,
      };
    });
  },

  getUserCompanies: async ({
    query,
    fields,
  }: {
    query?: GetUsersCompaniesVariables;
    fields: GetDynamicCompanyFields_pretaaDynamicCompanyFields[];
  }) => {
    const { data }: { data: GetUsersCompanies } = await client.query({
      query: GetUsersCompaniesQuery,
      variables: query ? query : {},
    });
    if (!data.pretaaGetUsersCompanies) {
      return [];
    }
    // Company dynamic fields need to flat json struct
    // User dynamic fields need to flat json struct
    return data.pretaaGetUsersCompanies.map((u) => {
      const dynamicFields: any = {};

      if (u.dynamicFields) {
        for (const [key, value] of Object.entries(u.dynamicFields)) {
          const fieldConfig = fields.find((f) => f.fieldName);
          if (fieldConfig && fieldConfig.display) {
            dynamicFields[key] = value;
          }
        }
      }

      return {
        ...u,
        ...dynamicFields,
      };
    });
  },

  getDynamicFields: async () => {
    const { data }: { data: GetDynamicCompanyFields } = await client.query({
      query: GetDynamicCompanyFieldsQuery,
    });

    return sortBy(data.pretaaDynamicCompanyFields, ['order']);
  },

  changeFieldVisibility: async (id: number, display: boolean) => {
    const response = await client.mutate<UpdateDynamicCompanyFields, UpdateDynamicCompanyFieldsVariables>({
      mutation: UpdateDynamicCompanyFieldsMutation,
      variables: {
        columns: [id],
        display: [display],
        type: 'DISPLAY',
      },
    });
    return response.data?.pretaaUpdateDynamicCompanyFields;
  },
  changeFieldOrder: async (cols: number[]) => {
    const order = cols.map((c, i) => i);
    const response = await client.mutate<UpdateDynamicCompanyFields, UpdateDynamicCompanyFieldsVariables>({
      mutation: UpdateDynamicCompanyFieldsMutation,
      variables: {
        columns: cols,
        order: order,
        type: 'ORDER',
      },
    });
    return response.data?.pretaaUpdateDynamicCompanyFields;
  },

  updateUserActive: async (id: string) => {
    const response = await client.mutate<UpdateUserStatus, UpdateUserStatusVariables>({
      mutation: toggleUserStatus,
      variables: {
        userId: id,
      },
    });
    return response.data;
  },
};

export default companyManagement;
