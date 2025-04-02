import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDays, format } from 'date-fns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import DateFormat from 'components/DateFormat';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import {
  GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor,
  SurveyReminder,
  SurveyReminderVariables,
  SurveyStatusTypePatient,
} from 'health-generatedTypes';
import ReloadIcon from 'components/icons/ReloadIcon';
import Button from 'components/ui/button/Button';
import { config } from 'config';
import { routes } from 'routes';
import './_survey-row-view.scoped.scss';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import messagesData from 'lib/messages';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { sendSurveyReminder } from 'graphql/surveyReminder.mutation';
import catchError from 'lib/catch-error';
import SafeHtml from 'components/SafeHtml';

const dateTimeIsoFormat = (date: any, time: any) => {
  return `${date?.split('T')[0]}T${time?.split('T')[1]}`;
};
interface SurveyReminderType {
  reminderDate: string;
  reminderTime: string;
}

export default function SurveyRowView({
  data,
  type,
}: {
  data: GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor;
  type: SurveyStatusTypePatient;
}) {
  const [reminderModalState, setReminderModalState] = useState(false);
  const [chooseDate, setChooseDate] = useState<Date | null>();
  const [chooseTime, setChooseTime] = useState<Date | null>();
  const params = useParams();
  const navigate = useNavigate();

  const reminderFormSchema = yup.object().shape({
    reminderDate: yup.string().required(messagesData.errorList.required),
    reminderTime: yup.string().required(messagesData.errorList.required),
  });

  const {
    setValue,
    trigger,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SurveyReminderType>({
    resolver: yupResolver(reminderFormSchema),
  });

  function handleOnClose() {
    setReminderModalState(false);
    setChooseDate(null);
    setChooseTime(null);
    reset();
  }

  const [surveyReminder, { loading }] = useMutation<SurveyReminder, SurveyReminderVariables>(sendSurveyReminder, {
    onCompleted: () => {
      toast.success(messagesData.successList.surveyReminder);
      setReminderModalState(false);
      setChooseDate(null);
      setChooseTime(null);
      reset();
    },
    onError: (e) => catchError(e, true),
  });

  function onSubmit() {
    surveyReminder({
      variables: {
        surveyAssignId: String(data.assignmentId),
        reminderDate: dateTimeIsoFormat(chooseDate?.toISOString(), chooseTime?.toISOString()),
      },
    });
  }

  const redirectToSubmittedAssessment = () => {
    if (type === SurveyStatusTypePatient.COMPLETED)
      if (location.pathname.includes('events')) {
        navigate(
          routes.eventAssessmentsPage.eventSubmittedAssessment.build(
            String(params.id),
            String(data.assignmentId)
          )
        );
      } else {
        navigate(routes.patientSurvey.submittedSurvey.build(String(params.id), String(data.assignmentId)));
      }
  };

  return (
    <>
      <div className="cursor-pointer flex flex-col py-6 px-5 bg-white border-b-2 relative ">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex flex-col">
           
                <div className={`${type === SurveyStatusTypePatient.COMPLETED ? 'cursor-pointer' : 'cursor-default'} flex-col`} onClick={ redirectToSubmittedAssessment}>
                  <h3 className="text-base mt-1 font-bold">{data.surveyTemplate?.name}</h3>
                  <p className="text-gray-600">{data.surveyTemplate?.description}</p>
                  <SafeHtml
                    className="normal-case italic text-gray-150 opacity-50 font-medium text-base"
                    rawHtml={String(`Assessment was issued on ${format(new Date(data.createdAt), config.dateFormat)}`)}
                  />
                </div>
              
            </div>
          </div>

          {data.createdAt && type === SurveyStatusTypePatient.OPEN && (
            <div className="font-medium text-sm border-r-2 py-2 px-3 text-gray-600">
              <DateFormat date={data.createdAt} />
            </div>
          )}
          {type === SurveyStatusTypePatient.COMPLETED && (
            <div className="font-medium text-sm border-r-2 py-2 px-3 text-gray-600">
              <DateFormat date={data.submissionDate || 'N/A'} />
            </div>
          )}
          {type === SurveyStatusTypePatient.COMPLETED && (
            <Link to={routes.patientSurvey.submittedSurvey.build(String(params.id), String(data.assignmentId))}>
              <DisclosureIcon />
            </Link>
          )}
          {type === SurveyStatusTypePatient.OPEN && (
            <div className="ml-4" onClick={() => setReminderModalState(true)}>
              <ReloadIcon />
            </div>
          )}
        </div>
      </div>

      {/* send survey reminder modal */}
      {reminderModalState && (
        <div className="fixed modal-overlay top-0 left-0 right-0 bottom-0 bg-overlay flex items-center justify-center">
          <div className="bg-white w-11/12 md:w-9/12 xl:w-5/12">
            <div className="py-7 px-3 md:px-8 bg-gray-100">
              <div className="text-md md:text-lg font-bold text-pt-primary ">Send assessment  reminder</div>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <div className="pt-8 px-3 md:px-8 md:pb-8">
                <div>
                  <span className="font-bold text-pt-primary text-base">Select delivery date</span>
                  <div className="border mt-2 border-gray-500 select-date select-reminder-date-icon rounded md:w-2/3">
                    <Controller
                      control={control}
                      name="reminderDate"
                      render={({ field: { onChange } }) => (
                        <DatePicker
                          minDate={addDays(new Date(), 1)}
                          onChange={(date) => {
                            onChange(date);
                            if (date) {
                              setChooseDate(date);
                              setValue('reminderDate', date.toISOString());
                              trigger('reminderDate');
                            }
                          }}
                          dateFormat={config.dateFormat}
                          selected={chooseDate}
                          placeholderText={config.dateFormat.toLowerCase()}
                          className="cursor-pointer"
                          formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
                        />
                      )}
                    />
                  </div>
                  {errors.reminderDate?.message && <ErrorMessage message={errors.reminderDate?.message} />}
                </div>
                <div className="mt-8">
                  <span className="font-bold text-pt-primary text-base">Set Time</span>
                  <div className="select-date w-36 sm:w-52 border mt-2 border-gray-500 select-reminder-time-icon select-date rounded">
                    <Controller
                      control={control}
                      name="reminderTime"
                      render={({ field: { onChange } }) => (
                        <DatePicker
                          showTimeSelect
                          showTimeSelectOnly
                          timeCaption="Time"
                          dateFormat={config.timeFormat}
                          onChange={(time) => {
                            onChange(time);
                            if (time) {
                              setChooseTime(time);
                              setValue('reminderTime', time.toISOString());
                              trigger('reminderTime');
                            }
                          }}
                          selected={chooseTime}
                          placeholderText={config.timeFormat.replaceAll('a', '')}
                          className="cursor-pointer"
                        />
                      )}
                    />
                  </div>
                  {errors.reminderTime?.message && <ErrorMessage message={errors.reminderTime?.message} />}
                </div>
              </div>
              <div className="flex flex-wrap justify-between w-full pb-8 px-3 md:px-8 mt-8">
                <div className="flex">
                  <Button type="submit" className="lg:px-24" loading={loading} disabled={loading}>
                    Send
                  </Button>
                  <Button
                    type="button"
                    buttonStyle="bg-none"
                    onClick={() => {
                      handleOnClose();
                    }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
