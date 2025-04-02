/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { createUserGroup } from 'lib/mutation/groups/create-user-group';
import { CreateUserGroup, CreateUserGroupVariables, UpdateUserGroup, UpdateUserGroupVariables } from 'generatedTypes';
import { routes } from 'routes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import catchError, { getGraphError } from 'lib/catch-error';
import { updateUserGroup } from 'lib/mutation/groups/update-user-group';
import { GroupDetailsRoutesInterface } from 'interface/group-details-routes.interface';
import { getUsersIds, userManagementActions } from 'lib/store/slice/user-management';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { successList } from '../../../lib/message.json';
import { config } from 'config';
import { TrackingApi } from 'components/Analytics';

export default function UserGroupAction() {
  const location = useLocation();
  const [createGroupAction, { error: createError }] = useMutation<CreateUserGroup, CreateUserGroupVariables>(createUserGroup);
  const [updateGroupAction, { error: updateError }] = useMutation<UpdateUserGroup, UpdateUserGroupVariables>(updateUserGroup);
  const navigate = useNavigate();
  const query: GroupDetailsRoutesInterface = queryString.parse(location.search);
  const selectedUsers = useSelector((state: RootState) => state.userManagement.group.selectedUsers);
  const deletedUsers = useSelector((state: RootState) => state.userManagement.group.deletedUsers);
  const selectedCompanyGroup = useSelector((state: RootState) => state.userManagement.group.selectedCompanyGroup);
  const selectedDataObjectId = useSelector((state: RootState) => state.userManagement.group.selectedDataObjectId);
  const selectedUseCaseId = useSelector((state: RootState) => state.userManagement.group.selectedUseCaseId);
  const groupName = useSelector((state: RootState) => state.userManagement.group.groupName);
  const dispatch = useDispatch();

  async function createUserGroupAction(): Promise<string> {
    const { data } = await createGroupAction({
      variables: {
        name: String(groupName),
        dataObjectCollectionId: String(selectedDataObjectId),
        useCaseCollectionId: String(selectedUseCaseId),
      },
    });
    return data?.pretaaCreateGroup.id as string;
  }

  function getUsersForUpdate() {
    const allUser = _.cloneDeep(selectedUsers);
    return _.uniq(allUser);
  }

  async function updateUserGroupAction() {
    let isCreated = false;
    let id = query.groupId;

    if (!query.groupId) {
      id = await createUserGroupAction();
      isCreated = true;
    }

    try {
      let variables: UpdateUserGroupVariables = {
        id: String(id),
      };

      // Update group Name if it has changed
      if (groupName) {
        variables = {
          ...variables,
          name: groupName,
        };
      }

      // Update group users if it has changed
      const users = getUsersForUpdate();

      if (users.length > 0) {
        variables = {
          ...variables,
          users: {
            createMany: getUsersIds(users),
          },
        };
      }

      if (deletedUsers.length > 0) {
        variables = {
          ...variables,
          users: {
            createMany: variables?.users?.createMany,
            deleteMany: deletedUsers.map((i) => {
              return {
                userId: {
                  in: [i],
                },
              };
            }),
          },
        };
      }

      const lists = {
        create: selectedCompanyGroup.map((group) => {
          return {
            list: {
              connect: {
                id: group,
              },
            },
          };
        }),
        deleteMany: [{}],
      };
      variables = {
        ...variables,
        lists,
      };

      // Update Data object if it has changed
      if (selectedDataObjectId) {
        variables = {
          ...variables,
          dataObjectCollectionId: selectedDataObjectId,
        };
      }

      // Update use case if it has changed
      if (selectedUseCaseId) {
        variables = {
          ...variables,
          useCaseCollectionId: selectedUseCaseId,
        };
      }

      console.log({ variables });
      let groupId = '';

      if (Number(variables.users?.createMany?.data.length) > config.requestLimit.default || Number(variables.users?.deleteMany?.length) > config.requestLimit.default) {
        const creatingUsersChunk = _.chunk(variables.users?.createMany?.data, config.requestLimit.default);
        const deletingUsersChunk = _.chunk(variables.users?.deleteMany, config.requestLimit.default);

        const requestList: any = {};
        const deleteRequestList: any = {};

        creatingUsersChunk.forEach((c, index) => {
          const chunkV = {
            ...variables,
            users: {
              createMany: {
                ...variables.users?.createMany,
                data: c,
              },
            },
          };

          requestList[index] = async () => {
            const { data } = await updateGroupAction({
              variables: chunkV,
            });
            groupId = data?.pretaaUpdateGroup.id as string;
          };
        });

        deletingUsersChunk.forEach((c, index) => {
          const chunkV = {
            ...variables,
            users: {
              deleteMany: c,
            },
          };

          deleteRequestList[index] = async () => {
            const { data } = await updateGroupAction({
              variables: chunkV,
            });
            groupId = data?.pretaaUpdateGroup.id as string;
          };
        });

        for (const el in requestList) {
          await requestList[el]();
        }

        for (const el in deleteRequestList) {
          await deleteRequestList[el]();
        }

        console.log({ creatingUsersChunk, deletingUsersChunk, requestList });
      } else {
        if (groupName) {
          variables = {
            ...variables,
            name: groupName,
          };
        }
        const { data } = await updateGroupAction({
          variables,
        });
        groupId = String(data?.pretaaUpdateGroup.id);
      }

      if (isCreated) {
        toast.success(successList.groupCreate);
      } else {
        toast.success(successList.groupUpdate);
      }
      dispatch(userManagementActions.resetState());

      if (isCreated) {
        navigate(routes.groupList.match, {
          replace: true,
          state: { isViewEnabled: true, groupId: groupId },
        });
      } else {
        navigate(routes.groupDetails.build(String(groupId)), { replace: true });
      }
    } catch (e: any) {
      catchError(e, true);
      navigate(-1);
    }
  }

  useEffect(() => {
    updateUserGroupAction();
  }, []);

  useEffect(() => {
    if (createError) {
      toast.error(getGraphError(createError.graphQLErrors).join(''));
      navigate(-1);
    }
  }, [createError]);

  useEffect(() => {
    if (updateError) {
      toast.error(getGraphError(updateError.graphQLErrors).join(''));
      navigate(-1);
    }
  }, [updateError]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.userGroupAction.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={`${query.groupId ? 'Edit' : 'Create'} User Group`}></ContentHeader>
      <ContentFrame>{<p>Loading ...</p>}</ContentFrame>
    </>
  );
}
