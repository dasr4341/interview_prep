import React from 'react';
import DateFormat from 'components/DateFormat';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import {
  GetSurveysForPatient_pretaaHealthGetPatientSurveys,
  SurveyStatusTypePatient,
  UserTypeRole,
} from 'health-generatedTypes';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import useSelectedRole from 'lib/useSelectedRole';
import { formatDate } from 'lib/dateFormat';

export default function SurveyListRow({
  data,
  type,
}: {
  data: GetSurveysForPatient_pretaaHealthGetPatientSurveys;
  type: SurveyStatusTypePatient;
}) {
  const isSupporter = useSelectedRole({ roles: [UserTypeRole.SUPPORTER] });

  const navigate = useNavigate();
  function linkRef() {
    if (type === SurveyStatusTypePatient.OPEN && !isSupporter) {
      navigate(routes.patientSurveyList.submit.build(data.id));
    } else {
      navigate(routes.patientSurveyList.submitted.build(data.id));
    }
  }

  return (
    <>
      {data && (
        <div
          onClick={linkRef}
          className={'cursor-pointer'}
          key={data.id}>
          <div
            className={`flex justify-between py-6 px-2 sm:px-5 border-b border-gray-100 ${
              type === SurveyStatusTypePatient.OPEN ? ' bg-white' : ''
            }`}>
            <div className={`flex-col w-10/12 ${type === SurveyStatusTypePatient.OPEN ? 'font-bold' : ''}`}>
              <h3 className="text-base mt-1 ">{data.surveyTemplate?.name}</h3>
              <div className="normal-case italic text-gray-150 opacity-50 font-medium text-base">
                Assessment was issued on {formatDate({ date: data.createdAt })}
              </div>
            </div>
            <div className="flex items-center w-fit">
              {data.createdAt && type === SurveyStatusTypePatient.OPEN && (
                <div
                  className={'whitespace-nowrap font-medium text-sm px-1 sm:px-3 text-gray-600 border-r border-gray-400 h-6'}>
                  <DateFormat date={data.createdAt} />
                </div>
              )}
              {data.submissionDate && type === SurveyStatusTypePatient.COMPLETED && (
                <div className="whitespace-nowrap font-medium text-sm border-r h-6 border-gray-400 px-3 text-gray-600">
                  <DateFormat date={data.submissionDate} />
                </div>
              )}
              <DisclosureIcon className="ml-1 sm:ml-3" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
