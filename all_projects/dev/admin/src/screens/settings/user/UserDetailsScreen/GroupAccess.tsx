import { BsPlusCircleFill } from 'react-icons/bs';
import Popover, { PopOverItem } from 'components/Popover';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import usePermission from 'lib/use-permission';
import { UserDetails_pretaaGetUserDetails_groups, UserPermissionNames } from 'generatedTypes';

export default function GroupAccess({
  groups,
  onRedirectToGroupEdit,
  onRedirectToGroupRemoveAccess,
}: {
  groups?: UserDetails_pretaaGetUserDetails_groups[];
  onRedirectToGroupEdit?: any;
  onRedirectToGroupRemoveAccess?: any;
}) {
  const groupPermission = usePermission(UserPermissionNames.GROUPS);

  return (
    <>
      <h3 className="h3 mb-2 mt-7 text-base">
        Group Information
        <button className="px-2 pl-0" onClick={onRedirectToGroupEdit}>
          <BsPlusCircleFill className="text-primary-light inline ml-3" />
        </button>
      </h3>
      <div className="bg-white rounded rounded-xl">
        {groups && groups?.length > 0 &&
          groups?.map((g, index) => {
            return (
              <div className="border-b flex items-center p-4" key={index}>
                <div className="flex-1">
                  <label className="block font-bold">{g.group.name}</label>
                  <p className="text-sm text-gray-600 uppercase">{g.group.groupUserCount || 0} USERS</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Use Case Access</p>
                  <label className="block">{g?.group.useCaseCollections?.name}</label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Data Object Access</p>
                  <label className="block">{g?.group.dataObjectCollections?.name}</label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Company Access List</p>
                  <label className="block">
                    <p className="text-primary">
                      {`${g?.group.lists.length > 0 ? g?.group.lists[0]?.list?.name : ''}
                    ${g?.group.lists.length - 1 > 0 ? ' +' + (g?.group.lists.length - 1) + ' More' : ''}`}
                    </p>
                  </label>
                </div>
                <div className=" md:inset-y-1/2  md:transform md:rotate-90">
                  <Popover>
                    {groupPermission?.capabilities.VIEW && (
                      <PopOverItem>
                        <Link to={routes.groupDetails.build(g.groupId)} className="block">
                          View
                        </Link>
                      </PopOverItem>
                    )}
                    <PopOverItem>
                      <div onClick={() => onRedirectToGroupRemoveAccess(g.groupId)}>Remove Access</div>
                    </PopOverItem>
                  </Popover>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
