import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateUseCaseCollection, CreateUseCaseCollectionVariables, GetUseCaseSchema } from 'generatedTypes';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import SpaceOnly from 'lib/form-validation/space-only';
import { useMutation, useQuery } from '@apollo/client';
import { CreateUseCaseCollectionMutation } from 'lib/mutation/usecase/create-usecase-collection';
import { GetUseCaseSchemaQuery } from 'lib/query/usecase/get-use-case.query';
import { toast } from 'react-toastify';
import { errorList, successList } from '../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

export default function UseCaseFormScreen() {
  const navigate = useNavigate();
  const [createUseCaseCollection, { loading: createUseCaseLoading }] = useMutation<CreateUseCaseCollection, CreateUseCaseCollectionVariables>(CreateUseCaseCollectionMutation);
  const { data: useCaseSchema } = useQuery<GetUseCaseSchema>(GetUseCaseSchemaQuery);

  const caseFormSchema = yup.object().shape({
    name: yup.string().transform(SpaceOnly).typeError(errorList.useCaseCreate).required(errorList.required),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(caseFormSchema) as unknown as any,
  });

  const onSubmit = async (data: CreateUseCaseCollectionVariables) => {
    try {
      const collectionObj = useCaseSchema?.pretaaGetUseCases?.map((x) => {
        return {
          status: true,
          useCase: {
            connect: {
              id: x.id,
            },
          },
        };
      });
  
      const result = await createUseCaseCollection({
        variables: {
          name: data.name,
          useCasesOnCollections: {
            create: collectionObj,
          },
        },
      });

      if (result) {
        toast.success(successList.useCaseCreate);
      }
      navigate(
        routes.useCaseDetails.build({
          id: String(result.data?.pretaaCreateUseCaseCollection?.id),
          name: data.name,
        })
      );
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.useCaseCreate.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Use case create" />
      <ContentFrame classes={['pb-0']} type="with-footer">
        <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div
            className="flex-1 p-5 sm:px-15 sm:py-10
          lg:px-16 lg:py-8">
            <div className="w-full md:w-96">
              <label htmlFor="name" className="h2 block" data-test-id="use-case-name">
                Use case name
              </label>
              <input type="text" className="input w-full mb-2" {...register('name')} data-test-id="use-case-name-field" />
              <ErrorMessage message={errors.name?.message as string} />
            </div>
          </div>
          <div className="flex bg-white p-5 sm:px-15 lg:px-16">
            <Button text="Submit" loading={createUseCaseLoading} disabled={createUseCaseLoading} />
            <Button text="Cancel" style="other" type="button" onClick={() => navigate(-1)} />
          </div>
        </form>
      </ContentFrame>
    </>
  );
}
