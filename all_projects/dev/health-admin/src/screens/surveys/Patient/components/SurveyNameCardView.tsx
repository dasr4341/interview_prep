import DateFormat from 'components/DateFormat';
import SafeHtml from 'components/SafeHtml';
import { config } from 'config';
import { format } from 'date-fns';
import { CustomSurveyDetails } from 'interface/custom-survey-details.interface';
import React from 'react';
import EventRowSkeletonLoading from 'screens/EventsScreen/skeletonLoading/EventRowSkeletonLoading';

export default function SurveyNameCardView({ surveyDetails, loading }:
  { surveyDetails: CustomSurveyDetails, loading: boolean }) {
  return (
    <React.Fragment>
      {loading && <EventRowSkeletonLoading />}
      {!loading &&
        <div className="flex flex-col justify-between px-4 md:px-10 py-6 rounded-xl mb-4 bg-white border-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
            <div className="sm:flex-1 cursor-default">
              <h3 className="font-medium text-xs text-primary opacity-50 mb-1  uppercase">Completed Assessment</h3>
              <p className='font-bold'>
                Completed {surveyDetails.name}.
              </p>

              <SafeHtml
                className="normal-case italic text-gray-150 font-medium text-base"
                rawHtml={String(`Assessment was issued on ${format(new Date(surveyDetails?.createdAt), config.dateFormat)}`)}
              />
            </div>
            <span className="text-sm text-gray opacity-50 mt-2 sm:mt-0" data-test-id="event-created-at">
              {surveyDetails?.submissionDate && <DateFormat date={surveyDetails.submissionDate} />}
            </span>
          </div>
        </div>
      }
    </React.Fragment>
  );
}
