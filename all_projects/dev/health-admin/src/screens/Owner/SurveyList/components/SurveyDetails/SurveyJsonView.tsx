import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import queryString from 'query-string';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SurveyDetailsViewFromInterface } from './SurveyDetailsView';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GetStandardTemplate,
  GetStandardTemplateVariables,
  SurveyTemplateFieldCreateAdminArgs,
  UpdateStandardTemplate,
  UpdateStandardTemplateVariables,
} from 'health-generatedTypes';
import { getStandardTemplateQuery } from 'graphql/getStandardTemplate.quey';
import SurveyJsonViewSkeletonLoading from '../../skeletonLoading/SurveyJsonViewSkeletonLoading';
import { ErrorMessage, ErrorMessageFixed, SuccessMessage } from 'components/ui/error/ErrorMessage';
import { getGraphError } from 'lib/catch-error';
import { updateStandardTemplateMutation } from 'graphql/updateStandardTemplate.mutation';
import messagesData from 'lib/messages';
import Editor, { useMonaco } from '@monaco-editor/react';
import { routes } from 'routes';
import { UpdateJsonValidationSchema } from '../../ValidationSchema/UpdateJsonValidationSchema';
import { toast } from 'react-toastify';
import { BiExpand } from 'react-icons/bi';
import { FiMinimize } from 'react-icons/fi';
import { useFullscreen } from '@mantine/hooks';

function getSurveyDetailsViewFormData(query: any) {
  if (query) {
    return JSON.parse(queryString.parse(query).editedFormData as string);
  } else {
    return '';
  }
}

export default function SurveyJsonView() {
  const { templateId } = useParams();
  const monaco = useMonaco();
  const location = useLocation();
  const navigate = useNavigate();
  const { ref:  editorWrapper, toggle, fullscreen } = useFullscreen();

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<string | undefined>('');
  const [surveyDetailsViewFormData, setSurveyDetailsViewFormData] = useState<SurveyDetailsViewFromInterface>(
    getSurveyDetailsViewFormData(location.search)
  );

  const [
    getStandardTemplateCallBack,
    { loading: getStandardTemplateLoading, error: getStandardTemplateError, data: standardTemplateData },
  ] = useLazyQuery<GetStandardTemplate, GetStandardTemplateVariables>(getStandardTemplateQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (d) =>
      d.pretaaHealthAdminGetTemplate && setJsonData(JSON.stringify(d.pretaaHealthAdminGetTemplate?.surveyTemplateFields, null, '\t')),
  });

  const [
    updateStandardTemplateCallBack,
    {
      loading: updateStandardTemplateLoading,
      error: updateStandardTemplateError,
      data: updateStandardTemplateData,
      reset: updateStandardTemplateResetState,
    },
  ] = useMutation<UpdateStandardTemplate, UpdateStandardTemplateVariables>(updateStandardTemplateMutation, {
    onCompleted: (d) => {
      if (d.pretaaHealthAdminUpdateSurveyTemplate){
        navigate(routes.owner.surveyList.match);
        toast.success(messagesData.successList.templateUpdate);
      }
    },
  });

  function updateTemplateData() {
    setJsonError('');
    const editorErrors = monaco?.editor?.getModelMarkers({});

    try {
      if (!!editorErrors?.length || !jsonData) {
        throw new Error(!!editorErrors?.length ? `Please resolve the errors to continue - ${editorErrors?.length} errors found !` : 'Please enter valid json to continue !' );
      }
      // ------------------------ UPDATING --> (SurveyTemplate Data) -------------------------------------------------------------
      updateStandardTemplateCallBack({
        variables: {
          fields: (jsonData && JSON.parse(jsonData)) as SurveyTemplateFieldCreateAdminArgs[],
          title: String(surveyDetailsViewFormData?.title || standardTemplateData?.pretaaHealthAdminGetTemplate?.title),
          description: String(surveyDetailsViewFormData.description || standardTemplateData?.pretaaHealthAdminGetTemplate?.description),
          templateId: String(templateId),
          name: String(surveyDetailsViewFormData.name || standardTemplateData?.pretaaHealthAdminGetTemplate?.name),
          code: String(surveyDetailsViewFormData.code || standardTemplateData?.pretaaHealthAdminGetTemplate?.code),
        },
      });
    } catch (e: any) {
      setJsonError(e.message);
      updateStandardTemplateResetState();
    }
  }

  useEffect(() => {
    getStandardTemplateCallBack({
      variables: {
        templateId: String(templateId),
      },
    });
    setSurveyDetailsViewFormData(getSurveyDetailsViewFormData(location.search));
    // 
  }, [location, templateId]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: '',
            fileMatch: ['*'], // associate with our model
            schema: UpdateJsonValidationSchema,
          },
        ],
      });
    }
  }, [monaco]);

  

  return (
    <div>
      {getStandardTemplateLoading && <SurveyJsonViewSkeletonLoading />}
      {!getStandardTemplateLoading && standardTemplateData && (
        <>
          <div className='editor-wrapper relative' ref={editorWrapper}>
            <Editor theme="vs-dark" height={fullscreen ? '100vh' : '70vh' } defaultLanguage="json" value={jsonData} onChange={(j:any) => setJsonData(j)} />
            {!fullscreen && (
              <button type='button' className='absolute right-5 top-5 z-50 text-white' onClick={toggle}>
                <BiExpand style={{ width: '30px', height: '30px' }} />
              </button>  
            )}

            {fullscreen && (
              <button type='button' className='absolute right-5 top-5 z-50 text-white' onClick={toggle}>
                <FiMinimize style={{ width: '30px', height: '30px' }} />
              </button>  
            )}
            
            
          </div>
          {/* Hidden for backend limitation */}
          <div className="pt-6 hidden">
            <Button onClick={() => updateTemplateData()} loading={updateStandardTemplateLoading} disabled={updateStandardTemplateLoading}>
              {templateId ? 'Update' : 'Create' }
            </Button>
          </div>
        </>
      )}
      {jsonError && <ErrorMessage message={jsonError} />}
      {getStandardTemplateError && <ErrorMessageFixed message={getGraphError(getStandardTemplateError?.graphQLErrors).join('')} />}
      {updateStandardTemplateError && <ErrorMessageFixed message={getGraphError(updateStandardTemplateError?.graphQLErrors).join(',')} />}
      {updateStandardTemplateData && <SuccessMessage message={messagesData.successList.updateStandardTemplate} />}
    </div>
  );
}
