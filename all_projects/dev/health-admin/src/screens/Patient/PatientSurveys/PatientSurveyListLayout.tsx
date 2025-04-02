/*  */
import React, { useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { routes } from 'routes';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { SurveyStatusTypePatient } from 'health-generatedTypes';
import { buildUrl } from 'router/lib-router';
import CustomSearchField from 'components/CustomSearchField';

export default function PatientSurveyListLayout() {
  const params = useParams();
  const [searchedPhase, setSearchedPhase] = useState('');

 

  return (
    <>
      <ContentHeader
        className="shadow-none"
        link={params.eventId ? routes.eventDetailsPage.build(String(params.eventId)) : routes.patientDetails.build(String(params.id))}
        title="Assessments">
        <div className="flex items-center space-x-4">
        <CustomSearchField
                      defaultValue={searchedPhase}
                      onChange={setSearchedPhase}
                    />
        </div>
      </ContentHeader>
      <div className="flex pt-2 md:pt-0 space-x-6 px-6 lg:px-16 bg-white">
        <NavLink
         onClick={() => setSearchedPhase('')}
          to={params.eventId
              ? routes.eventAssessmentsPage.eventOpenOrCompletedAssessment.build(
                String(params.eventId),
                  String(params.id),
                  SurveyStatusTypePatient.COMPLETED
                )
              : buildUrl(
                  routes.patientSurvey.openOrCompletedSurvey.build(
                    String(params.id),
                    SurveyStatusTypePatient.COMPLETED
                  ),
                  searchedPhase
                )
          }
          className={({ isActive }) =>
            `py-1 px-4 text-primary mr-2 font-bold  ${
              isActive ? 'activeTabClasses' : ''
            }`
          }>
          Complete
        </NavLink>
        <NavLink
        onClick={() => setSearchedPhase('')}
          to={params.eventId
          ? routes.eventAssessmentsPage.eventOpenOrCompletedAssessment.build(
            String(params.eventId),
              String(params.id),
              SurveyStatusTypePatient.OPEN
            )
          : buildUrl(
              routes.patientSurvey.openOrCompletedSurvey.build(
                String(params.id),
                SurveyStatusTypePatient.OPEN
              ),
              searchedPhase
            )}
          className={({ isActive }) =>
            `py-1 px-4 text-primary font-bold ${
              isActive ? 'activeTabClasses' : ''
            }`
          }>
          Incomplete
        </NavLink>
      </div>

      <ContentFrame className="h-full">
        <Outlet />
      </ContentFrame>
    </>
  );
}
