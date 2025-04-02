import {
  GetCurrentAdminUser,
  GetUser,
  LoginUser,
  LoginUserVariables,
  PretaaGetData,
  SelectedGroupUsersVariables,
  SortOrder,
  VerifyTwoFactorAuthentication,
  VerifyTwoFactorAuthenticationVariables,
} from './../../generatedTypes';
import {
  OrderType,
  PretaaGetUserList,
  PretaaGetUserListVariables,
  PretaaGetUserList_pretaaGetUserList,
  SelectedGroupUserDetails,
  SelectedGroupUserDetailsVariables,
  SelectedGroupUserDetails_pretaaGetGroup_users_user,
  SelectedGroupUsers,
  UpdateUserField,
  UpdateUserFieldVariables,
  UpdateUserStatus,
  UpdateUserStatusVariables,
  UserFields,
  UserFields_pretaaDynamicUserFields,
  ViewAllRoles,
} from 'generatedTypes';
import { ViewAllRolesQuery } from 'lib/query/role-management/get-all-roles';
import { GetDynamicFieldQuery } from 'lib/query/user/dyanamic-fields';
import { getUserList } from 'lib/query/user/get-users';
import { toggleUserStatus } from 'lib/query/user/toggle-user-status';
import { updateUserField } from 'lib/query/user/update-field';
import { getSelectedGroupUserDetails, getSelectedUsersForGroup } from 'lib/query/usergroupdetails/selected-user-list';
import _ from 'lodash';
import { client } from '../../apiClient';
import { getUserQuery } from 'lib/query/user';
import { getDataQuery } from 'lib/query/get-data.query';
import { verifyTwoFactorAuthenticationMutation } from 'lib/mutation/auth/two-step-auth';
import { getCurrentAdminQuery } from 'lib/query/user/get-current-admin';
import { gql } from '@apollo/client';
import { config } from 'config';

