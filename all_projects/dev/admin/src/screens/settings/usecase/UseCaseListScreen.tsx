/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { DeleteUseCaseCollection, DeleteUseCaseCollectionVariables, GetUseCaseCollections_pretaaGetUseCaseCollections, UserPermissionNames } from 'generatedTypes';
import usecaseApi from 'lib/api/usecase';
import catchError from 'lib/catch-error';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { useDispatch } from 'react-redux';
import { userManagementActions } from 'lib/store/slice/user-management';
import ConfirmationBox from 'components/ConfirmationDialog';
import { useMutation } from '@apollo/client';
import { DeleteUseCaseCollectionMutation } from 'lib/mutation/usecase/delete-usecase-collection';
import { toast } from 'react-toastify';
import Popover, { PopOverItem } from 'components/Popover';
import { LabeledValue } from 'components/LabeledValue';
import { BsPencil } from 'react-icons/bs';
import usePermission from 'lib/use-permission';
import { successList } from '../../../lib/message.json';
import useQueryParams from '../../../lib/use-queryparams';
import { TrackingApi } from 'components/Analytics';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';

export default function UseCaseListScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const useCasePermissions = usePermission(UserPermissionNames.USE_CASE_COLLECTIONS);
  const query = useQueryParams();

  const [useCaseList, setUseCaseList] = useState<GetUseCaseCollections_pretaaGetUseCaseCollections[]>([]);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(String(query?.useCaseId) || null);

  const [deleteUseCaseAction, { loading: loadingDeleteUseCase }] = useMutation<DeleteUseCaseCollection, DeleteUseCaseCollectionVariables>(DeleteUseCaseCollectionMutation, {
    onCompleted: (response) => {
      toast.success(successList.useCaseDelete);
      setUseCaseList(useCaseList.filter((c) => c.id !== response.pretaaDeleteUseCaseCollection?.id));
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  async function getUseCaseCollections() {
    try {
      const result = await usecaseApi().getUseCaseCollections();
      setUseCaseList(result.data.pretaaGetUseCaseCollections);
    } catch (err) {
      catchError(err);
    }
  }

  useEffect(() => {
    getUseCaseCollections();
  }, []);

  const navigateToCreate = () => {
    navigate(routes.useCaseCreate.match);
  };

  const handleDataObjectSelection = (e: any, id: string) => {
    setSelectedObject(id);
  };

  function handleRedirect() {
    dispatch(userManagementActions.addUseCaseId(String(selectedObject)));
    if (query.groupId) {
      navigate(routes.userGroupAction.build(query));
    } else {
      navigate(routes.createUserGroup.match);
    }
  }

  function onConfirm(id: string) {
    deleteUseCaseAction({
      variables: {
        id,
      },
    });
    setSelectedUseCase(null);
  }

  function onCancel() {
    setSelectedUseCase(null);
  }

  const handleVisible = () => {
    return !!query.canSelect;
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.useCaseList.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Use Case Management" className="xl:relative" breadcrumb={handleVisible()} disableGoBack={!handleVisible()}>
        {useCasePermissions?.capabilities.CREATE && (
          <Button testId="create-use-case-button" style="primary" classes="xl:absolute xl:right-10 xl:bottom-10" text="Create new collection" onClick={navigateToCreate} />
        )}
      </ContentHeader>
      <ContentFrame className="flex-1">
        {useCaseList
          .filter((items) => !items.default)
          .map((i) => {
            return (
              <div className="bg-white border-not-last-child flex space-x-4 items-center p-6 data-row" key={i.id} data-test-id="useCase_item">
                {query.canSelect && (
                  <input type="radio" className="cursor-pointer" value={`${i.id}`} checked={selectedObject === i.id} onChange={(e) => handleDataObjectSelection(e, i.id)} />
                )}
                <h3 className="flex-1 text-base font-bold" data-test-id="use-case-title">
                  {i.name}
                </h3>
                <LabeledValue label="Use Case Access" className="flex-1">
                  Custom access
                </LabeledValue>
                {query.canSelect && (
                  <Link
                    to={routes.useCaseDetails.build({
                      id: String(i?.id),
                    })}
                    className="cursor-pointer">
                    <DisclosureIcon />
                  </Link>
                )}
                <div className="top-2 right-2 md:inset-y-1/2  md:transform md:rotate-90">
                  {!query.canSelect && (
                    <Popover>
                      {(Boolean(useCasePermissions?.capabilities.EDIT) || Boolean(useCasePermissions?.capabilities.VIEW)) && (
                        <PopOverItem>
                          <div
                            onClick={() =>
                              navigate(
                                routes.useCaseDetails.build({
                                  id: String(i?.id),
                                })
                              )
                            }>
                            Edit
                          </div>
                        </PopOverItem>
                      )}
                      {useCasePermissions?.capabilities.DELETE && (
                        <PopOverItem
                          onClick={() => {
                            setSelectedUseCase(i.id);
                          }}>
                          Delete
                        </PopOverItem>
                      )}
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        <div className="mt-10">
          <h3 className="font-bold text-base text-primary">Users access</h3>
          <p
            className="text-xs text-primary 
          mb-3 italic">
            This access is automatically assigned to users not a part of any group
          </p>
          {useCaseList &&
            useCaseList
              .filter((items) => items.default)
              .map((i) => {
                return (
                  <div
                    className="bg-white border-not-last-child 
            flex gap-4 items-center p-6 data-row"
                    key={i.id}>
                    <h3 className="flex-1 text-base font-bold">{i.name}</h3>
                    <LabeledValue label="Use Case Access" className="flex-1">
                      Default access
                    </LabeledValue>
                    {useCasePermissions?.capabilities.EDIT && (
                      <Link to={routes.useCaseDetails.build({ id: String(i?.id) })} className="text-gray-600">
                        <BsPencil className="" />
                      </Link>
                    )}
                  </div>
                );
              })}
        </div>
      </ContentFrame>
      {query?.useCaseId ? (
        <div className="py-4 px-5 lg:px-16 float-left bg-white w-full">
          <Button text="Save" onClick={handleRedirect} classes={['float-left']} />
          <Button text="Cancel" style="other" onClick={() => navigate(-1)} />
        </div>
      ) : (
        ''
      )}
      <ConfirmationBox
        modalState={selectedUseCase ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeleteUseCase}
        onConfirm={() => onConfirm(String(selectedUseCase))}
        onCancel={() => onCancel()}>
        Did you want to delete this use case?
      </ConfirmationBox>
    </>
  );
}
