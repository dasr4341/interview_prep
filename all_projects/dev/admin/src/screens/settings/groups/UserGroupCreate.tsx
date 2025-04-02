/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import queryString from 'query-string';
import { GroupEditRouteQueryParams } from 'interface/group-edit.interface';
import { LabeledValue } from 'components/LabeledValue';
import { BsPencil, BsPlusCircleFill } from 'react-icons/bs';
import { useLazyQuery } from '@apollo/client';
import { createGroupQuery } from 'lib/query/groups/create-group-page.query';
import {
  GetGroup,
  GetGroupVariables,
  GetUseCaseCollectionsAndDataObjects,
  GetUseCaseCollectionsAndDataObjectsVariables,
  GetUseCaseCollectionsAndDataObjects_pretaaGetUseCaseCollections,
  GetUseCaseCollectionsAndDataObjects_pretaaListDataObjectCollections,
} from 'generatedTypes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { userManagementActions } from 'lib/store/slice/user-management';
import Card from 'components/ui/card/Card';
import SpaceOnly from 'lib/form-validation/space-only';
import { errorList } from '../../../lib/message.json';
import { FaChevronRight } from 'react-icons/fa';
import { getGroupDetails } from 'lib/query/usergroupdetails/user-group-details';
import { TrackingApi } from 'components/Analytics';
import ManageUser from 'components/settings/ManageUser';

interface GroupFormFields {
  name: string;
  useCase: string;
  dataObject: string;
}

