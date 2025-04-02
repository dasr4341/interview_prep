import { createSlice } from '@reduxjs/toolkit';
import {
  GroupUserCreateManyGroupInput,
  GroupUserCreateManyGroupInputEnvelope,
  PretaaGetUserList_pretaaGetUserList,
} from 'generatedTypes';
import _ from 'lodash';

interface UserManagementState {
  group: {
    selectedUsers: Array<string>;
    existingUsers: Array<string>;
    deletedUsers: Array<string>;
    selectedCompanyGroup: Array<string>;
    selectedUserGroup: Array<string>;
    selectedDataObjectId: string | null;
    selectedUseCaseId: string | null;
    groupName: string | null;
    selectedGroupUserList: PretaaGetUserList_pretaaGetUserList[];
  }
  
}

const initialState: UserManagementState = {
  group: {
    selectedUsers: [],
    existingUsers: [],
    deletedUsers: [],
    selectedCompanyGroup: [],
    selectedUserGroup: [],
    selectedDataObjectId: null,
    selectedUseCaseId: null,
    groupName: null,
    selectedGroupUserList: [],
  }
  
};

export const userManagement = createSlice({
  name: 'userManagement',
  initialState: _.cloneDeep(initialState),
  reducers: {
    updateName: (state, { payload }: { payload: string | null }) => {
      state.group.groupName = payload;
    },
    // Manage new users to be added to a group
    addSelectedUsers: (state, { payload }: { payload: PretaaGetUserList_pretaaGetUserList[] }) => {
      const savedItems = _.cloneDeep(state.group.existingUsers);
      const newItems = payload.filter((u) => !savedItems.includes(u.id)).map((u) => u.id);
      state.group.selectedUsers = newItems;
    },
    updateSelectedUsersForGroup: (state, { payload } : { payload: Array<string> }) => {
      state.group.selectedUsers = payload;
    },
    updateExistingUsers: (state, { payload }: { payload: Array<string> }) => {
      state.group.existingUsers = payload;
    },
   updateDeletedUsers: (state, { payload }: { payload: Array<string> }) => {
     state.group.deletedUsers = payload;
   },
    
    updateCompanyGroup: (state, { payload }: { payload: { selected: boolean; id: string } }) => {
      const savedItems = _.cloneDeep(state.group.selectedCompanyGroup);
      if (payload.selected && !savedItems.includes(payload.id)) {
        state.group.selectedCompanyGroup = savedItems.concat(payload.id);
      } else if (!payload.selected && savedItems.includes(payload.id)) {
        state.group.selectedCompanyGroup = savedItems.filter((i) => i !== payload.id);
      } else {
        return;
      }
    },
    addCompanyGroup: (state, { payload }: { payload: Array<string> }) => {
      state.group.selectedCompanyGroup = payload;
    },
    updateUserGroup: (state, { payload }: { payload: { selected: boolean; id: string } }) => {
      const savedItems = _.cloneDeep(state.group.selectedUserGroup);
      if (payload.selected && !savedItems.includes(payload.id)) {
        state.group.selectedUserGroup = savedItems.concat(payload.id);
      } else if (!payload.selected && savedItems.includes(payload.id)) {
        state.group.selectedUserGroup = savedItems.filter((i) => i !== payload.id);
      } else {
        return;
      }
    },
    addUserGroup: (state, { payload }: { payload: Array<string> }) => {
      console.log('payload : ', payload);
      state.group.selectedUserGroup = payload;
    },
    addDataObjectId: (state, { payload }: { payload: string }) => {
      state.group.selectedDataObjectId = payload;
    },
    addUseCaseId: (state, { payload }: { payload: string }) => {
      state.group.selectedUseCaseId = payload;
    },
    resetState: (state) => {
      state.group = _.cloneDeep(initialState.group);
      console.info('--- Reset User Management Store ---- ', { state });
    },
    resetUserGroup: (state) => {
      state.group.selectedUserGroup = [];
    }
  },
});

// Action creators are generated for each case reducer function
export const userManagementActions = userManagement.actions;
export default userManagement.reducer;

export function getUsersIds(users: Array<string>): GroupUserCreateManyGroupInputEnvelope {
  const ids: GroupUserCreateManyGroupInput[] = users.map((user) => {
    return {
      userId: user,
    };
  });
  return {
    data: ids,
    skipDuplicates: true
  };
}
