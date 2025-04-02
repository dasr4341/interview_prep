import { ContentFrame } from 'components/content-frame/ContentFrame';
import DataObjectRow from './components/DataObjectRow';
import 'scss/components/_data-object-list.scss';
import { LabeledValue } from 'components/LabeledValue';
import { BsPencil } from 'react-icons/bs';
import { useMutation, useQuery } from '@apollo/client';
import { ListDataObject } from 'lib/query/dataObjects/list-data-object';
import {
  DeleteDataObjectsCollection,
  DeleteDataObjectsCollectionVariables,
  ListDataObjectCollections,
  ListDataObjectCollectionsVariables,
  ListDataObjectCollections_pretaaListDataObjectCollections,
  SortOrder,
  UserPermissionNames,
} from 'generatedTypes';
import { routes } from 'routes';
import { Link, useNavigate } from 'react-router-dom';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { userManagementActions } from 'lib/store/slice/user-management';
import ConfirmationBox from 'components/ConfirmationDialog';
import { DeleteDataObjectsMutation } from 'lib/mutation/data-object/delete-object';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import usePermission from 'lib/use-permission';
import useQueryParams from '../../lib/use-queryparams';
import { successList } from '../../lib/message.json';
import { TrackingApi } from 'components/Analytics';

export default function DataObjectsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = useQueryParams();
  const { data } = useQuery<ListDataObjectCollections, ListDataObjectCollectionsVariables>(ListDataObject, {
    variables: {
      where: null,
      orderBy: [
        {
          name: SortOrder.asc,
        },
      ],
    },
  });
  const [selectedObject, setSelectedObject] = useState<string | null>(String(query?.dataObjectId) || null);
  const [selectedDataObject, setSelectedDataObject] = useState<string | null>(null);
  const rolePermission = usePermission(UserPermissionNames.DATA_OBJECT_COLLECTIONS);
  const [dataObjectList, setDataObjectList] = useState<ListDataObjectCollections_pretaaListDataObjectCollections[]>([]);
  const [deleteDataObjectAction, { loading: loadingDeleteDataObject }] = useMutation<DeleteDataObjectsCollection, DeleteDataObjectsCollectionVariables>(DeleteDataObjectsMutation, {
    onCompleted: (response) => {
      toast.success(successList.objectDelete);
      setDataObjectList(dataObjectList.filter((c) => c.id !== response.pretaaDeleteDataObjectsCollection?.id));
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    if (data) {
      setDataObjectList(data.pretaaListDataObjectCollections.filter((item) => item.default == false));
    }
  }, [data]);

  const handleDataObjectSelection = (e: any, id: string) => {
    setSelectedObject(id);
  };

  function handleRedirect() {
    dispatch(userManagementActions.addDataObjectId(String(selectedObject)));
    if (query.groupId) {
      navigate(routes.userGroupAction.build(query));
    } else {
      navigate(routes.createUserGroup.match);
    }
  }

  function handleDelete(id: string) {
    setSelectedDataObject(id);
  }

  function onConfirm(id: string) {
    deleteDataObjectAction({
      variables: {
        id,
      },
    });
    setSelectedDataObject(null);
  }

  function onCancel() {
    setSelectedDataObject(null);
  }

  const handleVisible = () => {
    return !!query.canSelect;
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dataObjects.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Data Object Access" className="xl:relative" breadcrumb={handleVisible()} disableGoBack={!handleVisible()}>
        {rolePermission?.capabilities?.CREATE && (
          <Button type="button" style="primary" classes="xl:absolute xl:right-10 xl:bottom-10">
            <Link data-testid="create-data-object-button" to={routes.dataObjectCreate.match}>
              Create new collection
            </Link>
          </Button>
        )}
      </ContentHeader>

      <ContentFrame classes={['flex-1']}>
        {data &&
          dataObjectList.map((i) => {
            return (
              <DataObjectRow
                objectTitle={i.name}
                key={i.id}
                id={i.id}
                selectedObject={String(selectedObject)}
                routes={routes.dataObjectsDetails.build({
                  id: i.id,
                })}
                onDelete={() => handleDelete(String(i.id))}
                onObjectSelection={handleDataObjectSelection}
              />
            );
          })}

        <div className="mt-10">
          <h3 className="font-bold text-base text-primary">Users access</h3>
          <p
            className="text-xs text-primary 
          mb-3 italic">
            This access is automatically assigned to users not a part of any group
          </p>
          {data &&
            data.pretaaListDataObjectCollections
              .filter((items) => items.default)
              .map((i) => {
                return (
                  <div
                    className="bg-white border-not-last-child 
            flex gap-4 items-center p-6 data-row" data-test-id="default-access-data-row"
                    key={i.id}>
                    <h3 className="flex-1 text-base font-bold">{i.name}</h3>
                    <LabeledValue label="Data Object Access" className="flex-1">
                      Default access
                    </LabeledValue>
                    {rolePermission?.capabilities?.EDIT && (
                      <Link to={routes.dataObjectsDetails.build({ id: i.id })} className="text-gray-600">
                        <BsPencil className="" />
                      </Link>
                    )}
                  </div>
                );
              })}
        </div>
      </ContentFrame>
      {query?.dataObjectId ? (
        <div className="w-full float-left bg-white py-5 px-6 lg:px-16">
          <Button text="Save" onClick={handleRedirect} classes={['float-left']} />
          <Button text="Cancel" style="other" onClick={() => navigate(-1)} />
        </div>
      ) : (
        ''
      )}
      <ConfirmationBox
        modalState={selectedDataObject ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeleteDataObject}
        onConfirm={() => onConfirm(String(selectedDataObject))}
        onCancel={() => onCancel()}>
        Did you want to delete this data object?
      </ConfirmationBox>
    </>
  );
}