export default function UserGroupCreateScreen() {
  const navigate = useNavigate();
  const groupFormSchema = yup.object().shape({
    name: yup.string().transform(SpaceOnly).typeError(errorList.groupCreate).required(),
    useCase: yup.string().required(errorList.useCase),
    dataObject: yup.string().required(errorList.dataObject),
  });
  const location = useLocation();
  const queryParams: GroupEditRouteQueryParams = queryString.parse(location.search) as any;
  const [getCollections, { data: collections }] = useLazyQuery<GetUseCaseCollectionsAndDataObjects, GetUseCaseCollectionsAndDataObjectsVariables>(createGroupQuery);
  const [useCase, setUseCase] = useState<GetUseCaseCollectionsAndDataObjects_pretaaGetUseCaseCollections | null>(null);
  const [dataObject, setDataObject] = useState<GetUseCaseCollectionsAndDataObjects_pretaaListDataObjectCollections | null>(null);
  const userManagement = useSelector((state: RootState) => state.userManagement);
  const dispatch = useDispatch();

  const [getGroup, { data }] = useLazyQuery<GetGroup, GetGroupVariables>(getGroupDetails, {
    variables: {
      id: queryParams.groupId,
      // This is required when groups modify
      usersTake: 100000000,
      listTake: 1,
      groupId: queryParams.groupId,
    },
  });

  useEffect(() => {
    if (queryParams.groupId) {
      getGroup();
    }
  }, [queryParams.groupId]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<GroupFormFields>({
    resolver: yupResolver(groupFormSchema) as unknown as any,
  });

  function onSubmit(formData: GroupFormFields) {
    const query: GroupEditRouteQueryParams = {
      ...queryParams,
    };
    dispatch(userManagementActions.updateName(formData.name));
    navigate(routes.userGroupAction.build(query));
  }

  useEffect(() => {
    if (userManagement.group.groupName) {
      setValue('name', userManagement.group.groupName);
    }
  }, [userManagement.group.groupName, setValue]);

  useEffect(() => {
    return () => {
      if (getValues('name')) {
        dispatch(userManagementActions.updateName(getValues('name')));
      }
    };
  }, []);

  useEffect(() => {
    if (collections?.pretaaListDataObjectCollections[0]) {
      if (!collections?.pretaaListDataObjectCollections[0]?.default) setValue('dataObject', collections?.pretaaListDataObjectCollections[0].name);
      if (!collections?.pretaaGetUseCaseCollections[0]?.default) setValue('useCase', collections?.pretaaGetUseCaseCollections[0].name);
      setUseCase(collections?.pretaaGetUseCaseCollections[0]);
      setDataObject(collections?.pretaaListDataObjectCollections[0]);
    }
  }, [collections]);

  useEffect(() => {
    let query: GetUseCaseCollectionsAndDataObjectsVariables = {};

    if (queryParams.groupId) {
      query = {
        useCaseWhere: {
          groups: {
            some: {
              id: {
                equals: String(queryParams.groupId),
              },
            },
          },
        },
        dataObjectWhere: {
          groups: {
            some: {
              id: {
                equals: String(queryParams.groupId),
              },
            },
          },
        },
        groupId: String(queryParams.groupId),
      };
    } else {
      // Create Mode different type of data can be collected from different screen
      if (userManagement.group.selectedUseCaseId) {
        query = {
          useCaseWhere: {
            id: {
              equals: userManagement.group.selectedUseCaseId,
            },
          },
        };
      } else {
        query = {
          useCaseWhere: {
            default: {
              equals: true,
            },
          },
        };
      }

      if (userManagement.group.selectedDataObjectId) {
        query = {
          ...query,
          dataObjectWhere: {
            id: {
              equals: userManagement.group.selectedDataObjectId,
            },
          },
        };
      } else {
        query = {
          ...query,
          dataObjectWhere: {
            default: {
              equals: true,
            },
          },
        };
      }
      if (userManagement.group.selectedCompanyGroup && userManagement.group.selectedCompanyGroup.length) {
        query = {
          ...query,
          listsWhere: {
            id: {
              in: userManagement.group.selectedCompanyGroup,
            },
          },
        };
      }
    }
    getCollections({
      variables: query,
    });
  }, [userManagement.group.selectedDataObjectId, userManagement.group.selectedUseCaseId]);

  function handleCompanyListAdd() {
    if (queryParams.groupId) {
      const ids = collections?.pretaaGetLists.map((list) => list.id) as string[];
      dispatch(userManagementActions.addCompanyGroup(ids));
      navigate(routes.companyGroupList.build({ canSelect: true, groupId: queryParams.groupId }));
    } else {
      navigate(routes.companyGroupList.build({ canSelect: true }));
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.createUserGroup.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader className="lg:relative">
        <div
          className="block flex-1
        relative text-primary mb-5 mt-2">
          <h1
            className="h1 leading-none text-primary font-bold
              text-md lg:text-lg"
            data-test-id="page-title">
            {`${queryParams.groupId ? 'Edit' : 'New'} User Group`}
          </h1>
        </div>
        <ManageUser testId='add-user-button' userCount={data?.pretaaGetGroup.users.length || userManagement.group.selectedUsers.length || 0} />
      </ContentHeader>
      <ContentFrame classes={['flex-1', 'flex', 'flex-col']}>
        <form className="w-full flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1 flex flex-col">
            <div className="max-w-md">
              <label htmlFor="groupName" className="h2">
                User group name
              </label>
              <input
                type="text"
                className="input w-full mt-3"
                placeholder="Enter a name"
                {...register('name')}
                data-test-id="group-name-input"
              />

              <ErrorMessage message={errors.name?.message as string} />
            </div>

            <div className="pt-3 pb-7 mt-6">
              <div className="pb-2 pt-4 border-b border-gray-300 mb-2">
                <h3 className="h3">
                  Company list access
                  <button onClick={() => handleCompanyListAdd()} type="button">
                    <BsPlusCircleFill className="text-primary-light inline ml-3" />
                  </button>
                </h3>
              </div>
              {(userManagement.group.selectedCompanyGroup.length || queryParams.groupId) &&
                collections?.pretaaGetLists.map((list) => {
                  return (
                    <div key={list.id}>
                      <Card className="p-6 flex items-center" key={list.id}>
                        <h3 className="flex-1 text-base font-bold text-pt-primary">
                          {list?.name}
                          <p className="text-xs text-gray-600 uppercase font-semibold">{list._count?.listCompanies || 0} companies</p>
                        </h3>
                        <Link to={routes.companyGroupEdit.build(String(list?.id))} className="block outline-none">
                          <div className="flex-1">
                            <div className="flex justify-end">
                              <FaChevronRight className="text-base text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      </Card>
                    </div>
                  );
                })}
            </div>

            <div className="mb-5">
              <div className="pb-2 pt-4">
                <h3 className="h3">
                  Data Object Access
                  <Link
                    to={routes.dataObjects.build({
                      canSelect: true,
                      groupId: queryParams.groupId,
                      dataObjectId: dataObject?.id,
                    })}
                    data-test-id="data-object-selection-btn">
                    <BsPencil className="text-primary-light inline ml-3" />
                  </Link>
                </h3>
              </div>
              {!dataObject?.default && (
                <Card className="p-6 flex items-center">
                  <h3 className="flex-1 text-base font-bold text-pt-primary" data-test-id="card-name">
                    {dataObject?.name}
                  </h3>
                  <LabeledValue label="Data Object Access" className="flex-1">
                    {dataObject?.name}
                  </LabeledValue>
                  <Link to={routes.dataObjectsDetails.build({ id: String(dataObject?.id) })} className="block outline-none">
                    <div className="flex-1">
                      <div className="flex justify-end">
                        <FaChevronRight className="text-base text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </Card>
              )}
              <ErrorMessage message={errors.dataObject?.message as string} />
            </div>

            <div className="mb-5">
              <div className="pb-2 pt-4">
                <h3 className="h3">
                  Use Case Access
                  <Link
                    to={routes.useCaseList.build({
                      canSelect: true,
                      groupId: queryParams.groupId,
                      useCaseId: useCase?.id,
                    })}
                    data-test-id="usecase-selection-btn">
                    <BsPencil className="text-primary-light inline ml-3" />
                  </Link>
                </h3>
              </div>
              {!useCase?.default && (
                <Card className="p-6 flex items-center">
                  <h3 className="flex-1 text-base font-bold text-pt-primary" data-test-id="card-name">
                    {useCase?.name}
                  </h3>
                  <LabeledValue label="Use Case Access" className="flex-1">
                    {useCase?.name}
                  </LabeledValue>
                  <Link to={routes.useCaseDetails.build({ id: String(useCase?.id) })} className="block outline-none">
                    <div className="flex-1">
                      <div className="flex justify-end">
                        <FaChevronRight className="text-base text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </Card>
              )}
              <ErrorMessage message={errors.useCase?.message as string} />
            </div>
          </div>
          <div className="pt-6 flex">
            <Button>Save</Button>

            <Button
              type="button"
              style="bg-none"
              onClick={() => {
                navigate(-1);
              }}>
              Cancel
            </Button>
          </div>
        </form>
      </ContentFrame>
    </div>
  );
}
