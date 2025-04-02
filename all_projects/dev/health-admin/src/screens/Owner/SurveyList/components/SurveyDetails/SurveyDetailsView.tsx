import React, { useEffect, useState } from 'react';

import Button from 'components/ui/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { getStandardTemplateQuery } from 'graphql/getStandardTemplate.quey';
import { GetStandardTemplate, GetStandardTemplateVariables } from 'health-generatedTypes';
import { ErrorMessage, ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import { getGraphError } from 'lib/catch-error';
import SurveyDetailsViewSkeletonLoading from '../../skeletonLoading/SurveyDetailsViewSkeletonLoading';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SpaceOnly from 'lib/form-validation/space-only';
import messages, { messagesData } from 'lib/messages';
import CustomInputEditField from './CustomInputEditField';
import queryString from 'query-string';
import { routes } from 'routes';
import useQueryParams from 'lib/use-queryparams';
import { config } from 'config';
import { format } from 'date-fns';

export interface SurveyDetailsViewFromInterface {
  name: string;
  title: string;
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

const editFormSchema = yup.object().shape({
  name: yup
  .string()
  .required(messages.errorList.required)
  .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
  .transform(SpaceOnly)
  .typeError(messages.errorList.required),  
  title: yup
  .string()
  .required(messages.errorList.required)
  .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
  .transform(SpaceOnly)
  .typeError(messages.errorList.required),
  description: yup
  .string()
  .required(messages.errorList.required)
  .max(config.form.textAreaMaxLength, messagesData.errorList.errorMaxLength(config.form.textAreaMaxLength))
  .transform(SpaceOnly)
  .typeError(messages.errorList.required),
  code: yup
  .string()
  .required(messages.errorList.required)
  .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
  .transform(SpaceOnly)
  .typeError(messages.errorList.required),
});

export default function SurveyDetailsView() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [editedFormDataFromUrl, setEditedFormDataFromUrl] = useState<SurveyDetailsViewFromInterface | null>(null);
  const getDateFormat = (data: string | null) => (data ? format(new Date(data), config.dateFormat) : 'N/A');
  const query = useQueryParams();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SurveyDetailsViewFromInterface>({
    mode: 'onChange',
    resolver: yupResolver(editFormSchema),
  });
  
  watch('createdAt');
  watch('updatedAt');

  // GETTING DATA
  const [
    getStandardTemplateCallBack,
    { loading: getStandardTemplateLoading, error: getStandardTemplateError, data: standardTemplateData },
  ] = useLazyQuery<GetStandardTemplate, GetStandardTemplateVariables>(getStandardTemplateQuery, {
    onCompleted: (d) => {
      if (d?.pretaaHealthAdminGetTemplate) {
        const templateData = d.pretaaHealthAdminGetTemplate;
        setValue('code', String(templateData.code || 'N/A'));
        setValue('name', String(templateData.name || 'N/A'));
        setValue('description', String(templateData.description || 'N/A'));
        setValue('title', String(templateData.title || 'N/A'));


        setValue('createdAt', templateData.createdAt);
        setValue('updatedAt', templateData.updatedAt);
      }
    },
  });

  function onSubmit(editedFormData: SurveyDetailsViewFromInterface) {
    navigate(
      `${routes.owner.surveyDetails.jsonView.build(String(templateId))}?${queryString.stringify({
        editedFormData: JSON.stringify(editedFormData),
      })}`
    );
  }


  useEffect(() => {
    if (query?.editedFormData) {
      const editedFormDataFromUrlData: SurveyDetailsViewFromInterface = JSON.parse(query.editedFormData);
      setEditedFormDataFromUrl(editedFormDataFromUrlData);
      setValue('code', String(editedFormDataFromUrlData.code));
      setValue('name', String(editedFormDataFromUrlData.name));
      setValue('description', String(editedFormDataFromUrlData.description));
      setValue('title', String(editedFormDataFromUrlData.title));
      setValue('createdAt', String(editedFormDataFromUrlData.createdAt));
      setValue('updatedAt', String(editedFormDataFromUrlData.updatedAt));
    } else {
      getStandardTemplateCallBack({
        variables: {
          templateId: String(templateId),
        },
      });
    }
    // 
  }, [useParams, location.search]);

  return (
    <div>
      {getStandardTemplateLoading && <SurveyDetailsViewSkeletonLoading />}
      {!getStandardTemplateLoading && (!!standardTemplateData || !!editedFormDataFromUrl  ) && (
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-8  grid md:grid-cols-1 flex-1 grid-cols-1 gap-2 md:text-left gap-y-8">


            <div className="grid md:grid-cols-2 grid-cols-1 gap-y-4 md:gap-x-6">
              <div className="flex flex-col">
                <div className="font-normal text-xsm text-pt-gray-600 pb-3">Name:</div>
                <CustomInputEditField
                  className="text-xsm font-normal text-gray-750 "
                  register={register('name')}
                  autoFocus={true}
                />
                {errors.name?.message && <ErrorMessage message={errors.name.message} />}
              </div>

              <div className="flex flex-col">
                <div className="font-normal text-xsm text-pt-gray-600 pb-3">Description:</div>
                <CustomInputEditField
                  className="text-xsm font-normal text-gray-750 "
                  register={register('description')}
                />
                {errors.description?.message && <ErrorMessage message={errors.description.message} />}
              </div>

              <div className="flex flex-col">
                <div className="font-normal text-xsm text-pt-gray-600 pb-3">Code:</div>
                <CustomInputEditField
                  className="text-xsm font-normal text-gray-750 "
                  register={register('code')}
                />
                {errors.code?.message && <ErrorMessage message={errors.code.message} />}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="font-normal text-xsm text-pt-gray-600 pb-3">Title:</div>
              <CustomInputEditField
                className="text-xsm font-normal text-gray-750 "
                register={register('title')}
              />
              {errors.title?.message && <ErrorMessage message={errors.title.message} />}
            </div>

            <div className="flex flex-col space-y-8">
              <div className="flex flex-col">
                <div className="font-normal text-xsm text-pt-gray-600 pb-3">Created on:</div>
                <div className=" text-xsm font-normal text-gray-750 ">
                  <div className='flex'>
                    {getValues('createdAt') && (getDateFormat(getValues('createdAt')))}
                    
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-normal text-xsm text-pt-gray-600 pb-3">Updated on:</div>
                <div className=" text-xsm font-normal text-gray-750 ">
                  <div className='flex'>
                    {getValues('updatedAt') && (getDateFormat(getValues('updatedAt')))}
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button text={'Continue'} />
            </div>
          </form>
        </React.Fragment>
      )}
      {getStandardTemplateError && <ErrorMessageFixed message={getGraphError(getStandardTemplateError?.graphQLErrors).join(',')} />}
    </div>
  );
}
