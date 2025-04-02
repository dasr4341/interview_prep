import { UsersAndGroups } from './TemplateList';
import { errorList } from '../../../../lib/message.json';

const doesExist = (selectedUserOrGroup: UsersAndGroups[], userOrGroup: UsersAndGroups): boolean => {
  const index = selectedUserOrGroup.findIndex((crrUserOrGroup) => {
    return crrUserOrGroup.id === userOrGroup.id;
  });
  return index >= 0 ? true : false;
};

type TScope = 'share' | 'assign';

interface IState {
  scope: TScope | null;
  templateId: string | null;
  selectedUsers: UsersAndGroups[];
  selectedGroups: UsersAndGroups[];
  usersToRemove: UsersAndGroups[];
  groupsToRemove: UsersAndGroups[];
}

export const initialState: IState = {
  scope: null,
  templateId: null,
  selectedGroups: [],
  selectedUsers: [],
  groupsToRemove: [],
  usersToRemove: [],
};

type ACTION =
  | {
      type: 'CHANGE_SCOPE';
      payload: {
        scope: TScope;
        selectedUsers?: UsersAndGroups[];
        selectedGroups?: UsersAndGroups[];
        templateId: string;
      };
    }
  | { type: 'ADD_USER'; payload: UsersAndGroups }
  | { type: 'ADD_GROUP'; payload: UsersAndGroups }
  | { type: 'REMOVE_USER'; payload: UsersAndGroups }
  | { type: 'REMOVE_GROUP'; payload: UsersAndGroups }
  | { type: 'RESET' };

export function reducer(state: IState, action: ACTION): IState {
  switch (action.type) {
    case 'CHANGE_SCOPE':
      let initialSelectedUsers: UsersAndGroups[] = [];
      let initialSelectedGroups: UsersAndGroups[] = [];
      if (action.payload.selectedGroups) {
        initialSelectedGroups = [...action.payload.selectedGroups];
      }
      if (action.payload.selectedUsers) {
        initialSelectedUsers = [...action.payload.selectedUsers];
      }

      return {
        ...state,
        scope: action.payload.scope,
        selectedUsers: initialSelectedUsers,
        selectedGroups: initialSelectedGroups,
        templateId: action.payload.templateId,
      };

    case 'ADD_USER':
      // If user exists in selectedUsers, nothing needs to change.
      const userExist = doesExist(state.selectedUsers, action.payload);
      if (userExist) return state;

      // If user exists in usersToRemove, remove user from usersToRemove list.
      const toBeRemovedUsers = doesExist(state.usersToRemove, action.payload);
      let usersToRemove = state.usersToRemove;
      let userToAdd = action.payload;
      if (toBeRemovedUsers) {
        // Add the user back to selectedUsers from usersToRemove (so that we can persist isShared status).
        const foundUser = state.usersToRemove.find((user) => user.id === action.payload.id);
        if (foundUser) {
          userToAdd = foundUser;
        }
        usersToRemove = state.usersToRemove.filter((user) => user.id !== action.payload.id);
      }

      return {
        ...state,
        selectedUsers: [...state.selectedUsers, userToAdd],
        usersToRemove,
      };

    case 'REMOVE_USER':
      // Check if user is shared, if shared remove from selectedUsers and add to usersToRemove.
      let newRemovedUsers = state.usersToRemove;

      const selectedUsers = state.selectedUsers.filter((user) => user.id !== action.payload.id);

      if (state.scope === 'share') {
        if (action.payload.isShared) {
          newRemovedUsers = [...state.usersToRemove, action.payload];
        }
      } else if (state.scope === 'assign') {
        if (action.payload.isAssigned) {
          newRemovedUsers = [...state.usersToRemove, action.payload];
        }
      }

      return {
        ...state,
        selectedUsers,
        usersToRemove: newRemovedUsers,
      };

    case 'ADD_GROUP':
      const groupExist = doesExist(state.selectedGroups, action.payload);
      if (groupExist) return state;

      // If group exists in groupsToRemove, remove group from groupsToRemove list.
      const toBeRemovedGroups = doesExist(state.groupsToRemove, action.payload);
      let groupsToRemove = state.groupsToRemove;
      let groupToAdd = action.payload;
      if (toBeRemovedGroups) {
        // Add the group back to selectedGroups from groupsToRemove (so that we can persist isShared status).
        const foundGroup = state.groupsToRemove.find((group) => group.id === action.payload.id);
        if (foundGroup) {
          groupToAdd = foundGroup;
        }
        // Remove group from the groupsToRemove.
        groupsToRemove = state.groupsToRemove.filter((group) => group.id !== action.payload.id);
      }

      return {
        ...state,
        selectedGroups: [...state.selectedGroups, groupToAdd],
        groupsToRemove,
      };

    case 'REMOVE_GROUP':
      // Check if group is shared, if shared remove from selectedGroups and add to groupsToRemove.
      let newRemovedGroups = state.groupsToRemove;

      const selectedGroups = state.selectedGroups.filter((group) => group.id !== action.payload.id);

      if (state.scope === 'share') {
        if (action.payload.isShared) {
          newRemovedGroups = [...state.groupsToRemove, action.payload];
        }
      } else if (state.scope === 'assign') {
        if (action.payload.isAssigned) {
          newRemovedGroups = [...state.groupsToRemove, action.payload];
        }
      }

      return {
        ...state,
        selectedGroups,
        groupsToRemove: newRemovedGroups,
      };

    case 'RESET':
      return initialState;

    default:
      throw new Error(errorList.actionType);
  }
}
