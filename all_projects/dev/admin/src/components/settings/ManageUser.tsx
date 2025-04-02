import Button from 'components/ui/button/Button';
import { GroupEditRouteQueryParams } from 'interface/group-edit.interface';
import React from 'react';
import queryString from 'query-string';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';

export default function ManageUser({
  className,
  testId,
  userCount
} : {
  className?: string,
  testId?: string,
  userCount?: number
}): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams: GroupEditRouteQueryParams = queryString.parse(location.search) as any;
  const userManagement = useSelector((state: RootState) => state.userManagement);

  function manageUser() {
    if (queryParams.groupId || id) {
      navigate(
        routes.selectedUserListGrid.build({
          groupId: String(queryParams.groupId || id),
          selectedGroup: true
        })
      );
    } else if (queryParams.groupCount) {
      navigate(routes.userListGrid.build({
        groupCount: queryParams.groupCount
      }));
    } else {
      navigate(routes.userListGrid.match);
    }
  } 

  return (
    <Button classes={`lg:absolute lg:right-10 lg:bottom-10 ${className}`}
      testId={testId}
      onClick={manageUser}
      type="button">
        {queryParams.groupId || id ? 'Manage' : 'Add'} users
          (<span data-test-id="user-count">
            {queryParams.groupCount ? queryParams.groupCount : (userManagement.group.selectedUsers.length || userCount || 0) }
          </span>)
    </Button>
  );
}
