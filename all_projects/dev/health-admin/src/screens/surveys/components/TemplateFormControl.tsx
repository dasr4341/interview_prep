import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

import Button from 'components/ui/button/Button';
import {
  DynamicInputText,
  DynamicMultipleSelection,
  FieldTypes,
  SurveyField,
  SurveyFormSchema,
} from 'interface/dynamic-field-data.interface';
import AddNewField from './google-form/add-new-field';
import InputRow from './google-form/input-row';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { createSurveyTemplateMutation } from 'graphql/createSurveyTemplate.mutation';
import {
  CreateSurveyTemplate,
  CreateSurveyTemplateVariables,
  GetSurveyTemplate,
  GetSurveyTemplateVariables,
  SurveyTemplateFieldCreateArgs,
  UpdateSurveyTemplate,
  UpdateSurveyTemplateVariables,
} from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { ErrorMessage, ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { config } from 'config';
import { updateSurveyTemplateMutation } from 'graphql/updateSurveyTemplate.mutatiom';
import { getSurveyTemplateQuery } from 'graphql/getSurveyTemplate.query';
import TemplateFormControlSkeletonLoading from '../skeletonLoading/TemplateFormControlSkeletonLoading';
import { multiselectValidation } from 'lib/helperFunction/multiselectValidation';
import SelectedFacilityList from 'components/SelectFacilityList/SelectedFacilityList';


export interface MultiSelectValidationErrorInterface {
  message: string | null;
  errorFields: number[];
}

export default function TemplateFormControl({ templateId }: { templateId?: string }) {
  const navigate = useNavigate();
  const [error, setError] = useState<null | string>(null);
  const [isFacilityRequired, setIsFacilityRequired] = useState<boolean>();
  const [multiSelectValidationError, setMultiSelectValidationError] =
    useState<null | MultiSelectValidationErrorInterface>(null);
  
  const formHelper = useForm<SurveyFormSchema>();

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    control,
    setValue,
    register,
    trigger
  } = formHelper;

  const { fields, append, remove } = useFieldArray<SurveyFormSchema, 'fields', 'id'>({
    name: 'fields',
    control,
  });

  function addNewField(type: FieldTypes, disabled: boolean) {
    if (disabled) {
      return;
    }
    const base = {
      label: '',
      placeholder: '',
      id: Date.now().toString(),
      inputType: type,
      validation: {},
    };

    if (type === 'text' || type === 'textarea' || type === 'date') {
      append(base as DynamicInputText);
    } else {
      append({
        ...base,
        options: [],
      } as DynamicMultipleSelection);
    }
  }

  const inputRows = useMemo(
    () =>
      fields.map((field, index) => (
        <InputRow
          key={field.id}
          field={field}
          index={index}
          remove={remove}
          setValidationErrorStatus={setMultiSelectValidationError}
        />
      )),
    [fields, remove]
  );

  // ----------------------------------------------------------------------------
  // to create new survey from
  // ***** CREATE TEMPLATE *********
  const [createTemplateCallBack, { loading: createTemplateLoading, error: createTemplateError, reset }] = useMutation<
    CreateSurveyTemplate,
    CreateSurveyTemplateVariables
  >(createSurveyTemplateMutation, {
    onCompleted: () => {
      toast.success(messagesData.successList.templateCreate);
      navigate(routes.customTemplate.match);
    },
    onError: (e: ApolloError) => console.log(getGraphError(e.graphQLErrors).join(',')),
  });

  // ----------------------------------------------------------------------------

  // ******** GETTING DATA : for particular templateID  ************
  const [getTemplateDataCallBack, { loading: getTemplateDataLoading, error: getTemplateError }] = useLazyQuery<
    GetSurveyTemplate,
    GetSurveyTemplateVariables
  >(getSurveyTemplateQuery, {
    onCompleted: (response) => {
      if (response.pretaaHealthGetTemplate) {
        const templateData = response.pretaaHealthGetTemplate;
        setValue('fields', templateData.surveyTemplateFields as SurveyField[]);

        setValue('id', templateData?.id as string);
        setValue('surveyName', templateData?.title as string);
        setValue('description', templateData?.description as string);
      }
    },
    onError: (e) => console.log(getGraphError(e.graphQLErrors).join(',')),
  });
  // ----------------------------------------------------------------------------

  // ******* UPDATING DATA *********
  const [updateTemplateCallBack, { loading: updateTemplateLoading, error: updateTemplateError }] = useMutation<
    UpdateSurveyTemplate,
    UpdateSurveyTemplateVariables
  >(updateSurveyTemplateMutation, {
    onCompleted: () => {
      toast.success(messagesData.successList.templateUpdate);
      if (templateId) {
        getTemplateDataCallBack({
          variables: { templateId },
        });
      }
    },
    onError: (e) => console.log(getGraphError(e.graphQLErrors).join(',')),
  });
  // ----------------------------------------------------------------------------
  
  const onSubmit = (data: SurveyFormSchema) => {

    try {
     
      let errorRes = false;
      let errorCount = 0;

      data.fields
        .filter((f) => f.inputType === 'range')
        .forEach((f: any) => {
          if (Number(f?.step) > Number(f?.rangeValue.split(',')[1])) {
            throw new Error(messagesData.errorList.stepLimit);          
          }
        });

      data.fields
        .filter((f) => f.inputType === 'dropdown' || f.inputType === 'radio' || f.inputType === 'checkbox')
        .forEach((f: any, index ) => {
          console.log('f?.options', f?.options);
          errorRes = multiselectValidation(f?.options, index );
          errorCount = errorRes ? (errorCount + 1) : errorCount;
      });

      data.fields = data.fields.map(el => {
        delete el.parentQuestionName;
        delete el.questionName;
        return el;
      });

      if (errorCount > 0) {
        setMultiSelectValidationError(( prevState: any ) => {
          return ({
            ...prevState,
            message: messagesData.errorList.resolveErrorsToContinue
          });
        });
        
        return false;
      } else {
        setMultiSelectValidationError(( prevState: any ) => {
          return ({
            ...prevState,
            message: null
          });
        });
      }

      if (templateId) {
        updateTemplateCallBack({
          variables: {
            templateId,
            title: data.surveyName,
            name: data.surveyName,
            description: data.description,
            surveyTemplateFields: data.fields as SurveyTemplateFieldCreateArgs[],
          },
        });
      } else {
        createTemplateCallBack({
          variables: {
            title: data.surveyName,
            name: data.surveyName,
            description: data.description,
            surveyTemplateFields: data.fields as SurveyTemplateFieldCreateArgs[],
            facilityId: data.facilityId
          },
        });
      }
    } catch (e: any) {
     
      setError(e.message);
    }
  };

  useEffect(() => {
    if (templateId) {
      getTemplateDataCallBack({
        variables: { templateId },
      });
    }
    // 
  }, [templateId]);



  return (
    <React.Fragment>
      {templateId && getTemplateDataLoading && <TemplateFormControlSkeletonLoading />}
      {fields && !getTemplateDataLoading && (
        <FormProvider {...formHelper}>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
            onChange={() => {
              if (createTemplateError) {
                reset();
              }
            }}>
              {!templateId && (
                  <div className='mb-6 max-w-600'>
                  <Controller
                    name="facilityId"
                    control={control}
                    rules={{
                      required: isFacilityRequired,
                    }}
                    render={({ field: { onChange } }) => (
                      <SelectedFacilityList onInt={setIsFacilityRequired} onChange={(e) => {
                      onChange(e);
                      setValue('facilityId', e);
                      trigger('facilityId')
                      }} />
                    )}
                  />
                  {errors.facilityId && <ErrorMessage message={messagesData.errorList.required} />}
                </div>
              )}
           
            <div className="flex flex-col mb-4">
              <div className="flex space-y-2 flex-col w-full">
                <input
                  type="text"
                  {...register('surveyName', {
                    maxLength: {
                      value: config.form.inputFieldMaxLength,
                      message: messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength),
                    },
                    required: { value: true, message: messagesData.errorList.required },
                    validate: (v) => !!v.trim().length || messagesData.errorList.required,
                  })}
                  placeholder="Enter assessment form name"
                  className="bg-gray-50 flex-1 border-0 border-b"
                />
                {errors.surveyName?.message && <ErrorMessage message={errors.surveyName.message} />}
                <textarea
                  {...register('description', {
                    maxLength: {
                      value: config.form.descriptionMaxLength,
                      message: messagesData.errorList.errorMaxLength(config.form.descriptionMaxLength),
                    },
                    required: { value: true, message: messagesData.errorList.required },
                    validate: (v) => !!v?.trim().length || messagesData.errorList.required,
                  })}
                  placeholder="Enter descriptions"
                  className="bg-gray-50 w-full  border-0 border-b"></textarea>
                {errors.description?.message && <ErrorMessage message={errors.description.message} />}
              </div>
            </div>
            <div className="flex-1">{inputRows}</div>

            <div className="flex justify-between sticky bottom-0 bg-gray-50 py-4">
              <AddNewField
                updateFieldType={addNewField}
                disabled={updateTemplateLoading || createTemplateLoading}
                order="order-2"
              />
              {fields.length > 0 && (
                <div className="flex space-x-4 order-1">
                  <Button
                    loading={createTemplateLoading || updateTemplateLoading}
                    disabled={createTemplateLoading || updateTemplateLoading}
                    type="submit">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                  {!!multiSelectValidationError?.message && (
                    <ErrorMessage message={multiSelectValidationError?.message || ''} />
                  )}
                  {isValid && error && <ErrorMessage message={error} />}
                  {isValid && createTemplateError && (
                    <ErrorMessage message={getGraphError(createTemplateError.graphQLErrors).join(',')} />
                  )}
                  {isValid && updateTemplateError && (
                    <ErrorMessage message={getGraphError(updateTemplateError.graphQLErrors).join(',')} />
                  )}
                  {isValid && getTemplateError && (
                    <ErrorMessageFixed message={getGraphError(getTemplateError.graphQLErrors).join(',')} />
                  )}
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      )}
    </React.Fragment>
  );
}
