import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import { SurveyCountPerParticipantType, UserPermissionNames, GetTemplateForCampaign, GetTemplateForCampaignVariables } from 'health-generatedTypes';
import { useLazyQuery } from '@apollo/client';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import queryString from 'query-string';
import { Skeleton } from '@mantine/core';
import catchError from 'lib/catch-error';
import CustomSearchField from 'components/CustomSearchField';
import { CampaignDetailsOutlet } from './useCampaignDetailsOutletContext';
import { getTemplateForCampaign } from 'graphql/getTemplateForCampagin.query';


export default function ScheduleManagerDetailLayoutView() {
  const navigate = useNavigate();
  const params: { templateId: string } = useParams() as any;
  const query = queryString.parse(location.search) as unknown as { templateStatus: boolean };
  const [searchedPhase, setSearchedPhase] = useState('');

  // ****** GETTING TEMPLATE DATA *********
   const [getTemplateDataCallBack, { loading: templateDataLoading, data: templateDetails } ] = useLazyQuery<
   GetTemplateForCampaign,
   GetTemplateForCampaignVariables
  >(getTemplateForCampaign, {
    onError: (e) => catchError(e, true)
  });

  useEffect(() => {
    if (params.templateId) {
      getTemplateDataCallBack({
      variables:{
          templateId: params.templateId
        }
      });
    }
  }, [params.templateId, getTemplateDataCallBack]);

  const disabledStatus = () => {
    if (String(query.templateStatus) === 'false') {
      return { templateStatus: false };
    } else if (String(query.templateStatus) === 'true') {
      return { templateStatus: true };
    }
  };

  return (
    <>
      <ContentHeader className="lg:sticky shadow-none">
        <>
          <div className="block sm:flex sm:justify-between heading-area">
            <div className="header-left sm:w-8/12 2xl:w-4/5">
              {templateDataLoading && (
                <Skeleton
                  width={window.innerWidth < 640 ? '90%' : 400}
                  height={24}
                  className="mb-5 mt-2"
                />
              )}
              {!templateDataLoading && (
                <div className='flex items-center mb-5 mt-2'>
                  <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mr-2">{templateDetails?.pretaaHealthGetTemplate?.name || 'N/A'} </h1>
                  {(String(query.templateStatus) === 'false') &&
                      <span className="rounded-full bg-primary-light px-5 py-1 text-xs text-white">Disabled</span>}
                </div>
              )}
            </div>
            <div className="header-right min-w-fit my-3 sm:my-0">
              {useGetPrivilege(UserPermissionNames.CAMPAIGN_SCHEDULER, CapabilitiesType.CREATE) &&
                (!query.templateStatus || String(query.templateStatus) === 'true') && (
                  <Button
                    className="flex justify-end lg:px-9 xl:px-14 2xl:px-12"
                    onClick={() => navigate(routes.scheduleManagerDetail.scheduleCampaign.build(params.templateId))}>
                    Schedule New
                  </Button>
                )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <CustomSearchField
              defaultValue={searchedPhase}
              onChange={setSearchedPhase}
            />
          </div>
        </>
      </ContentHeader>
      <div className="flex pt-2 md:pt-0 px-6 lg:px-16 bg-white">
        <NavLink
          to={routes.scheduleManagerDetail.listCampaigns.build(String(params.templateId), SurveyCountPerParticipantType.MULTIPLE, disabledStatus())}
          className={({ isActive }) => `py-1 px-2 sm:px-4 text-primary mr-2 font-bold  ${isActive ? 'activeTabClasses' : ''}`}>
          Recurring
        </NavLink>
        <NavLink
          to={routes.scheduleManagerDetail.listCampaigns.build(String(params.templateId), SurveyCountPerParticipantType.SINGLE, disabledStatus())}
          className={({ isActive }) => `py-1 px-2 sm:px-4 text-primary font-bold ${isActive ? 'activeTabClasses' : ''}`}>
          One-time Event
        </NavLink>
      </div>

      <ContentFrame className="h-full">
        <Outlet context={{ templateType: templateDetails?.pretaaHealthGetTemplate?.type } as  CampaignDetailsOutlet} />
      </ContentFrame>
    </>
  );
}
