import React, { FC } from 'react';
import { LabeledValue } from 'components/LabeledValue';
import ScoreImg from '../../../assets/images/score-image.jpg';
import DateFormat from 'components/DateFormat';

interface Props {
  surveyResults: string;
  dateSubmitted: string;
  surveyRespondent: string;
  surveyCompany: string;
  surveyEmail: string;
}

const PossibleReferenceCustomerNPS: FC<Props> = ({
  surveyResults,
  dateSubmitted,
  surveyRespondent,
  surveyCompany,
  surveyEmail,
}) => {
  return (
    <>
      <div
        className="bg-white
          px-5 py-6 border border-gray-200 rounded-xl">
        <div className="grid grid-cols-3 gap-4">
          <LabeledValue label="Survey Results">{surveyResults}</LabeledValue>
          <LabeledValue label="Date submitted">
            <DateFormat date={dateSubmitted} />
          </LabeledValue>
        </div>
        <div className="pt-6 pl-3">
          <p className="mb-4">Survey Score Details:</p>
          <img src={ScoreImg} alt="" className="w-7/12" />
        </div>
        <LabeledValue label="Survey Respondent">
          {surveyRespondent}
          <br />
          {surveyCompany}
          <br />
          {surveyEmail}
        </LabeledValue>
      </div>
    </>
  );
};

export default PossibleReferenceCustomerNPS;
