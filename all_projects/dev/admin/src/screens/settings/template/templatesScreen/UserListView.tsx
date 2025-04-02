import { FC } from 'react';
import { UsersAndGroups } from './TemplateList';
import UserCard from './UserCard';

interface UserListViewProps {
  userAndGroupList: UsersAndGroups[];
  allowRemove?: boolean;
  onRemove?: (userOrGroup: UsersAndGroups) => void;
  onClick?: (userOrGroup: UsersAndGroups) => void;
}

const UserListView: FC<UserListViewProps> = ({
  userAndGroupList,
  allowRemove = false,
  onRemove,
  onClick,
}: UserListViewProps): JSX.Element => {
  return (
    <div className="h-52 overflow-y-scroll divide-y divide-gray-350">
      {userAndGroupList.map((userAndGroup) => {
        return (
          <UserCard
            key={`${userAndGroup.id}-${userAndGroup.name}`}
            userOrGroup={userAndGroup}
            allowRemove={allowRemove}
            onRemove={onRemove}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
};

export default UserListView;
