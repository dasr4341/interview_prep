import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { routes } from 'routes';
import '../_assessment-template.scoped.scss';
import Popover, { PopOverItem } from 'components/Popover';
import {
  SurveyTemplateTypes,
  TemplateForCounsellors_pretaaHealthTemplatesForCounsellors,
} from 'health-generatedTypes';
import { getAppData } from 'lib/set-app-data';

export default function AssessmentTemplateRow({
  template,
}: {
  template: TemplateForCounsellors_pretaaHealthTemplatesForCounsellors;
}) {
  const navigate = useNavigate();
  const params = useParams();
  const appData = getAppData();

  return (
    <React.Fragment key={template.id}>
      <div className="flex items-center w-full border-b bg-white border-gray-100">
        <div
          className={`row-element text-xsm cursor-pointer leading-5 ${
            params.type === SurveyTemplateTypes.STANDARD ? 'w-1/2 2xl:w-2/3' : 'w-7/12'
          }`}
          onClick={() => {
            navigate(
              routes.assessmentTemplateDetails.build(String(template.id), {
                type: String(params.type)
              })
            );
          }}>
          <h3 className="text-pt-secondary font-semibold mb-1">
            {template.name}
          </h3>
          <p className="text-gray-600 mt-2">{template.description}</p>
        </div>
        {params.type === SurveyTemplateTypes.STANDARD && (
          <div className="row-element text-normal text-base text-pt-primary w-1/5 ">
            <span>{template.topic || 'N/A'}</span>
          </div>
        )}
        <div
          className={`row-element flex items-center  ${params.type === SurveyTemplateTypes.STANDARD ? 'w-1/5' : 'w-3/12 ml-2' }`}>
          <span>{template.totalCampaignCount || 0}</span>
        </div>
        {(params.type === SurveyTemplateTypes.CUSTOM && appData.selectedFacilityId && appData.selectedFacilityId.length > 1) &&  (
            <div
            className={`row-element flex items-center w-1/6`}>
            <span>{template.facilityName || 'N/A'}</span>
          </div>
        )}
        <div className="row-element w-1/12 flex items-center">
          <Popover triggerClass="text-gray-600 focus:text-pt-secondary pl-2">
            <PopOverItem
              onClick={() =>
                navigate(
                  routes.assessmentTemplatePreview.build(String(template.id))
                )
              }>
              Preview
            </PopOverItem>

            <PopOverItem
              onClick={() =>
                navigate(
                  routes.assessmentScheduleCreateCampaign.build(
                    String(template.id)
                  )
                )
              }>
              Schedule
            </PopOverItem>
            <PopOverItem
              onClick={() =>
                navigate(
                  routes.assessmentTemplateDetails.build(String(template.id))
                )
              }>
              Assessments
            </PopOverItem>
          </Popover>
        </div>
      </div>
    </React.Fragment>
  );
}
