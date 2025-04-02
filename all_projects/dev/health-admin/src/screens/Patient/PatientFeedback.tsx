import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import StarRating from 'components/ui/star-rating/StarRating';
import CustomInputField from 'components/Input/CustomInputField';
import { healthCreateFeedback } from 'graphql/createFeedback.mutation';
import { client } from 'apiClient';
import { CreateFeedback, CreateFeedbackVariables } from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SpaceOnly from 'lib/form-validation/space-only';
import messagesData from 'lib/messages';
import FeedbackModal from './components/modal/FeedbackModal';
import { config } from 'config';

interface PatientFeedBackSchema {
  feedback: string;
  feedbackValue: number;
}

const feedbackSchema = yup
  .object({
    feedback: yup.string().required(messagesData.errorList.required)
    // .max(config.form.textAreaMaxLength, messagesData.errorList.errorMaxLength(config.form.textAreaMaxLength))
    .transform(SpaceOnly).typeError(messagesData.errorList.required),
    feedbackValue: yup.string()
      .required(messagesData.errorList.required),
  })
  .required();

export default function PatientFeedback() {
  const [openModal, setOpenModal] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [noOfStars, setNoOfStars] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors: formError, isValid },
  } = useForm<PatientFeedBackSchema>({
    mode: 'onChange',
    resolver: yupResolver(feedbackSchema),
  });

  async function patientFeedback(data: PatientFeedBackSchema) {
    try {
      setLoading(true);
      const { errors: responseErrors } = await client.mutate<CreateFeedback, CreateFeedbackVariables>({
        mutation: healthCreateFeedback,
        variables: {
          feedback: data.feedback,
          feedbackValue: Number(data.feedbackValue),
        },
      });

      if (responseErrors) {
        setFeedbackError(getGraphError(responseErrors).join(','));
      } else {
        setNoOfStars(data.feedbackValue);
        setOpenModal(true);
        reset();
        setFeedbackError('');
      }
    } catch (e: any) {
      setFeedbackError(e.message);
    } finally {
      setLoading(false);
    }
  }
  function updateRating(n: number) {
    setValue('feedbackValue', n);
    trigger('feedbackValue');
  }

  watch('feedback');

  return (
    <>
      <ContentHeader disableGoBack={true} title="Feedback" />
      <ContentFrame className="flex flex-col mt-7 items-start justify-start relative ">
        <div className="font-semibold text-smd">Help us improve</div>
        <div className="text-xsmd font-medium mt-6 mb-5">How did we do?</div>
        {/* we are passing state function -> setStarState(), which updates the state variable -> 'star', with the no of star's value  */}
        {/* so that we can validate, onSubmit */}
        <StarRating onStarChange={(n) => updateRating(n)} defaultValue={getValues('feedbackValue')} />
        <form onSubmit={handleSubmit(patientFeedback)} className=' w-full md:w-4/5'>
          <input  type="text" className="hidden" {...register('feedbackValue')} />
          {formError.feedbackValue?.message ? (
            <>
              {formError.feedbackValue.message && <ErrorMessage message={formError.feedbackValue.message} />}
              <hr className="mt-4 w-11/12  md:w-2/4 lg:w-1/4 h-0.5 bg-gray-350 " />
            </>
          ) : (
            <hr className="mt-8 w-11/12  md:w-2/4 lg:w-1/4 h-0.5 bg-gray-350 " />
          )}
          <div className="mt-12 font-medium text-xsmd">To make this application better we would love your feedback:</div>
          <div className="w-full mt-6 md:mt-6 pb-5">
            <div className='comment-box'>
            <CustomInputField
              characterLength={3000}
              placeholder={'Add Comments'}
              multiline={true}
              component="textarea"
              error={Boolean(formError.feedback?.message)}
              register={register('feedback')}
            />
            </div>

            {formError.feedback?.message && <ErrorMessage message={formError.feedback.message} />}
            {isValid && feedbackError && <ErrorMessage message={feedbackError} />}

            <div className="text-green font-normal text-xsm pt-3">
              {getValues('feedback')?.length > 0 && `${
                  config.form.textAreaMaxLength -
            (getValues('feedback')?.length ? getValues('feedback')?.length : 0)
                } characters remaining`}

            </div>
          </div>
          <div className="">
            <Button type="submit" disabled={loading} loading={loading} classes={[' w-auto  font-medium z-50']}>
              Submit
            </Button>
          </div>
        </form>

        {openModal && !feedbackError?.length && (
          <FeedbackModal
            onClose={() => {
              setOpenModal(false);
              setFeedbackError(null);
              reset();
              setNoOfStars(null);
            }}
            noOfStar={noOfStars}
          />
        )}
      </ContentFrame>
    </>
  );
}
