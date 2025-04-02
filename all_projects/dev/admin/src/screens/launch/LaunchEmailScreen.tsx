/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import LaunchIcon from 'components/icons/launch';
import ContactList from 'screens/companies/ContactList';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CreateLaunchActionMutation } from 'lib/mutation/launch/create-launch-email';
import {
  CreateLaunchActionVariables,
  GetEmailTemplate,
  PreviewLaunchAction,
  LaunchContactsCreateWithoutLaunchInput,
  GetHustleHintTemplate,
  PreviewHustleHintLaunchAction,
  PreviewHustleHintLaunchActionVariables,
  GetHustleHintTemplateVariables,
  PretaaCreateHustleActionVariables,
  PretaaCreateHustleAction,
  GetCompanyHeaderVariables,
  GetCompanyHeader,
  GetOpportunityHeader,
  GetOpportunityHeaderVariables,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { ContentHeader } from 'components/ContentHeader';
import EventCardView from 'screens/events/components/EventCard';
import queryString from 'query-string';
import { SelectBox } from 'interface/SelectBox.interface';
import { getEmailTemplateQuery } from 'lib/query/templates/get-email-template';
import { previewLaunchAction } from 'lib/query/launch/launch-preview';
import { getHustleHintTemplateQuery } from 'lib/query/hustle-hint/get-hustle-hint-template';
import { previewHustleHintLaunchAction } from 'lib/query/hustle-hint/hustle-hint-preview';
import QuillEditor from 'components/QuillEditor';
import { routes } from 'routes';
import SafeHtml from 'components/SafeHtml';
import { useNavigate } from 'react-router-dom';
import { CreateHustleHintMutation } from 'lib/query/hustle-hint/create-hustle-hint';
import dayjs from 'dayjs';
import { successList, errorList } from '../../lib/message.json';
import CompanyName from 'screens/companies/components/CompanyName';
import { GetCompanyHeaderQuery } from 'lib/query/company/get-company-header';
import { GetOpportunityHeaderQuery } from 'lib/query/opportunity/get-opportunity-header';
import OpportunityHeader from 'components/OpportunityHeader';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import SpaceOnly from 'lib/form-validation/space-only';

interface LaunchForm {
  messageTemplateId: string;
  subject: string;
  text: string;
  // info: Unable to set properly types for this field
  launchContacts: any;
  sendToAddress?: string | null;
}

const LaunchTextFormat = (text: string) => {
  text = text.replace(/\[CURRENT DATE]/gm, dayjs(new Date()).format('YYYY-MM-DD')).replace(/\[CURRENT TIME]/gm, dayjs(new Date()).format('hh:mm'));
  text = `
  <style>
  p {
    margin-top: 0;
  }
  </style>
  ${text}
  `;
  return text;
};

export default function LaunchEmailScreen() {
  const navigate = useNavigate();
  const queryP: {
    eventId: string;
    selectedTemplate: string;
    companyId: string;
    isHustleHint?: boolean;
    opportunityId?: string;
  } = queryString.parse(location.search) as any;

  const [selectedTemplate, setSelectedTemplate] = useState<SelectBox>();
  // Hooks for creating new launch email
  const [createLaunch, { loading: createLaunchLoading }] = useMutation(CreateLaunchActionMutation);
  const [createHustle, { loading: createHustleHintLoading }] = useMutation<PretaaCreateHustleAction, PretaaCreateHustleActionVariables>(CreateHustleHintMutation);
  // Hooks for fetch template
  const [getTemplate, { data: templateText }] = useLazyQuery<GetEmailTemplate>(getEmailTemplateQuery);
  const [getHustleHintTemplate, { data: hustleHint }] = useLazyQuery<GetHustleHintTemplate, GetHustleHintTemplateVariables>(getHustleHintTemplateQuery);
  // Hooks for fetch template preview
  const [getTemplatePreview, { data: templatePreview, loading: templatePreviewLoading }] = useLazyQuery<PreviewLaunchAction>(previewLaunchAction);
  const [getHustleHintTemplatePreview, { data: hustleHintTemplatePreview, loading: hustleHintTemplatePreviewLoading }] = useLazyQuery<
    PreviewHustleHintLaunchAction,
    PreviewHustleHintLaunchActionVariables
  >(previewHustleHintLaunchAction);
  const [isPreview, setIsPreview] = useState(false);

  const [templateDefaultValue, setTemplateDefaultValue] = useState<string>('');

  // Hooks for fetch company detail
  const [getCompanyDetail, { data: companyDetail }] = useLazyQuery<GetCompanyHeader, GetCompanyHeaderVariables>(GetCompanyHeaderQuery);
  const [getOpportunityDetail, { data: opportunityDetail }] = useLazyQuery<GetOpportunityHeader, GetOpportunityHeaderVariables>(GetOpportunityHeaderQuery);

  // Regex playground: https://regex101.com/r/RJhUEN/1
  const EmailRegex =
    // eslint-disable-next-line max-len
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const launchEmailSchema = yup.object().shape({
    messageTemplateId: yup.string().required(),
    subject: yup.string().transform(SpaceOnly).typeError(errorList.subject).required(errorList.required),
    text: yup.string().min(1, errorList.required).transform(SpaceOnly).typeError(errorList.text).required(errorList.required),
    sendToAddress: yup.string().trim().matches(EmailRegex, errorList.email),
    launchContacts: yup.object().when('sendToAddress', (sendToAddress: string, schema: any) => {
      if (!sendToAddress) {
        return schema.required(errorList.required);
      }
      return schema;
    }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<LaunchForm>({
    resolver: yupResolver(launchEmailSchema) as unknown as any,
  });

  useEffect(() => {
    const template: SelectBox = queryString.parse(queryP.selectedTemplate) as unknown as SelectBox;
    if (template) {
      setValue('messageTemplateId', String(template.value));
      trigger('messageTemplateId');
      setSelectedTemplate(template);

      if (queryP.isHustleHint) {
        getHustleHintTemplate({
          variables: {
            templateId: template.value,
          },
        });
      } else {
        getTemplate({
          variables: {
            templateId: { id: template?.value },
          },
        });
      }
    }
  }, [queryP.selectedTemplate, queryP.isHustleHint]);

  useEffect(() => {
    if (queryP?.companyId) {
      getCompanyDetail({
        variables: {
          companyId: String(queryP?.companyId),
        },
      });
    }
    if (queryP?.opportunityId) {
      getOpportunityDetail({
        variables: {
          opportunityId: String(queryP?.opportunityId),
        },
      });
    }
  }, [queryP.companyId, queryP?.opportunityId]);

  useEffect(() => {
    if (templateText?.pretaaGetEmailTemplate) {
      setValue('text', templateText?.pretaaGetEmailTemplate?.text);
      setValue('subject', templateText?.pretaaGetEmailTemplate?.subject);
    } else if (hustleHint?.pretaaGetHustleHintTemplate) {
      setValue('text', hustleHint.pretaaGetHustleHintTemplate.content);
      setValue('subject', hustleHint.pretaaGetHustleHintTemplate.emailSubject);
    }
  }, [templateText, hustleHint]);

  function handleEditorChange(value: { html: string }) {
    setValue('text', value.html);
    trigger('text');
  }

  const handleEmailChange = (email: string) => {
    setValue('sendToAddress', email);
    trigger('sendToAddress');
  };

  const handlePreviewLaunchAction = () => {
    if (queryP.isHustleHint) {
      getHustleHintTemplatePreview({
        variables: {
          text: getValues('text'),
          eventId: queryP.eventId,
        },
      });
    } else {
      getTemplatePreview({
        variables: {
          text: getValues('text'),
          eventId: queryP.eventId,
          companyId: queryP.companyId,
        },
      });
    }
    setTemplateDefaultValue(getValues('text'));
    if (!errors.text) {
      setIsPreview(!isPreview);
    }
  };

  const createLaunchEmail = async (formValue: CreateLaunchActionVariables) => {
    try {
      let createVariables: CreateLaunchActionVariables = {
        ...formValue,
        delta: '',
        companyId: queryP.companyId,
        text: LaunchTextFormat(templatePreview?.pretaaPreviewLaunchAction || ''),
        sendToAddress: formValue?.sendToAddress ? formValue?.sendToAddress : '',
        launchContacts: formValue.launchContacts || { create: [] },
      };
      if (queryP.eventId) {
        createVariables = {
          ...createVariables,
          eventId: queryP.eventId,
        };
      }
      if (queryP?.opportunityId) {
        createVariables = {
          ...createVariables,
          opportunityId: queryP?.opportunityId,
        };
      }
      console.log(createVariables);
      const { data } = await createLaunch({
        variables: createVariables,
      });
      if (data) {
        navigate(routes.launchedDetail.build(String(data?.pretaaCreateLaunchAction?.id)));
        toast.success(successList.lunchCreate);
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  const createHustleHint = async (formValue: LaunchForm) => {
    try {
      if (selectedTemplate) {
        const createHustleHintVariables: PretaaCreateHustleActionVariables = {
          ...formValue,
          eventId: queryP.eventId,
          hustleHintTemplateId: selectedTemplate.value,
          delta: '',
          hustleContacts: formValue.launchContacts || { create: [] },
          subject: formValue.subject,
          text: LaunchTextFormat(hustleHintTemplatePreview?.pretaaPreviewHustleAction || ''),
          sendToAddress: formValue?.sendToAddress ? (formValue?.sendToAddress as string) : '',
        };
        const { data } = await createHustle({
          variables: createHustleHintVariables,
        });
        if (data) {
          navigate(routes.eventDetail.build(String(queryP.eventId)));
          toast.success(successList.hustleHintCreate);
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  // Sending creating request
  async function onSubmit(formValue: CreateLaunchActionVariables) {
    if (!isPreview) {
      handlePreviewLaunchAction();
    } else {
      if (!queryP.isHustleHint) {
        createLaunchEmail(formValue);
      } else {
        createHustleHint(formValue);
      }
    }
  }

  const handleContactChange = (list: LaunchContactsCreateWithoutLaunchInput[]) => {
    if (list === undefined) {
      setValue('launchContacts', undefined);

      if (errors.sendToAddress?.message) {
        clearErrors('launchContacts');
      }
    } else if (list?.length) {
      setValue('launchContacts', { create: list });
      clearErrors('sendToAddress');
    }
    trigger('launchContacts');
  };

  useEffect(() => {
    if (templateText?.pretaaGetEmailTemplate?.text || hustleHint?.pretaaGetHustleHintTemplate.content) {
      if (queryP.isHustleHint) {
        setTemplateDefaultValue(hustleHint?.pretaaGetHustleHintTemplate.content as string);
      } else {
        setTemplateDefaultValue(templateText?.pretaaGetEmailTemplate?.text as string);
      }
    }
  }, [templateText?.pretaaGetEmailTemplate?.text, hustleHint?.pretaaGetHustleHintTemplate.content]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.launchEmail.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader title={queryP.isHustleHint ? 'Hustle Hint' : 'Launch'}>
        <EventCardView id={queryP.eventId} />

        {queryP?.companyId && !queryP?.opportunityId && companyDetail?.pretaaGetCompany?.name && !queryP.eventId && (
          <CompanyName
            id={queryP.companyId}
            name={companyDetail?.pretaaGetCompany?.name || ''}
            starred={Boolean(companyDetail?.pretaaGetCompany?.starredByUser)}
            className={`px-6 py-5 h-20 mb-6 rounded-xl shadow-sm 
            bg-white border border-gray-200 text-md`}
            isLinked={false}
            isOnClickStar={true}
          />
        )}
        {queryP?.opportunityId && opportunityDetail?.pretaaGetCompanyOpprtunity?.name && !queryP.eventId && (
          <OpportunityHeader
            id={queryP.opportunityId}
            companyId={queryP?.companyId}
            name={opportunityDetail?.pretaaGetCompanyOpprtunity?.name || ''}
            className={`px-6 py-5 h-20 mb-6 rounded-xl shadow-sm 
            bg-white border border-gray-200 text-md`}
          />
        )}
      </ContentHeader>
      <ContentFrame classes={['bg-white flex-1 flex']}>
        <div className="flex flex-1 flex-col">
          <form className="flex flex-col flex-1 flex-wrap" onSubmit={handleSubmit(onSubmit)}>
            <div className="border-b border-gray-300 py-2 flex flex-wrap items-center">
              <label htmlFor="to" className="text-sm text-primary opacity-50 mr-3">
                To:
              </label>
              {}
              <ContactList onContactChange={handleContactChange} onEmailChange={handleEmailChange} companyId={queryP.companyId} />
            </div>

            {/* Show display for two fields */}
            {isSubmitted && (
              <>
                {!getValues('sendToAddress') && !getValues('launchContacts.create') && (
                  <ErrorMessage message={errors.launchContacts?.message ? errors.launchContacts?.message : ''} />
                )}

                {errors.sendToAddress?.message && !errors.launchContacts?.message && <ErrorMessage message={errors.sendToAddress?.message ? errors.sendToAddress?.message : ''} />}
              </>
            )}

            <div className="border-b border-gray-300 py-2 flex flex-wrap items-center">
              <label htmlFor="template" className="text-sm text-primary opacity-50 mr-3">
                Template:
              </label>
              <input type="text" placeholder={selectedTemplate?.label} className="input-email__template flex-1" readOnly={true} data-test-id="email-input-template" />
            </div>
            {!getValues('messageTemplateId') && <ErrorMessage message={errors.messageTemplateId?.message ? errors.messageTemplateId?.message : ''} />}
            <div
              className="border-b border-gray-300 py-2 flex flex-wrap
           items-center">
              <label htmlFor="subject" className="text-sm text-primary opacity-50 mr-3">
                Subject:
              </label>
              <input type="text" className="input-email__template flex-1" {...register('subject')} />
            </div>
            {!getValues('subject') && <ErrorMessage message={errors.subject?.message ? errors.subject?.message : ''} />}
            {isPreview && (
              <div className="py-4 flex flex-1 editor-wrapper email-content">
                <SafeHtml
                  rawHtml={
                    queryP.isHustleHint
                      ? LaunchTextFormat(hustleHintTemplatePreview?.pretaaPreviewHustleAction || '')
                      : LaunchTextFormat(templatePreview?.pretaaPreviewLaunchAction || '')
                  }
                  className="mt-0"
                />
              </div>
            )}
            {!isPreview && (
              <div className="py-4 flex flex-1 flex-wrap items-stretch">
                <QuillEditor className="flex flex-col flex-1" onChange={(value) => handleEditorChange(value)} defaultValue={templateDefaultValue} theme="snow" />
              </div>
            )}
            <ErrorMessage message={errors.text?.message ? errors.text?.message : ''} />
            <div className="flex flex-wrap mt-14">
              {!isPreview && (
                <Button
                  type="submit"
                  testId="preview-btn"
                  disabled={templatePreviewLoading || hustleHintTemplatePreviewLoading}
                  loading={templatePreviewLoading || hustleHintTemplatePreviewLoading}>
                  <LaunchIcon />
                  Preview
                </Button>
              )}
              {isPreview ? (
                <Button
                  disabled={createLaunchLoading || createHustleHintLoading || templatePreviewLoading || hustleHintTemplatePreviewLoading}
                  loading={createLaunchLoading || createHustleHintLoading}
                  type="submit"
                  testId="launch-btn">
                  <LaunchIcon />
                  Launch
                </Button>
              ) : null}
              {isPreview && (
                <Button
                  style="bg-none"
                  type="button"
                  onClick={() => {
                    setIsPreview(!isPreview);
                  }}>
                  Cancel
                </Button>
              )}
              {!isPreview && (
                <Button style="bg-none" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </ContentFrame>
    </div>
  );
}
