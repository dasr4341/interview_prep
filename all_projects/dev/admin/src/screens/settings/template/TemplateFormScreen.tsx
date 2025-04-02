/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import QuillEditor from 'components/QuillEditor';
import { RiVipCrownLine } from 'react-icons/ri';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { routes } from 'routes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GetEmailTemplate, CreateEmailTemplateVariables, UpdateEmailTemplateVariables, EmailShortCodes_pretaaGetShortcodes, EmailShortCodes } from 'generatedTypes';
import { getEmailTemplateQuery } from 'lib/query/templates/get-email-template';
import { createEmailTemplate } from 'lib/mutation/template/create-email-template';
import { updateEmailTemplate } from 'lib/mutation/template/update-email-template';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { getEmailShortCodes } from 'lib/query/templates/get-shortcodes';
import { FaSignature } from 'react-icons/fa';
import { IoRocketOutline } from 'react-icons/io5';
import Button from 'components/ui/button/Button';
import 'scss/modules/_template-form-screen.scss';
import SpaceOnly from 'lib/form-validation/space-only';
import { errorList, successList } from '../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

export default function AddEmailTemplateScreen(): JSX.Element {
  const { id }: { id?: string } = useParams() as any;
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);

  // Hooks for creating new email template
  const [createTemplate, { loading: createTemplateLoading }] = useMutation(createEmailTemplate);
  // Hooks for updating a existing email template
  const [updateTemplate, { loading: updateTemplateLoading }] = useMutation(updateEmailTemplate);
  // Hooks for getting one existing template details
  const [getTemplate, { data: template }] = useLazyQuery<GetEmailTemplate>(getEmailTemplateQuery, {
    variables: {
      templateId: { id: String(id) },
    },
  });

  const templateSchema = yup.object().shape({
    title: yup.string().trim(errorList.title).required(errorList.required),
    subject: yup.string().trim(errorList.subject).required(errorList.required),
    text: yup.string().transform(SpaceOnly).typeError(errorList.text).required(errorList.required),
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(templateSchema) as unknown as any,
  });

  const icons: any = {
    time: <AiOutlineCalendar size="18" />,
    date: <AiOutlineCalendar size="18" />,
    greeting: <RiVipCrownLine size="18" />,
    customerFirstname: <HiOutlineEmojiHappy size="18" />,
    customerLastname: <HiOutlineEmojiHappy size="18" />,
    currentusername: <HiOutlineEmojiHappy size="18" />,
    currentusercompany: <IoRocketOutline size="18" />,
    signoff: <FaSignature size="18" />,
  };
  const { data: shortCodes, loading: shortCodesLoading } = useQuery<EmailShortCodes>(getEmailShortCodes);

  const [shortCodeList, setShortCodeList] = useState<EmailShortCodes_pretaaGetShortcodes[]>([]);

  useEffect(() => {
    const codes =
      shortCodes?.pretaaGetShortcodes?.map((code) => {
        return {
          ...code,
          icon: icons[code.shortcode] ? icons[code.shortcode] : '-',
        };
      }) || ([] as EmailShortCodes_pretaaGetShortcodes[]);

    setShortCodeList(codes);
  }, [shortCodes]);

  useEffect(() => {
    if (template) {
      const templateValue = template.pretaaGetEmailTemplate;
      setValue('title', templateValue?.title);
      setValue('subject', templateValue?.subject);
      setValue('text', templateValue?.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, setValue]);

  useEffect(() => {
    if (id) {
      getTemplate();
    }
  }, [id]);

  // Sending creating and updating request
  async function onSubmit(formValue: CreateEmailTemplateVariables) {
    try {
      if (id) {
        const udpateVariables: UpdateEmailTemplateVariables = {
          ...formValue,
          id,
          delta: '',
        };
        const { data } = await updateTemplate({
          variables: udpateVariables,
        });
        if (data) {
          navigate(routes.templateList.match);
          toast.success(successList.templateUpdate);
        }
      } else {
        const { data } = await createTemplate({
          variables: { ...formValue, delta: '' },
        });
        if (data) {
          navigate(routes.templateEdit.build(String(data.pretaaCreateEmailTemplate.id)));
          toast.success(successList.templateCreate);
        }
      }
    } catch (e) {
      catchError(e, true);
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.templateAdd.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={id ? 'Edit email template' : 'New email template'} />
      <ContentFrame className="bg-white h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:h-full lg:w-4/5 lg:flex lg:flex-1 lg:border-r">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 lg:pr-12">
            <input
              disabled={dragging}
              readOnly={dragging}
              type="text"
              className="border-0 border-b border-gray-350 border-r-0 shadow-none
              bg-white w-full text-gray-950 text-base pl-3 md:pl-12 input-style"
              placeholder="Template Title"
              {...register('title')}
            />
            <ErrorMessage message={errors.title?.message} />

            <input
              disabled={dragging}
              readOnly={dragging}
              type="text"
              className="border-0 border-b 
              border-gray-350 border-r-0 shadow-none bg-white w-full text-gray-950 text-base
              pl-3 md:pl-12 input-style"
              placeholder="Enter Subject Line"
              {...register('subject')}
            />
            <ErrorMessage message={errors.subject?.message} />

            <div className="editor-wrapper pl-0 flex flex-col flex-1">
              <QuillEditor
                onChange={(value) => {
                  setValue('text', value.html);
                  trigger('text');
                }}
                onDropHandle={() => {
                  setDragging(false);
                }}
                placeholder="Start writing..."
                defaultValue={template?.pretaaGetEmailTemplate.text}
              />
              {isSubmitted && (
                <ErrorMessage message={errors.text?.message} />
              )}
            </div>

            <div className="bg-white pb-5 w-full block md:flex lg:flex">
              <Button classes="mx-auto mb:mx-0 lg:mx-0" loading={createTemplateLoading || updateTemplateLoading} disabled={createTemplateLoading || updateTemplateLoading}>
                Save
              </Button>
              <Button type="button" style="bg-none" classes="mx-auto mb:mx-0 lg:mx-0 block md:flex" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-1/5 lg:pl-3 flex flex-row lg:flex-col">
          <div className="flex flex-row border-b-2 border-gray-300 mb-7 text-base font-bold">
            <span className="text-primary-light  cursor-pointer">Content</span>
          </div>

          <div className="flex flex-row lg:flex-col lg:space-y-3 lg:overflow-y-scroll lg:overflow-hidden">
            {shortCodesLoading && <LoadingIndicator />}
            {shortCodeList.map((shortcode) => {
              return (
                <div
                  className="border p-2 md:p-4 space-y-3 rounded-lg text-gray-150 cursor-pointer"
                  draggable
                  id={shortcode.shortcode}
                  key={shortcode.shortcode}
                  onDragEnd={() => {
                    setDragging(false);
                  }}
                  onDragStart={(e) => {
                    setDragging(true);
                    e.dataTransfer.setData('text', `[${shortcode.shortcode}]`);
                  }}>
                  <span
                    className="flex items-center text-xs 
                  text-primary  font-semibold">
                    <span className="mr-3">{shortcode.icon}</span>
                    {shortcode.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ContentFrame>
    </>
  );
}
