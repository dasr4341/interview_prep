import React, { useEffect, useState } from 'react';
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import StarLarge from 'assets/images/star-large.svg';
import { IoMdClose } from 'react-icons/io';
import { useMutation } from '@apollo/client';
import { createFeedback } from 'lib/mutation/feedback/create-feedback';
import StarRating from 'components/ui/star-rating/StarRating';
import catchError from 'lib/catch-error';
import { CreateFeedback, CreateFeedbackVariables } from 'generatedTypes';
import { errorList } from '../lib/message.json';
import '../scss/components/feedback-screen.scss';
import { routes } from '../routes';
import { useNavigate } from 'react-router';
import { TrackingApi } from 'components/Analytics';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

interface FeedbackInput {
  feedbackValue: number;
  feedback: string;
}

export default function FeedbackScreen() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);
  const feedbackSchema = yup.object().shape({
    feedbackValue: yup.number().required(errorList.feedback),
    feedback: yup.string().nullable(true),
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: yupResolver(feedbackSchema),
  });

  const [submitFeedBack, { loading }] = useMutation<CreateFeedback, CreateFeedbackVariables>(createFeedback);

  function handleStarChange(star: number) {
    setValue('feedbackValue', star);
    trigger('feedbackValue');
  }

  const onSubmit = async ({ feedback, feedbackValue }: FeedbackInput) => {
    try {
      const createVariables: CreateFeedbackVariables = {
        feedback,
        feedbackValue,
      };
      const { data } = await submitFeedBack({
        variables: createVariables,
      });
      if (data) {
        setModal(true);
        reset();
      }
    } catch (e) {
      catchError(e, true);
    }
  };

  const handleClose = () => {
    setModal(false);
    navigate(routes.events.match);
  };

  watch('feedbackValue');

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.feedback.name,
    });
  }, []);

  return (
    <div className="flex flex-col h-screen feedback-screen">
      <ContentHeader title="Feedback" />
      <ContentFrame className="h-full">
        <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-1">
            <div className="title font-semibold text-gray-09 mb-4">Help us improve</div>
            <div
              className="max-w-sm border-b border-gray-300 mb-4 pb-4
             lg:pb-6 lg:mb-6"
              data-test-id="feedback-rating">
              <label htmlFor="experience" className="form-label block mb-3 review-text text-gray-09 font-medium">
                How did we do?
              </label>

              <StarRating onStarChange={handleStarChange} defaultValue={getValues('feedbackValue')} />
              <div className="tracking-wide font-medium text-xs text-pt-red-900 mt-2"
               data-testid="feedback-rating-error">
                {errors.feedbackValue?.message}
              </div>
            </div>

            <div className="max-w-2xl">
              <label htmlFor="feedback" className="form-label block mb-3 review-text font-medium text-gray-09">
                To make this application better we would love your feedback:
              </label>

              <textarea
                data-test-id="feedback-comment"
                id="betterState"
                className="textarea w-full h-24"
                placeholder="Add comments"
                {...register('feedback')}></textarea>

              <ErrorMessage message={errors.feedback?.message ? errors.feedback?.message : ''} />
            </div>
          </div>
          <div className="pt-4">
            <Button text="Save" disabled={loading} loading={loading} testId="save-btn" />
          </div>
        </form>
      </ContentFrame>
      <ConfirmationDialog modalState={modal} buttonRowAlign="hidden" className="max-w-md" onCancel={handleClose}>
        <div className="flex flex-col items-center p-6 md:p-10 relative">
          <button
            type="button"
            data-test-id="close-modal"
            onClick={handleClose}
            className="absolute top-0 right-0">
            <IoMdClose className="text-xmd text-gray-400" />
          </button>
          <img src={StarLarge} />
          <h3 className="h3 md:text-md mt-6 mb-3" data-test-id="modal-title">
            Thank you!
          </h3>
          <p
            className="text-base md:text-xmd leading-normal 
          md:leading-relaxed">
            By making your voice heard, you help <br />
            us improve Pretaa.
          </p>
        </div>
      </ConfirmationDialog>
    </div>
  );
}
