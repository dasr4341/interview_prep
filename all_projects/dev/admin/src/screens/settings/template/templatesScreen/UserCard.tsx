import NameInitials from 'components/ui/nameInitials/NameInitials';
import { UsersAndGroups } from './TemplateList';

interface UserCardProps {
  userOrGroup: UsersAndGroups;
  allowRemove?: boolean;
  onRemove?: (userOrGroup: UsersAndGroups) => void;
  onClick?: (userOrGroup: UsersAndGroups) => void;
  onHover?: boolean;
}

const UserCard = ({ userOrGroup, allowRemove = false, onRemove, onClick, onHover }: UserCardProps): JSX.Element => {
  return (
    <div
      key={`${userOrGroup.id}-${userOrGroup.name}`}
      className="flex items-center justify-between px-3 py-2 hover:bg-pt-blue-300 hover:bg-opacity-10">
      <div
        className="flex flex-row flex-1 items-center space-x-5"
        onClick={() => {
          if (onClick) {
            onClick(userOrGroup);
          }
        }}>
        <NameInitials name={userOrGroup.name} className="w-12 h-12 border rounded-full border-border-dark text-black" />
        <div className="flex flex-col">
          <label className="font-bold text-black text-sm">{userOrGroup.name}</label>
          {userOrGroup.email && <span className="text-gray-600 font-normal text-xs">{userOrGroup.email}</span>}
          {onHover && userOrGroup.count && (
            <span className="text-gray-600 font-normal text-xs">{userOrGroup.count} Members</span>
          )}
        </div>
      </div>
      {allowRemove ? (
        <button
          className="font-medium text-sm text-pt-blue-300"
          onClick={() => {
            if (onRemove) {
              onRemove(userOrGroup);
            }
          }}>
          Remove
        </button>
      ) : null}
    </div>
  );
};

export default UserCard;
