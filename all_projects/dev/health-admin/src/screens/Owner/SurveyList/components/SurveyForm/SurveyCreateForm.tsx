import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ContentHeader } from 'components/ContentHeader';
import TextInputFields from 'components/TextInputFields';
import Button from 'components/ui/button/Button';
import './_survey-form.scoped.scss';
import SpaceOnly from 'lib/form-validation/space-only';
import messages, { messagesData } from 'lib/messages';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import TextArea from 'components/TextArea';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import TransformJsonData from 'Helper/TransformJsonData';
import { useMutation } from '@apollo/client';
import { createStandardTemplateMutation } from 'graphql/createStandardTemplate.mutation';
import {
  CreateStandardTemplate,
  CreateStandardTemplateVariables,
  SurveyTemplateFieldCreateAdminArgs,
} from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { routes } from 'routes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import { CreateTemplateJsonValidation } from '../../ValidationSchema/CreateTemplateJsonValidationSchema';
import { config } from 'config';
import { useFullscreen } from '@mantine/hooks';
import { BiExpand } from 'react-icons/bi';
import { FiMinimize } from 'react-icons/fi';
import { Skeleton } from '@mantine/core';


interface SurveyCreateFormInterface {
  title: string;
  description: string;
  json: string;
  code: string;
  surveyName: string;
}

const surveyFormSchema = yup.object().shape({
  surveyName: yup
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
  json: yup.string().transform(SpaceOnly).typeError(messages.errorList.required).required(messages.errorList.required),
  code: yup
    .string()
    .required(messages.errorList.required)
    .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength))
    .transform(SpaceOnly)
    .typeError(messages.errorList.required),
});

export default function SurveyCreateForm() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const monaco = useMonaco();
  const jsonEditorErrorRef = useRef(null);
  const { ref: editorWrapper, toggle, fullscreen } = useFullscreen();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SurveyCreateFormInterface>({
    resolver: yupResolver(surveyFormSchema),
  });

  const [
    createStandardTemplateCallBack,
    { loading: createStandardTemplateLoading, error: createStandardTemplateError },
  ] = useMutation<CreateStandardTemplate, CreateStandardTemplateVariables>(createStandardTemplateMutation);

  const onSubmit = (formData: SurveyCreateFormInterface) => {
    const editorErrors = monaco?.editor?.getModelMarkers({});

    try {
      if (!!editorErrors?.length) {
        throw new Error(`Please resolve the errors to continue - ${editorErrors?.length} errors found !`);
      }
      const jsonData = JSON.parse(formData.json);
      const formattedJson = TransformJsonData(jsonData.pages);

      createStandardTemplateCallBack({
        variables: {
          fields: formattedJson as SurveyTemplateFieldCreateAdminArgs[],
          title: formData.title,
          description: formData.description,
          code: formData.code,
          name: formData.surveyName,
        },
        onCompleted: () => {
          toast.success(messagesData.successList.templateCreate);
          navigate(routes.owner.surveyList.match);
        },
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: '',
            fileMatch: ['*'], // associate with our model
            schema: CreateTemplateJsonValidation,
          },
        ],
      });
    }
  }, [monaco]);

  // -------------------- scroll to the JSON editor ---------------
  const scrollToJsonEditor = () =>
    jsonEditorErrorRef && (jsonEditorErrorRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  if (errors?.json?.message && Object.values(errors).length === 1) {
    scrollToJsonEditor();
  }

  return (
    <div>
      <ContentHeader title="New standard template" className="lg:py-4 relative" />
      <div className="overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} onChange={() => setError(null)}>
          <div className="px-6 lg:px-16 pt-5 md:pt-8 pb-36">

            <div className="text-area-width">
              <label className="block text-xsm font-normal text-gray-750 mb-2">Template name</label>
              <TextInputFields type="text" placeholder="Template name" register={register('surveyName')} />
              {errors.surveyName?.message && <ErrorMessage message={errors.surveyName?.message} />}
            </div>

            <div className="text-area-width  pt-6">
              <label className="block text-xsm font-normal text-gray-750 mb-2">Description</label>
              <TextArea placeholder="Template description" className="h-28 " register={register('description')} />
              {errors.description?.message && <ErrorMessage message={errors.description?.message} />}
            </div>

            <div className="text-area-width  pt-6">
              <label className="block text-xsm font-normal text-gray-750 mb-2">Template Code</label>
              <TextInputFields type="text" placeholder="Enter template code" register={register('code')} />
              {errors.code?.message && <ErrorMessage message={errors.code?.message} />}
            </div>

            <div className="text-area-width  pt-6">
              <label className="block text-xsm font-normal text-gray-750 mb-2">Title</label>
              <TextInputFields placeholder="Title" register={register('title')} />
              {errors.title?.message && <ErrorMessage message={errors.title?.message} />}
            </div>

            <div className="text-area-width  pt-6">
              <label className="block text-xsm font-normal text-gray-750 mb-2">JSON</label>
              {monaco && (
                <Controller
                  control={control}
                  name="json"
                  render={({ field: { onChange } }) => (
                    <div className="editor-wrapper relative" ref={editorWrapper}>
                      <Editor
                        theme="vs-dark"
                        height={fullscreen ? '100vh' : '40vh'}
                        onChange={onChange}
                        defaultLanguage="json"
                      />
                      {!fullscreen && (
                        <button type='button' className="absolute right-5 top-5 z-50 text-white" onClick={toggle}>
                          <BiExpand style={{ width: '30px', height: '30px' }} />
                        </button>
                      )}
                      {fullscreen && (
                        <button  type='button' className="absolute right-5 top-5 z-50 text-white" onClick={toggle}>
                          <FiMinimize style={{ width: '30px', height: '30px' }} />
                        </button>
                      )}
                    </div>
                  )}
                />
              )}

              {!monaco && <Skeleton height={320} />}
              {(errors.json?.message || error) && (
                <ErrorMessage elementRef={jsonEditorErrorRef} message={errors.json?.message || String(error)} />
              )}
              
            </div>
          </div>

          <ContentFooter className=" mt-14 fixed bottom-0 w-full ">
            <div className="flex flex-col">
              <div className=" flex flex-wrap justify-start">
                <Button
                  text="Save"
                  type="submit"
                  loading={createStandardTemplateLoading}
                  disabled={createStandardTemplateLoading}
                />
                <Button
                  text="Cancel"
                  type="button"
                  buttonStyle="bg-none"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
              </div>
              {createStandardTemplateError && isValid && (
                <ErrorMessage message={getGraphError(createStandardTemplateError?.graphQLErrors).join(',')} />
              )}
            </div>
          </ContentFooter>
        </form>
        <div />
      </div>
    </div>
  );
}