const userApi = {
  getUsers: async ({ fields, query }: { fields: UserFields_pretaaDynamicUserFields[]; query?: PretaaGetUserListVariables }) => {
    const orderByVariable = {
      orderBy: [
        {
          firstName: OrderType.ASC,
        },
        {
          createdAt: OrderType.ASC,
        },
      ],
    };

    const { data }: { data: PretaaGetUserList } = await client.query({
      query: getUserList,
      variables: query ? { ...query, ...orderByVariable } : {},
    });

    if (!data.pretaaGetUserList) {
      return [];
    }
    // User dynamic fields need to flat json struct
    return data.pretaaGetUserList.map((u) => {
      const dynamicFields: any = {};

      if (u.dynamicFields) {
        for (const [key, value] of Object.entries(u.dynamicFields)) {
          const fieldConfig = fields.find((f) => f.fieldName);
          if (fieldConfig && fieldConfig.display) {
            dynamicFields[key] = value;
          }
        }
      }

      // !Info: Hard coded data relation ship
      if (Array.isArray(u?.userManager) && u.userManager.length) {
        dynamicFields.manager = u.userManager[0].manager.name;
      }
      dynamicFields.csmStatus = `${u.csmStatus}`;
      dynamicFields.crmStatus = `${u.crmStatus}`;

      return {
        ...u,
        ...dynamicFields,
      };
    });
  },

  getSelectedUsersForGroup: async (variables: SelectedGroupUsersVariables) => {
    const v: SelectedGroupUsersVariables = {
      ...variables,
      usersOrderBy: [
        {
          user: {
            firstName: SortOrder.asc,
          },
        },
      ],
    };

    const { data }: { data: SelectedGroupUsers } = await client.query({
      query: getSelectedUsersForGroup,
      variables: v,
    });

    return data.pretaaGetGroup.users.map((r) => r.userId);
  },

  getSelectedUsers: async ({ fields, variables }: { fields: UserFields_pretaaDynamicUserFields[]; variables: SelectedGroupUserDetailsVariables }) => {
    const { data }: { data: SelectedGroupUserDetails } = await client.query<SelectedGroupUserDetails, SelectedGroupUserDetailsVariables>({
      query: getSelectedGroupUserDetails,
      variables,
    });

    if (!data.pretaaGetGroup.users) {
      return [];
    }
    // User dynamic fields need to flat json struct
    return data.pretaaGetGroup.users.map((u) => {
      const dynamicFields: any = {};

      if (u.user.dynamicFields) {
        for (const [key, value] of Object.entries(u.user.dynamicFields)) {
          const fieldConfig = fields.find((f) => f.fieldName);
          if (fieldConfig && fieldConfig.display) {
            dynamicFields[key] = value;
          }
        }
      }

      // !Info: Hard coded data relation ship
      if (Array.isArray(u?.user.userManager) && u.user.userManager.length) {
        dynamicFields.manager = u.user.userManager[0].manager.name;
      }
      dynamicFields.csmStatus = `${u.user.csmStatus}`;
      dynamicFields.crmStatus = `${u.user.crmStatus}`;

      return {
        ...u.user,
        userId: u.userId,
        ...dynamicFields,
      };
    });

  },

  getUserList: async ({
    fields,
    userList,
  }: {
    fields: UserFields_pretaaDynamicUserFields[];
    userList?: PretaaGetUserList_pretaaGetUserList[] | SelectedGroupUserDetails_pretaaGetGroup_users_user[];
  }) => {
    if (!userList) {
      return [];
    }
    // User dynamic fields need to flat json struct
    return userList?.map((u) => {
      const dynamicFields: any = {};

      if (u.dynamicFields) {
        for (const [key, value] of Object.entries(u.dynamicFields)) {
          const fieldConfig = fields.find((f) => f.fieldName);
          if (fieldConfig && fieldConfig.display) {
            dynamicFields[key] = value;
          }
        }
      }

      // !Info: Hard coded data relation ship
      if (Array.isArray(u?.userManager) && u.userManager.length) {
        dynamicFields.manager = u.userManager[0].manager.name;
      }
      dynamicFields.csmStatus = `${u.csmStatus}`;
      dynamicFields.crmStatus = `${u.crmStatus}`;

      return {
        ...u,
        ...dynamicFields,
      };
    });
  },

  getAllRoles: async () => {
    const { data } = await client.query<ViewAllRoles>({
      query: ViewAllRolesQuery,
    });

    return data?.pretaaViewAllRoles;
  },

  getDynamicFields: async () => {
    const { data }: { data: UserFields } = await client.query({
      query: GetDynamicFieldQuery,
    });
    const list = _.sortBy(data.pretaaDynamicUserFields, ['order']);

    return list;
  },

  changeFieldVisibility: async (id: number, display: boolean) => {
    const response = await client.mutate<UpdateUserField, UpdateUserFieldVariables>({
      mutation: updateUserField,
      variables: {
        columns: [id],
        display: [display],
        type: 'DISPLAY',
      },
    });
    return response.data?.pretaaUpdateDynamicUserFields;
  },
  changeFieldOrder: async (cols: number[]) => {
    const order = cols.map((c, i) => i);
    const response = await client.mutate<UpdateUserField, UpdateUserFieldVariables>({
      mutation: updateUserField,
      variables: {
        columns: cols,
        order: order,
        type: 'ORDER',
      },
    });
    return response.data?.pretaaUpdateDynamicUserFields;
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

  sendLoginRequest: async (payload: LoginUserVariables) => {
    const { data, errors } = await client.query<LoginUser, LoginUserVariables>({
      variables: payload,
      query: gql`
        query LoginUser($email: String!, $password: String!) {
          pretaaLogin(email: $email, password: $password)
        }
      `,
    });

    return { data, errors };
  },

  getCurrentUser: async () => {
    const { data }: { data: GetUser } = await client.query({
      query: getUserQuery,
    });
    return data;
  },

  // Required few data to use multiple pages
  getAppData: async () => {
    const { data } = await client.query<PretaaGetData>({
      query: getDataQuery,
    });
    return data;
  },
  verifyOtpRequest: async (payload: VerifyTwoFactorAuthenticationVariables) => {
    const { data, errors } = await client.mutate<VerifyTwoFactorAuthentication, VerifyTwoFactorAuthenticationVariables>({
      mutation: verifyTwoFactorAuthenticationMutation,
      variables: payload,
    });
    return { data, errors };
  },
  getSuperAdmin: async () => {
    const { data } = await client.query<GetCurrentAdminUser>({
      query: getCurrentAdminQuery,
    });
    return { data };
  },
};

export default userApi;

export function resetState() {
  localStorage.removeItem(config.storage.token);
  localStorage.removeItem(config.storage.refreshToken);
  localStorage.removeItem(config.storage.loginTime);
  localStorage.removeItem(config.storage.admin_store);
  localStorage.removeItem(config.storage.user_store);
}

export function setAuthToken({ token, refreshToken } : { token: string; refreshToken: string }) {
  localStorage.setItem(config.storage.token, token);
  localStorage.setItem(config.storage.refreshToken, refreshToken);
}
