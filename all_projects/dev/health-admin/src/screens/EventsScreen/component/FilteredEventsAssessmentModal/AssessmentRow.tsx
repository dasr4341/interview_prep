import { Spoiler } from '@mantine/core';
import DateFormat from 'components/DateFormat';
import SafeHtml from 'components/SafeHtml';
import { AssessmentEventList_pretaaHealthAssessmentEventList } from 'health-generatedTypes';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { config } from 'config';
import { format } from 'date-fns';

export default function AssessmentRow({
  assessment,
}: {
  assessment: AssessmentEventList_pretaaHealthAssessmentEventList;
}) {

  const navigate = useNavigate();

  return (
    <div className={'flex bg-gray-50 flex-col px-3 md:px-5 border-b border-gray-100 relative '}>
      <div className="flex items-center space-x-3 md:space-x-4">
        <span className="link no-underline hidden"></span>
        <div className="flex-1 cursor-pointer py-6">
          <Spoiler
            maxHeight={70}
            showLabel="Show more"
            hideLabel="Hide"
            transitionDuration={0}>
            <div
              onClick={() => {
                navigate(
                  routes.eventSurveyDetailsPage.build(
                    String(assessment.surveyAssignmentDetails?.id),
                    String(assessment.patientId),
                    String(assessment.id)
                  )
                );
              }}>
              <div className="flex flex-col">
                <h3 className="font-semibold text-xs text-primary opacity-50 mb-0 uppercase">
                  {assessment.type.replaceAll('_', ' ')}
                </h3>
                <div className="opacity-75 line-clamp-7">
                  <div className="mt-0 font-bold note-text capitalize">
                    <SafeHtml rawHtml={String(assessment.text)} />
                  </div>
                </div>
              </div>

              <div className="normal-case italic text-gray-150 opacity-50 font-medium text-base">
                Assessment was issued on {format(new Date(assessment.createdAt), config.dateFormat)}
              </div>
            </div>
          </Spoiler>
        </div>

        <span className="text-sm text-gray opacity-50">
          <DateFormat date={assessment.createdAt} />
        </span>
      </div>
    </div>
  );
}
