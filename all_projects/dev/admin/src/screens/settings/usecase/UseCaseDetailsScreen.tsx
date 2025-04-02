/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from '@apollo/client';
import Button from 'components/ui/button/Button';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { SearchField } from 'components/SearchField';
import {
  GetUseCaseDetails,
  UpdateUseCaseCollectionVariables,
  GetUseCaseDetails_pretaaGetUseCaseCollections_useCasesOnCollections,
  UpdateUseCaseCollection,
  CreateUseCaseCollection,
  CreateUseCaseCollectionVariables,
  SortOrder,
  UserPermissionNames,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
// eslint-disable-next-line max-len
import { UpdateUseCaseCollectionMutation } from 'lib/mutation/usecase/update-usecase-collection';
import { GetUseCaseDetailsQuery } from 'lib/query/usecase/get-usecase-details';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import _ from 'lodash';
import queryString from 'query-string';
import ListIcon from 'components/icons/ListIcon';
import SublistIcon from 'components/icons/SublistIcon';
import Popover from 'components/Popover';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import usePermission from 'lib/use-permission';
import { CreateUseCaseCollectionMutation } from '../../../lib/mutation/usecase/create-usecase-collection';
import { routes } from '../../../routes';
import { successList, errorList } from '../../../lib/message.json';
import EmptyFilter from 'components/EmptyFilter';
import { TrackingApi } from 'components/Analytics';

export default function UseCaseDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryP = queryString.parse(location?.search);
  const useCasePermissions = usePermission(UserPermissionNames.USE_CASE_COLLECTIONS);

  const [confirmChange, setConfirmChange] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCollections, setSelectedCollections] = useState<GetUseCaseDetails_pretaaGetUseCaseCollections_useCasesOnCollections[]>([]);
  const [useCaseCollections, setUseCaseCollections] = useState<GetUseCaseDetails_pretaaGetUseCaseCollections_useCasesOnCollections[]>([]);

  // Hooks for update use case collection
  const [updateUseCaseCollection, { loading: updateUseCaseLoading }] = useMutation<UpdateUseCaseCollection>(UpdateUseCaseCollectionMutation);

  const [createUseCaseCollection] = useMutation<CreateUseCaseCollection, CreateUseCaseCollectionVariables>(CreateUseCaseCollectionMutation);

  // Hooks for getting one existing use case details
  const { data: usecase, loading } = useQuery<GetUseCaseDetails>(GetUseCaseDetailsQuery, {
    variables: {
      where: {
        id: {
          equals: queryP?.id,
        },
      },
      orderBy: [
        {
          name: SortOrder.asc,
        },
      ],
    },
  });

  useEffect(() => {
    if (usecase?.pretaaGetUseCaseCollections) {
      setUseCaseCollections(_.sortBy(usecase?.pretaaGetUseCaseCollections[0]?.useCasesOnCollections, ['useCase.displayName']));
      setSelectedCollections(_.sortBy(usecase?.pretaaGetUseCaseCollections[0]?.useCasesOnCollections, ['useCase.displayName']));
    }
  }, [usecase]);

  const handleSearchFilter = (value: string) => {
    setSearchText(value);
    if (value?.trim()?.length === 0 && usecase?.pretaaGetUseCaseCollections) {
      const data = _.cloneDeep(useCaseCollections);
      setSelectedCollections(data);
    } else {
      setSelectedCollections(useCaseCollections.filter((item) => item.useCase?.displayName?.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const isValidUseCaseUpdate = (useCaseColl: GetUseCaseDetails_pretaaGetUseCaseCollections_useCasesOnCollections[]): boolean => useCaseColl.some((useCase) => useCase.status);

  const updateUseCase = async () => {
    try {
      const isValid = isValidUseCaseUpdate(useCaseCollections);
      if (!isValid) {
        throw new Error(errorList.setting);
      }

      let collectionObj = useCaseCollections?.map((u) => {
        return {
          status: u.status,
          useCase: {
            connect: {
              id: u.useCaseId,
            },
          },
        };
      });

      collectionObj = _.sortBy(collectionObj, 'u.useCase.connect.id');

      const updateVariables: UpdateUseCaseCollectionVariables = {
        name: usecase?.pretaaGetUseCaseCollections[0].name as string,
        id: String(queryP?.id),
        useCasesOnCollectionsUpdate: {
          create: collectionObj,
          deleteMany: {} as any,
        },
      };
      const { data } = await updateUseCaseCollection({
        variables: updateVariables,
      });
      if (data) {
        toast.success(successList.useCaseUpdate);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  function updateUseCaseData() {
    setSearchText('');
    setConfirmChange(false);
    updateUseCase();
  }

  // Sending creating request
  async function onSubmit() {
    if (usecase?.pretaaGetUseCaseCollections[0]?.default && !queryP?.name) {
      setConfirmChange(true);
      return;
    }
    updateUseCase();
  }

  function toggleField(index: number, status: boolean, id: string) {
    const data = _.cloneDeep(useCaseCollections);
    data?.forEach((x) => {
      if (x.id === id) {
        x.status = !status;
      }
      return x;
    });
    setUseCaseCollections(data);
    const data1 = _.cloneDeep(selectedCollections);
    data1[index].status = !status;
    setSelectedCollections(data1);
  }

  const createCopyOfUseCase = async () => {
    let collectionObj = useCaseCollections?.map((u) => {
      return {
        status: u.status,
        useCase: {
          connect: {
            id: u.useCaseId,
          },
        },
      };
    });

    collectionObj = _.sortBy(collectionObj, 'useCase.connect.id');

    await createUseCaseCollection({
      variables: {
        name: `copy of ${usecase?.pretaaGetUseCaseCollections[0].name}`,
        useCasesOnCollections: {
          create: collectionObj,
        },
      },
    });
    toast.success(successList.useCaseCopyCreate);
    navigate(routes.useCaseList.match);
  };

  const [showList, setShowList] = useState(false);
  const show = () => setShowList(true);
  const hide = () => setShowList(false);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.useCaseDetails.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader title={queryP?.name ? (queryP?.name as string) : usecase?.pretaaGetUseCaseCollections[0].name}>
        <div className="flex items-center">
          <SearchField defaultValue={searchText} label="Filter..." onSearch={handleSearchFilter} />
          <div className="flex flex-1 items-center justify-end space-x-3">
            <button
              onClick={hide}
              className={`h-8 w-8 rounded-lg 
            transition duration-300 ${showList ? 'bg-gray-300' : 'bg-primary-light'}`}>
              <ListIcon
                className={`block mx-auto transition 
              duration-300 ${showList ? 'text-primary' : 'text-white'}`}
              />
            </button>
            <button
              onClick={show}
              className={`h-8 w-8 bg-gray-300 rounded-lg 
            transition duration-300 ${showList ? 'bg-primary-light' : 'bg-gray-300'}`}>
              <SublistIcon
                className={`block mx-auto transition 
              duration-300 ${showList ? 'text-white' : 'text-primary'}`}
              />
            </button>
          </div>
        </div>
      </ContentHeader>
      <ContentFrame className="bg-white flex flex-col flex-1 overflow-auto">
        <ul>
          {selectedCollections.map((item, index) => {
            return (
              <li key={item.id}>
                <div className="flex items-center border-b border-gray-500">
                  <div className="px-6 lg:px-9 py-3 flex-1">
                    <label htmlFor={`id-${index}`}>
                      <input
                        type="checkbox"
                        id={`id-${index}`}
                        className={`appearance-none h-5 w-5 border mr-4
                    border-primary-light
                    checked:bg-primary- light checked:border-transparent
                    rounded-md form-tick`}
                        checked={item.status}
                        onChange={() => toggleField(index, item.status, item?.id)}
                      />
                      {item?.useCase?.displayName}
                    </label>
                  </div>
                  <div>
                    {item.useCase.useCasesDataObjects.length > 0 && (
                      <Popover trigger={<BsFillExclamationCircleFill className="mr-2 cursor-pointer text-base text-red-800" />}>
                        <p className="uppercase px-2 py-4">This use case is impacted by data object access</p>
                      </Popover>
                    )}
                  </div>
                </div>
                {showList && item.useCase.useCasesDataObjects.length > 0 && (
                  <ul>
                    {item.useCase.useCasesDataObjects.map((dataObject) => (
                      <li className="border-b border-gray-500 uppercase pl-24 py-3 text-gray-600 bg-gray-50" key={dataObject.dataObject.displayName}>
                        {dataObject.dataObject.displayName}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {!loading && !selectedCollections?.length && <EmptyFilter />}
      </ContentFrame>
      {selectedCollections?.length > 0 && (
        <div
          className="grid grid-cols-1 space-y-3 bg-white px-5
        sm:px-15 lg:px-16 py-4">
          <div
            className="grid grid-cols-1
             space-y-3 sm:space-y-0">
            <div className="flex justify-between">
              <div className="flex">
                {useCasePermissions?.capabilities.EDIT && <Button text="Save" style="primary" onClick={onSubmit} loading={updateUseCaseLoading} disabled={updateUseCaseLoading} />}
                <Button type="button" text="Cancel" style="other" onClick={() => navigate(-1)} />
              </div>
              <div>
                {(queryP?.name === 'Default_' || usecase?.pretaaGetUseCaseCollections[0].name === 'Default_') && (
                  <Button text="Save As" style="outline" onClick={createCopyOfUseCase} />
                )}
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <ConfirmationDialog
                modalState={confirmChange}
                onConfirm={() => updateUseCaseData()}
                onCancel={() => setConfirmChange(false)}
                className="max-w-md rounded-xl"
                buttonRowAlign="justify-start"
                confirmBtnText="Continue">
                <h3 className="h2 text-left text-primary font-bold">Are you sure?</h3>
                <p className="text-left">You are about to overwrite the default settings. This will change the access to any user with these use case settings.</p>
              </ConfirmationDialog>
            </div>
          </div>
          <p className="italic text-xs text-gray-150">ALL CHANGES MUST BE ACTUALLY SAVED BY CLICKING A SAVE BUTTON. CHANGES WILL NOT BE AUTOMATICALLY CHANGED</p>
        </div>
      )}
    </div>
  );
}
