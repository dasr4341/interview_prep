import { ApolloQueryResult, useLazyQuery, useMutation } from '@apollo/client';
import Popover, { PopOverItem } from 'components/Popover';
import Button from 'components/ui/button/Button';
import {
  CloneEmailTemplateVariables,
  GetEmailTemplateSharedAssignedDataQuery,
  GetEmailTemplateSharedAssignedDataQueryVariables,
  GetTemplates,
  GetTemplatesVariables,
  GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned,
  GetUsersAndGroups,
  GetUsersAndGroupsVariables,
  PretaaDeleteEmailTemplate,
  PretaaDeleteEmailTemplateVariables,
  ShareOrAssignEmailTemplateWithUsersOrGroups,
  ShareOrAssignEmailTemplateWithUsersOrGroupsVariables,
  UnshareOrUnassignEmailTemplateWithUsersOrGroups,
  UnshareOrUnassignEmailTemplateWithUsersOrGroupsVariables,
  UserPermissionNames,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { CloneEmailTemplateMutation } from 'lib/mutation/template/clone-email-template';
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import { routes } from 'routes';
import { reducer as shareOrAssignReducer, initialState as shareOrAssignInitialState } from './ShareOrAssign.reducer';
import AsyncSelect from 'react-select/async';
import { customStyleSelectBox } from 'components/ui/SelectBox';
import _ from 'lodash';
import { components } from 'react-select';
import './templatescreen.scoped.scss';
import ShareIcon from 'assets/icons/icon_share.svg';
import UserCard from './UserCard';
import UserListView from './UserListView';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CloseIcon from 'assets/icons/icon_close.svg';
import { ShareOrAssignTemplate } from 'lib/query/templates/share-assign-template';
import { UnshareOrUnassignTemplate } from 'lib/query/templates/unshare-unassign-template';
import { GetUsersAndGroups as GetUsersAndGroupsQuery } from 'lib/query/templates/get-users-and-groups';
import { RemoveEmailTemplate } from 'lib/query/templates/remove-email-template';
import { client } from 'apiClient';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { getEmailTemplateSharedAssignedDataQuery } from 'lib/query/templates/get-email-template-shared-assigned-data';
import { successList } from '../../../../lib/message.json';
import usePermission from 'lib/use-permission';

interface SelectBox {
  value: number;
  label: string;
  email?: string;
  count?: number;
}

export interface UsersAndGroups {
  id: string;
  name: string;
  email?: string;
  count?: number;
  isShared: boolean;
  isAssigned: boolean;
}

const OptionItem = (props: any) => {
  const { value, label, email, count, isShared, isAssigned } = props.data;

  const userOrGroup = {
    id: value,
    name: label,
    email: email,
    count: count,
    isShared: isShared,
    isAssigned: isAssigned,
  };
  return (
    <div className={!userOrGroup?.email ? 'tooltip' : ''}>
      <components.Option {...props}>
        <UserCard userOrGroup={userOrGroup} />
        {!userOrGroup?.email && (
          <div className="tooltip-text">
            <UserCard onHover={true} userOrGroup={userOrGroup} />
          </div>
        )}
      </components.Option>
    </div>
  );
};

export default function TemplateList({
  templatesList,
  refetchTemplates,
}: {
  templatesList: GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned[];
  refetchTemplates:
    | ((variables?: Partial<GetTemplatesVariables> | undefined) => Promise<ApolloQueryResult<GetTemplates>>)
    | undefined;
}) {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const emailTemplateAssignPermission = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES_ASSIGN);
  const emailTemplateSharePermission = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES_SHARE);
  const emailMessageTemplate = usePermission(UserPermissionNames.EMAIL_MESSAGE_TEMPLATES);

  const [userAndGroupList, setUserAndGroupList] = useState<UsersAndGroups[]>();
  const [templateToRemove, setTemplateToRemove] = useState<string | null>(null);
  const [isRemovingTemplate, setIsRemovingTemplate] = useState(false);
  const [shareOrAssignState, shareOrAssignDispatch] = useReducer(shareOrAssignReducer, shareOrAssignInitialState);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);


  const [getTemplateSharedAssignedData, { data: selectedTemplate }] = useLazyQuery<
    GetEmailTemplateSharedAssignedDataQuery,
    GetEmailTemplateSharedAssignedDataQueryVariables
  >(getEmailTemplateSharedAssignedDataQuery);

  const fetchTemplateSharedAssignedData = (templateId: string) => {
    getTemplateSharedAssignedData({
      variables: {
        templateId: { id: templateId },
      },
    });
  };

  const getDropdownItems = (list: UsersAndGroups[]) =>
    list.map(({ id, name, email, count, isShared, isAssigned }) => ({
      value: id,
      label: name,
      email,
      count,
      isShared,
      isAssigned,
    })) as unknown as SelectBox[];

  const loadOptions = (inputValue: string, callback: (options: any) => void) => {
    (async () => {
      const result = await client.query<GetUsersAndGroups, GetUsersAndGroupsVariables>({
        query: GetUsersAndGroupsQuery,
        variables: {
          take: 20,
          skip: 0,
          searchPhrase: inputValue
        },
      });
      const groupList = result.data.pretaaGetFilteredGroups.map(({ id, name, _count }) => ({
        id,
        name,
        count: _count?.users,
        isShared: false,
        isAssigned: false,
        email: ''
      }));
      const userList = result.data.pretaaGetUserList.map(({ id, name, email }) => ({
        id,
        name,
        email,
        isShared: false,
        isAssigned: false,
      }));
      const usersAndGroupsList = [...groupList, ...userList].filter((x) => x?.email !== user?.email);
      const selectedUsersAndGroups = [...shareOrAssignState.selectedUsers, ...shareOrAssignState.selectedGroups];
      const updatedList = usersAndGroupsList.filter((o1) => !selectedUsersAndGroups.some((o2) => o1.id === o2.id));
      callback(getDropdownItems(updatedList));
    })();
  };

  const delayedCallback = _.debounce(loadOptions, 1000);

  const handleInputChange = (inputValue: string, callback: any) => delayedCallback(inputValue, callback);

  // Hooks for clone a existing email template
  const [cloneTemplate] = useMutation(CloneEmailTemplateMutation);

  // Sending clone template request
  const onCloneTemplate = async (template: CloneEmailTemplateVariables) => {
    try {
      const { data } = await cloneTemplate({
        variables: template,
      });
      if (data) {
        if (refetchTemplates) refetchTemplates();
        toast.success(successList.duplicateTemplate);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  // mutation for sharing/assigning a template
  const [shareOrAssignTemplateMutation] = useMutation<
    ShareOrAssignEmailTemplateWithUsersOrGroups,
    ShareOrAssignEmailTemplateWithUsersOrGroupsVariables
  >(ShareOrAssignTemplate);

  // Sending Share or Assign Template Request
  const shareOrAssignTemplate = async (
    shareOrAssignTemplateVariable: ShareOrAssignEmailTemplateWithUsersOrGroupsVariables
  ) => {
    try {
      const { data } = await shareOrAssignTemplateMutation({ variables: shareOrAssignTemplateVariable });
      if (data) {
        toast.success(shareOrAssignState.scope === 'assign' ? successList.templateAssign : successList.templateShare);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  // mutation to unshare/unassign a template
  const [unshareOrUnassignMutation] = useMutation<
    UnshareOrUnassignEmailTemplateWithUsersOrGroups,
    UnshareOrUnassignEmailTemplateWithUsersOrGroupsVariables
  >(UnshareOrUnassignTemplate);

  // mutation to delete a template
  const [removeEmailTemplate] = useMutation<PretaaDeleteEmailTemplate, PretaaDeleteEmailTemplateVariables>(
    RemoveEmailTemplate
  );

  // Sending template delete request.
  const removeTemplate = async (removeTemplateVariable: PretaaDeleteEmailTemplateVariables) => {
    setIsRemovingTemplate(true);
    try {
      const { data } = await removeEmailTemplate({
        variables: removeTemplateVariable,
      });
      if (data) {
        if (refetchTemplates) refetchTemplates();
        toast.success(successList.templateRemoved);
      }
    } catch (e) {
      catchError(e, true);
    } finally {
      setIsRemovingTemplate(false);
    }
  };

  // Sending Unshare or Unassign Template Request
  const unshareOrUnassignTemplate = async (
    unshareOrUnassignTemplateVariable: UnshareOrUnassignEmailTemplateWithUsersOrGroupsVariables
  ) => {
    try {
      const { data } = await unshareOrUnassignMutation({
        variables: unshareOrUnassignTemplateVariable,
      });
      if (data) {
        toast.success(
          shareOrAssignState.scope === 'assign' ? successList.templateUnAssign : successList.templateUnShare
        );
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  const onShare = (template: GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned) => {
    if (selectedTemplate?.pretaaGetEmailTemplate) {
      const initialGroups: UsersAndGroups[] = selectedTemplate.pretaaGetEmailTemplate.messageTemplateGroups
        .filter((group) => {
          return group.isShared;
        })
        .map((group) => {
          return {
            id: group.groupId,
            name: group.group.name,
            count: group.group._count?.users || 0,
            isShared: true,
            isAssigned: false,
          };
        });

      const initialUsers: UsersAndGroups[] = selectedTemplate.pretaaGetEmailTemplate.messageTemplateUsers
        .filter((u) => {
          return u.isShared;
        })
        .map((u) => {
          return {
            id: u.userId,
            name: u.user.name,
            email: u.user.email,
            isShared: true,
            isAssigned: false,
          };
        });

      shareOrAssignDispatch({
        type: 'CHANGE_SCOPE',
        payload: {
          scope: 'share',
          selectedGroups: initialGroups,
          selectedUsers: initialUsers,
          templateId: template.id,
        },
      });
    }
  };

  const onAssign = (template: GetTemplates_pretaaGetEmailTemplatesCreatedOrSharedOrAssigned) => {
    if (selectedTemplate?.pretaaGetEmailTemplate) {
      const initialGroups: UsersAndGroups[] = selectedTemplate.pretaaGetEmailTemplate.messageTemplateGroups
        .filter((group) => {
          return !group.isShared;
        })
        .map((group) => {
          return {
            id: group.groupId,
            name: group.group.name,
            count: group.group._count?.users || 0,
            isShared: false,
            isAssigned: true,
          };
        });

      const initialUsers: UsersAndGroups[] = selectedTemplate.pretaaGetEmailTemplate.messageTemplateUsers
        .filter((u) => {
          return !u.isShared;
        })
        .map((u) => {
          return {
            id: u.userId,
            name: u.user.name,
            email: u.user.email,
            isShared: false,
            isAssigned: true,
          };
        });

      shareOrAssignDispatch({
        type: 'CHANGE_SCOPE',
        payload: {
          scope: 'assign',
          selectedGroups: initialGroups,
          selectedUsers: initialUsers,
          templateId: template.id,
        },
      });
    }
  };

  const onSend = async (templateId: string) => {
    if (shareOrAssignState.scope === 'share') {
      const userIdArray = shareOrAssignState.selectedUsers.filter((u) => !u.isShared).map((u) => u.id);
      const groupIdArray = shareOrAssignState.selectedGroups
        .filter((group) => !group.isShared)
        .map((group) => group.id);
      const toBeRemovedUserIdArray = shareOrAssignState.usersToRemove
        .filter((u) => u.isShared)
        .map((u) => u.id);
      const toBeRemovedGroupIdArray = shareOrAssignState.groupsToRemove
        .filter((group) => group.isShared)
        .map((group) => group.id);
      if (userIdArray.length || groupIdArray.length) {
        await shareOrAssignTemplate({
          parentId: templateId,
          userIdArrayShared: userIdArray,
          groupIdArrayShared: groupIdArray,
          groupIdArrayAssigned: [],
          userIdArrayAssigned: [],
        });
      }
      if (toBeRemovedGroupIdArray.length || toBeRemovedUserIdArray.length) {
        await unshareOrUnassignTemplate({
          parentId: templateId,
          userIdArrayShared: toBeRemovedUserIdArray,
          groupIdArrayShared: toBeRemovedGroupIdArray,
          groupIdArrayAssigned: [],
          userIdArrayAssigned: [],
        });
      }
    } else if (shareOrAssignState.scope === 'assign') {
      // TODO - Make this process more generic and use for share and assign both instead of duplicating.
      const userIdArray = shareOrAssignState.selectedUsers.filter((u) => !u.isAssigned).map((u) => u.id);
      const groupIdArray = shareOrAssignState.selectedGroups
        .filter((group) => !group.isAssigned)
        .map((group) => group.id);
      const toBeRemovedUserIdArray = shareOrAssignState.usersToRemove
        .filter((u) => u.isAssigned)
        .map((u) => u.id);
      const toBeRemovedGroupIdArray = shareOrAssignState.groupsToRemove
        .filter((group) => group.isAssigned)
        .map((group) => group.id);
      if (userIdArray.length || groupIdArray.length) {
        await shareOrAssignTemplate({
          parentId: templateId,
          userIdArrayShared: [],
          groupIdArrayShared: [],
          groupIdArrayAssigned: groupIdArray,
          userIdArrayAssigned: userIdArray,
        });
      }
      if (toBeRemovedGroupIdArray.length || toBeRemovedUserIdArray.length) {
        await unshareOrUnassignTemplate({
          parentId: templateId,
          userIdArrayShared: [],
          groupIdArrayShared: [],
          groupIdArrayAssigned: toBeRemovedGroupIdArray,
          userIdArrayAssigned: toBeRemovedUserIdArray,
        });
      }
    }
    shareOrAssignDispatch({ type: 'RESET' });
  };

  const onRemove = (userOrGroup: UsersAndGroups) => {
    if (userOrGroup.email) {
      shareOrAssignDispatch({ type: 'REMOVE_USER', payload: userOrGroup });
    } else {
      shareOrAssignDispatch({ type: 'REMOVE_GROUP', payload: userOrGroup });
    }
    if (userAndGroupList) {
      const exist = userAndGroupList.findIndex((u) => {
        return u.id === userOrGroup.id;
      });
      if (exist === -1) {
        const updatesUsersAndGroupList = [...userAndGroupList, { ...userOrGroup }];
        setUserAndGroupList(updatesUsersAndGroupList);
      }
    }
  };

  const onChange = ({ value, label, email, count, isShared, isAssigned }: any) => {
    const userOrGroup = { id: value, name: label, email, count, isShared, isAssigned };
    if (userOrGroup.email) {
      shareOrAssignDispatch({ type: 'ADD_USER', payload: userOrGroup });
    } else {
      shareOrAssignDispatch({ type: 'ADD_GROUP', payload: userOrGroup });
    }
    const updatedUserOrGroups = userAndGroupList?.filter((u) => {
      return u.id !== userOrGroup.id;
    });
    setUserAndGroupList(updatedUserOrGroups);
  };

  return (
    <div>
      {templatesList.map((template) => {
        const isShared = template?.creator?.id !== currentUser?.currentUser?.id;

        return (
          <div
            className="flex flex-row bg-white w-full 
          px-4 py-6 text-base justify-between items-center
          last:rounded-b-xl first:rounded-t-xl border-gray-100 border-b
          last:border-b-0"
            key={template?.id}
            data-test-id="email_templates">
            <div className="flex flex-col md:gap-0 gap-1">
              <span className="text-pt-primary font-bold flex">
                {isShared && <img className="w-5 mr-2 inline-block flex-none" src={ShareIcon} alt="share_icon" />}
                <div data-test-id="template-title" className='grow'>
                  {template?.title}
                </div>
              </span>
              <span
                className="text-gray-600 text-sm font-semibold line-clamp-2
                  md:line-clamp-none">
                CREATOR, {template?.creator?.name.toUpperCase()}
              </span>
            </div>
            <Popover
              trigger={
                <button  data-test-id ="share-or-assign" className="text-gray-600" onClick={() => fetchTemplateSharedAssignedData(template.id)}>
                  <BsThreeDotsVertical />
                </button>
              }>
              <PopOverItem onClick={() => navigate(routes.templateDetails.build(String(template?.id)))}>
                View
              </PopOverItem>
              {!isShared && emailMessageTemplate?.capabilities.EDIT && (
                <PopOverItem onClick={() => navigate(routes.templateEdit.build(String(template.id)))}>Edit</PopOverItem>
              )}

              <PopOverItem onClick={() => onCloneTemplate({ id: template?.id })}>Duplicate</PopOverItem>

              {!isShared && (
                <>
                  {emailTemplateSharePermission?.capabilities?.EXECUTE && (
                    <PopOverItem onClick={() => onShare(template)}>Share</PopOverItem>
                  )}
                  {emailTemplateAssignPermission?.capabilities?.EXECUTE && (
                    <PopOverItem onClick={() => onAssign(template)}>Assign</PopOverItem>
                  )}
                </>
              )}
              {/* creator_id === current_user_id -> show remove button */}
              {emailMessageTemplate?.capabilities.DELETE && (
              <PopOverItem onClick={() => setTemplateToRemove(template.id)}>
                {template.creator.id === currentUser.currentUser.id ? 'Delete' : 'Remove'}
              </PopOverItem>
              )}
            </Popover>
          </div>
        );
      })}
      {typeof shareOrAssignState.scope === 'string' && shareOrAssignState.templateId && (
        <Popup
          modal={true}
          nested={true}
          open={typeof shareOrAssignState.scope === 'string' ? true : false}
          closeOnDocumentClick
          arrow={false}
          position="center center"
          onClose={() => {
            shareOrAssignDispatch({ type: 'RESET' });
            setUserAndGroupList(undefined);
          }}
          className="rounded-md"
          contentStyle={{ borderRadius: '13px' }}
          overlayStyle={{ background: 'rgba(24, 24, 24, 0.1)' }}>
          <div className="modal p-3 flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <h2 className="font-bold text-md text-black my-3">
                {shareOrAssignState.scope === 'share' ? 'Share with people and groups' : 'Assign to people and groups'}
              </h2>
              <div className="cursor-pointer">
                <img src={CloseIcon} alt="close_icon" onClick={() => shareOrAssignDispatch({ type: 'RESET' })} />
              </div>
            </div>

            <AsyncSelect
              components={{ Option: OptionItem, DropdownIndicator: null }}
              loadOptions={handleInputChange}
              defaultOptions={userAndGroupList}
              className="basic-single rounded-lg"
              styles={customStyleSelectBox}
              value={null}
              onChange={onChange}
              options={[]}
              placeholder="Add people and groups"
            />
            {(shareOrAssignState.selectedGroups.length > 0 || shareOrAssignState.selectedUsers.length > 0) && (
              <>
                <div className="font-extrabold">
                  {shareOrAssignState.scope === 'share' ? 'Shared With:' : 'Assigned To:'}
                </div>
                <UserListView
                  userAndGroupList={[...shareOrAssignState.selectedUsers, ...shareOrAssignState.selectedGroups]}
                  allowRemove
                  onRemove={onRemove}
                />
              </>
            )}
            <div className="flex items-center">
              <Button
                onClick={() => {
                  if (shareOrAssignState.templateId) {
                    onSend(shareOrAssignState.templateId);
                  }
                }}>
                Send
              </Button>
            </div>
          </div>
        </Popup>
      )}
      <ConfirmationDialog
        modalState={templateToRemove ? true : false}
        className="max-w-sm"
        disabledBtn={isRemovingTemplate}
        confirmBtnText="Yes"
        onConfirm={async () => {
          if (templateToRemove) {
            await removeTemplate({ id: templateToRemove });
          }
          setTemplateToRemove(null);
        }}
        onCancel={() => setTemplateToRemove(null)}>
        Are you sure you want to delete this template?
      </ConfirmationDialog>
    </div>
  );
}
