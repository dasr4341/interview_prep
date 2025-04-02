/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { routes } from 'routes';
import { useNavigate } from 'react-router-dom';
import SpaceOnly from 'lib/form-validation/space-only';
import usePermission from '../../lib/use-permission';
import { CreateDataObject, CreateDataObjectVariables, GetDataObjects, GetDataObjects_pretaaGetDataObjects, UserPermissionNames } from 'generatedTypes';
import { errorList } from '../../lib/message.json';
import { getDataObjectsQuery } from 'lib/query/data-object/get-create-object';
import { useLazyQuery, useMutation } from '@apollo/client';
import { createDataObject } from 'lib/mutation/data-object/create-data';
import { toast } from 'react-toastify';
import { successList } from '../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

export default function DataObjectForm() {
  const rolePermission = usePermission(UserPermissionNames.DATA_OBJECT_COLLECTIONS);
  const navigate = useNavigate();
  const [getCreateDataObject, { data: dataObject }] = useLazyQuery<GetDataObjects>(getDataObjectsQuery);
  const [createData, { loading: createDataLoading }] = useMutation<CreateDataObject, CreateDataObjectVariables>(createDataObject);

  const objectFormSchema = yup.object().shape({
    name: yup.string().transform(SpaceOnly).typeError(errorList.text).required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(objectFormSchema) as unknown as any,
  });

  useEffect(() => {
    getCreateDataObject();
  }, []);

  function extractRows(rows: GetDataObjects_pretaaGetDataObjects[]) {
    const rowsData: any = [];

    rows.forEach((collection) => {
      rowsData.push({
        status: true,
        dataObject: {
          connect: {
            id: collection.id,
          },
        },
      });
    });
    return rowsData;
  }

  const onSubmit = async (formData: any) => {
    try {
      const createVariables = {
        name: formData.name,
        collectionObject: {
          create: extractRows(dataObject?.pretaaGetDataObjects || []),
        },
      };
      const response = await createData({
        variables: createVariables,
      });
      navigate(
        routes.dataObjectsDetails.build({
          id: String(response.data?.pretaaCreateDataObjectCollection?.id),
        })
      );
      toast.success(successList.objectCreate);
    } catch (e: any) {
      toast.error(e.message);
    }
    
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.dataObjectCreate.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Data Object create" />
      <ContentFrame classes={['pb-0']} type="with-footer">
        <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div
            className="flex-1 p-5 sm:px-15 sm:py-10
          lg:px-16 lg:py-8">
            <div className="w-full md:w-96">
              <label htmlFor="name" className="h2 block">
                Data object name
              </label>
              <input type="text" className="input w-full" {...register('name')} />
              <ErrorMessage message={errors.name?.message as string} />
            </div>
          </div>
          {rolePermission?.capabilities?.CREATE && (
            <div className="flex bg-white p-5 sm:px-15 lg:px-16">
              <Button text="Save" loading={createDataLoading} disabled={createDataLoading} />
              <Button text="Cancel" style="other" type="button" onClick={() => navigate(-1)} />
            </div>
          )}
        </form>
      </ContentFrame>
    </>
  );
}
