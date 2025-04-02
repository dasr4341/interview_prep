import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from 'components/SearchField';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { routes } from 'routes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GroupList from 'screens/settings/groups/group-list/GroupList';
import { UserGroupRouteInterface } from 'interface/user-group-route.interface';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { userManagementActions } from 'lib/store/slice/user-management';
import { useState, useEffect } from 'react';
import usePermission from 'lib/use-permission';
import { errorList } from '../../../../lib/message.json';
import { UserPermissionNames } from 'generatedTypes';
import { NavigationHeader } from 'components/NavigationHeader';
import { IoMdClose } from 'react-icons/io';
import { TrackingApi } from 'components/Analytics';

export default function UserGroupListScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groupsPermission = usePermission(UserPermissionNames.GROUPS);
  const query: UserGroupRouteInterface = queryString.parse(location.search);
  const selectedGroups = useSelector((state: RootState) => state.userManagement.group.selectedUserGroup);
  const [groupError, setGroupError] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isGroupViewVisible, setIsGroupViewVisible] = useState((location.state as any)?.isViewEnabled);

  // This is to make error reactive and will remove error when selectedGroups changes.

  useEffect(() => {
    setGroupError(false);
  }, [selectedGroups]);

  function handleRedirect() {
    if (query.canSelect && query.userId) {
      if (selectedGroups.length === 0) {
        setGroupError(true);
      } else {
        setGroupError(false);
        navigate(routes.UserDetailsUpdate.build(query.userId));
      }
    }
    if (query.canSelect && !query.userId && !query.name) {
      navigate(-1);
    }
    if (query.canSelect && !query.userId && query.name) {
      navigate(routes.companyGroupCreate.build({ name: query.name }));
    }
  }

  function handleCancel() {
    dispatch(userManagementActions.resetUserGroup());
    navigate(-1);
  }

  function createUser() {
    dispatch(userManagementActions.resetState());
    navigate(routes.createUserGroup.match);
  }

  const handleVisible = () => {
    return !!query.canSelect;
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.groupList.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader breadcrumb={handleVisible()} disableGoBack={!handleVisible()}>
        <div className="flex items-center justify-between gap-0 my-3 flex-col md:flex-row">
          <div>
            <NavigationHeader>
              <div className="block relative text-primary mb-5 mt-2 cursor-pointer">Group Management</div>
            </NavigationHeader>
            <SearchField defaultValue={''} onSearch={(value) => setSearchText(value)} />
          </div>
          {groupsPermission?.capabilities.CREATE && (
            <div className="flex justify-end">
              <Button text="Create User Group" data-testid="create-edit-group-btn" style="primary" onClick={createUser} />
            </div>
          )}
        </div>
      </ContentHeader>
      {isGroupViewVisible && (
        <div className="pl-10 pt-3 pb-3" style={{ backgroundColor: '#ED6513' }}>
          <span className="text-white text-base">
            New User Group Created.{' '}
            <Link to={routes.groupDetails.build(String((location.state as any).groupId))} className="underline">
              {' '}
              View it
            </Link>
          </span>
          <button
            type="button"
            data-test-id="close-modal"
            onClick={() => {
              setIsGroupViewVisible(false);
            }}
            className="float-right outline-none mr-5">
            <IoMdClose className="text-lg text-white" />
          </button>
        </div>
      )}
      <ContentFrame className="bg-white flex-1 flex flex-col">
        <GroupList searchText={searchText} />
      </ContentFrame>
      {query.canSelect && (
        <div className="flex flex-col bg-white space-y-3 py-4 px-5 lg:px-16">
          {groupError ? (
            <div className="w-max">
              <ErrorMessage message={errorList.group} />
            </div>
          ) : null}
          <div className="flex w-full">
            <Button text="Save" onClick={handleRedirect} />
            <Button text="Cancel" style="other" onClick={handleCancel} />
          </div>
        </div>
      )}
    </div>
  );
}
