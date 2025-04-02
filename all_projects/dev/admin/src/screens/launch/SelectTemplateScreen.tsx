import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import Email from 'components/icons/Email';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import TemplateListDropdown from './components/TemplateListDropdown';
import * as yup from 'yup';
import queryString from 'query-string';
import { routes } from 'routes';
import { ContentHeader } from 'components/ContentHeader';
import EventCardView from 'screens/events/components/EventCard';
import { errorList } from '../../lib/message.json';
import './SelectTemplateScreen.scss';
import { TrackingApi } from 'components/Analytics';

export default function SelectTemplateScreen() {
  const queryP = queryString.parse(location.search);
  const templateSchema = yup.object().shape({
    selectedTemplate: yup
      .object()
      .shape({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .nullable(false)
      .required(),
  });

  const navigate = useNavigate();
  const {
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(templateSchema),
  });

  const onSubmit = (data: yup.TypeOf<typeof templateSchema>) => {
    navigate(
      routes.launchEmail.build({
        selectedTemplate: queryString.stringify(data.selectedTemplate),
        ...queryP,
      })
    );
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.selectTemplate.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader title="Launch">
        <EventCardView id={queryP.eventId as string} />
      </ContentHeader>
      <ContentFrame classes={['bg-white flex-1 template-screen-frame']}>
        <div
          className="border border-gray-300 rounded-lg max-w-sm 
          mx-auto my-3 flex flex-col items-center justify-center h-40">
          <Email />
          <span className="text-primary-light font-semibold mt-2">Email</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm">
          <div className="mb-8">
            <TemplateListDropdown
              onChange={(v) => {
                setValue('selectedTemplate', v as any);
                trigger('selectedTemplate');
              }}
              placeholder="Select a Template"
              defaultTemplateId={queryP?.defaultTemplateId ? (queryP.defaultTemplateId as string) : undefined}
              testId="select-template"
            />
            <ErrorMessage message={errors.selectedTemplate?.label ? errorList.template : ''} />
          </div>
          <div className="fixed pt-2 bottom-2 md:bottom-5 flex">
            <Button style="outline">Create New Message</Button>
            <Button
              type="button"
              style="bg-none"
              onClick={() => {
                navigate(-1);
              }}>
              Cancel
            </Button>
          </div>
        </form>
      </ContentFrame>
    </div>
  );
}
