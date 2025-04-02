/*  */
import React, { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDays, format } from 'date-fns';
import { Radio, Skeleton } from '@mantine/core';

import { AssessmentTemplateContext } from 'screens/surveys/CounsellorAssessmentTemplate/component/AssessmentTemplateContext';
import useGetAdhocAssessment from 'screens/surveys/CounsellorAssessmentTemplate/useGetAdhocAssessment';
import { useParams } from 'react-router-dom';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { config } from 'config';
import { filterPassedTime } from 'screens/surveys/lib/filter-time';

export default function ScheduleAssessmentForm({
  errorMessage
}: {
  errorMessage: string;
}) {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>();
  const {
    sendNow,
    setSendNow,
    setScheduleAt,
    campaignAssessmentSignature,
    setCampaignAssessmentSignature,
  } = useContext(AssessmentTemplateContext);

  const { adhocData, adhocLoading } = useGetAdhocAssessment();
  const { assessmentId, duplicateId } = useParams();

  // set data on edit and duplicate
  useEffect(() => {
    if (adhocData && !duplicateId) {
      setCampaignAssessmentSignature(adhocData.campaignAssessmentSignature);
      setScheduleAt(adhocData?.scheduledAt);
      setSelectedStartDate(new Date(adhocData.scheduledAt));
    } else if (adhocData && duplicateId) {
      setCampaignAssessmentSignature(adhocData.campaignAssessmentSignature);
    }
  }, [adhocData]);


  
  return (
    <div className="sm:pb-5 xl:mt-0">
      <form>
        <div className="block sm:flex flex-row items-center justify-start md:flex-row ">
          <div className="flex">
            <Radio
              size='md'
              value="now"
              label="Now"
              checked={sendNow}
              disabled={!!assessmentId}
              onClick={() => {
                setSendNow(true);
                setScheduleAt('');
                setSelectedStartDate(null);
              }}
              className="text-more lg:text-xsm font-normal text-gray-750 capitalize sm:pt-9 mr-4"
            />
            <p className="sm:pt-10 font-bold text-gray-750 text-more sm:text-xsm">
              OR
            </p>
          </div>

          <div className="sm:ml-6">
            <p className="mb-2 font-bold text-pt-primary mt-1">Select assessment date</p>
            {adhocLoading && (
              <Skeleton
                height={40}
                width={260}
              />
            )}
            {!adhocLoading && (
              <div className="z-40 select-date border border-gray-400 choose-date rounded-md bg-white">
                <DatePicker
                  autoComplete="off"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  placeholderText={config.dateFormat}
                  className="cursor-pointer input-text"
                  onChange={(date) => {
                    if (date) {
                      setSelectedStartDate(date);
                      setScheduleAt(format(date, 'MM/dd/yyyy HH:mm'));
                      setSendNow(false);
                    }
                  }}
                  selected={selectedStartDate}
                  minDate={addDays(new Date(), 1)}
                />
              </div>
            )}
          </div>
          <div className="sm:ml-6 w-36">
            <p className="mb-2 font-bold text-pt-primary mt-1">Time of delivery</p>
            {adhocLoading && (
              <Skeleton
                height={40}
                width={260}
              />
            )}
            {!adhocLoading && (
              <div className="z-40 select-date  border border-gray-400 choose-date rounded-md bg-white select-reminder-time-icon-blue">
                <DatePicker
                  autoComplete="off"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  placeholderText="HH:MM"
                  className="cursor-pointer"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="hh:mm aa"
                  filterTime={filterPassedTime}
                  onChange={(date) => {
                    if (date) {
                      setSelectedStartDate(date);
                      setScheduleAt(format(date, 'MM/dd/yyyy HH:mm'));
                      setSendNow(false);
                    }
                  }}
                  selected={selectedStartDate}
                  minDate={addDays(new Date(), 1)}
                />
              </div>
            )}
          </div>

          <div className="sm:ml-6 flex items-center mt-3 sm:mt-9 pb-3 sm:pb-0">
            <input
              type="checkbox"
              checked={campaignAssessmentSignature}
              className="appearance-none cursor-pointer h-5 w-5 border border-primary-light checked:bg-primary-light checked:border-transparent
            rounded-md form-tick margin-top-15"
              id="sign"
              onChange={(e) => setCampaignAssessmentSignature(e.target.checked)}
            />
            <label
              htmlFor="sign"
              className="pl-3 text-xsm cursor-pointer text-gray-750">
              Signature Required
            </label>
          </div>
          {errorMessage && (
            <div className="md:pb-0 md:mt-1 xl:pt-4 xl:pl-3 2xl:pl-5">
              <ErrorMessage message={String(errorMessage)} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
