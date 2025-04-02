import React, { useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { routes } from 'routes';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { useLazyQuery } from '@apollo/client';
import { GetStandardTemplate, GetStandardTemplateVariables } from 'health-generatedTypes';
import { getStandardTemplateQuery } from 'graphql/getStandardTemplate.quey';

export default function SurveyDetails() {
  const { templateId } = useParams();

    // GETTING DATA
    const [
      getStandardTemplateCallBack,
      { loading: getStandardTemplateLoading, data: standardTemplateData },
    ] = useLazyQuery<GetStandardTemplate, GetStandardTemplateVariables>(getStandardTemplateQuery);
  
    useEffect(() => {
      getStandardTemplateCallBack({
        variables: {
          templateId: String(templateId),
        },
      });
      // 
    }, [useParams]);
  
  return (
    <div>
      <ContentHeader 
        titleLoading={getStandardTemplateLoading} title={standardTemplateData?.pretaaHealthAdminGetTemplate?.name} className=" capitalize">
        <div className="flex bg-white border-b">
          <NavLink
            to={`${routes.owner.surveyDetails.details.build(String(templateId))}${location.search}`}
            className={({ isActive }) => `py-1 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`}>
            Details
          </NavLink>
          <NavLink
            to={routes.owner.surveyDetails.jsonView.build(String(templateId))}
            className={({ isActive }) => `py-1 ml-5 px-2 text-primary font-bold ${isActive ? 'activeTabClasses' : ''}`}>
            JSON
          </NavLink>
        </div>
      </ContentHeader>
      <ContentFrame className="flex flex-col flex-1">
        <Outlet />
      </ContentFrame>
    </div>
  );
}
