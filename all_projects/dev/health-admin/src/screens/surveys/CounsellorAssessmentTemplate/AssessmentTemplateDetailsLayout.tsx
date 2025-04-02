/*  */
import React from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { routes } from 'routes';
import { Skeleton } from '@mantine/core';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { GetSurveyTemplateForPatient, GetSurveyTemplateForPatientVariables } from 'health-generatedTypes';
import { useQuery } from '@apollo/client';
import catchError from 'lib/catch-error';
import { getSurveyTemplateForPatientQuery } from 'graphql/getSurveyTemplateForPatient.query';
import { CampaignDetailsOutlet } from '../SchedulingManager/useCampaignDetailsOutletContext';

export default function AssessmentTemplateDetailsLayout() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const { data: templateTitle, loading } = useQuery<
  GetSurveyTemplateForPatient, GetSurveyTemplateForPatientVariables
  >(getSurveyTemplateForPatientQuery, {
    variables: {
      templateId: String(templateId)
    },
    onError: (e) => catchError(e, true)
  });

  return (
    <>
      <ContentHeader className="lg:sticky">
        <React.Fragment>
          <div className="block sm:flex sm:justify-between heading-area">
            <div className="header-left sm:w-8/12 2xl:w-4/5 ">
              <div className="flex items-center mb-5 mt-2">
                {loading && (
                  <Skeleton
                  width={window.innerWidth < 640 ? '90%' : 400}
                  height={24}
                  mt={4}
                />
                )}
                {!loading && (
                  <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mr-2">
                    {templateTitle?.pretaaHealthGetTemplate?.name || 'N/A'}
                  </h1>
                )}
              </div>
            </div>
            <div className="header-right min-w-fit my-3 sm:my-0">
              <Button
                onClick={() =>
                  navigate(
                    routes.assessmentScheduleCreateCampaign.build(
                      String(templateId)
                    )
                  )
                }
                className="flex justify-end">
                Schedule New
              </Button>
            </div>
          </div>
        </React.Fragment>
      </ContentHeader>

      <ContentFrame className="h-full">
        <Outlet context={{ templateType: templateTitle?.pretaaHealthGetTemplate?.type } as  CampaignDetailsOutlet} />
      </ContentFrame>
    </>
  );
}
