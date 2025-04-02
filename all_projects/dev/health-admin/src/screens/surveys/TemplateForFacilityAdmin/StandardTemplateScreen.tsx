import React, { useContext, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useViewportSize } from '@mantine/hooks';

import { surveyTemplateListQuery } from 'graphql/surveyTemplateList.query';
import {
  DuplicateSurveyTemplate,
  DuplicateSurveyTemplateVariables,
  PretaaHealthGetTemplates,
  PretaaHealthGetTemplatesVariables,
  PretaaHealthGetTemplates_pretaaHealthGetTemplates,
  SurveyTemplateTypes,
  UserTypeRole,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { config } from 'config';
import NoDataFound from 'components/NoDataFound';
import { useLazyQuery, useMutation } from '@apollo/client';
import StandardTemplateView from '../components/templates/standard-template-view';
import '../components/_survey-template.scoped.scss';
import SurveyTemplateListRowSkeletonLoading from '../Patient/skeletonLoading/SurveyTemplateListRowSkeletonLoading';
import { duplicateSurveyTemplate } from 'graphql/duplicateSurveyTemplate.query';
import { toast } from 'react-toastify';
import messagesData from 'lib/messages';
import { HeaderContext } from 'components/ContentHeaderContext';
import useQueryParams from 'lib/use-queryparams';
import { getSearchedPhaseQuery } from 'components/lib/CustomSearchFieldLib';
import { getAppData } from 'lib/set-app-data';
import useRole from 'lib/useRole';

export interface SurveyTemplateList {
  data: PretaaHealthGetTemplates_pretaaHealthGetTemplates[];
  moreData: boolean;
}

export default function StandardTemplateScreen() {
  const appData = getAppData();
  const [duplicateState, setDuplicateState] = useState(false);
  const [searchedPhase, setSearchedPhase] = useState('');
  const isAdmin = useRole({ roles: [UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });
  const locationType = location.pathname.includes('mobile-template/standard') ?
    SurveyTemplateTypes.STANDARD : SurveyTemplateTypes.CUSTOM;
  const [templatesData, setTemplatesData] = useState<SurveyTemplateList>({
    data: [],
    moreData: true,
  });
  const query = useQueryParams();

  const [getStandardTemplateData, { loading: templateLoading }] = useLazyQuery<
    PretaaHealthGetTemplates,
    PretaaHealthGetTemplatesVariables
  >(surveyTemplateListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetTemplates) {
        setTemplatesData({
          moreData: d.pretaaHealthGetTemplates.length === config.pagination.defaultTake,
          data: (templatesData?.data.length ? templatesData.data : []).concat(d.pretaaHealthGetTemplates),
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [duplicateSurvey] = useMutation<DuplicateSurveyTemplate, DuplicateSurveyTemplateVariables>(
    duplicateSurveyTemplate
  );

  function getID(id: string) {
    duplicateSurvey({
      variables: {
        surveyTemplateId: id,
      },
      onCompleted: () => {
        getStandardTemplateData({
          onCompleted: (d) => {
            if (d.pretaaHealthGetTemplates) {
              setTemplatesData({
                moreData: d.pretaaHealthGetTemplates.length === config.pagination.defaultTake,
                data: d.pretaaHealthGetTemplates,
              });
              
            }
          },
        });
        setDuplicateState(true);
        toast.success(messagesData.successList.duplicateTemplate);
      },
      onError: (e) => catchError(e, true),
    });
  }

  function handleEndReach() {
    if (templatesData.moreData) {
      getStandardTemplateData({
        variables: {
          skip: templatesData.data.length
        }
      });
    }
  }


  function rowRendererVirtue(i: number, e: PretaaHealthGetTemplates_pretaaHealthGetTemplates) {
    return (
      <StandardTemplateView
        template={e}
        key={i}
        updateHandler={setTemplatesData}
        duplicateSurvey={() => getID(String(e.id))}
      />
    );
  }

  useEffect(() => {
    setTemplatesData({
      data: [],
      moreData: true,
    });
    setDuplicateState(false);
    getStandardTemplateData(
      {
        variables: {
          skip: 0,
          take: config.pagination.defaultTake,
          type: locationType,
          searchPhrase: searchedPhase
        },
      }
    );
 
  }, [searchedPhase, duplicateState, locationType]);

     // set value from the params
     useEffect(() => {
      setSearchedPhase(getSearchedPhaseQuery(location.search) || '');
    }, [location.search]);

  function footerComponent() {
    if (templateLoading) {
      return <SurveyTemplateListRowSkeletonLoading numberOfRow={1} />;
    } else if (!templatesData.moreData) {
      return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
    }
    return <></>;
  }

  const { height } = useViewportSize();

  const { headerHeight } = useContext(HeaderContext);

  return (
    <div>
      {templatesData.data.length > 0 && (
        <div className="overflow-x-scroll">
          <div className="w-full min-w-900">
            <div className="bg-gray-50 header-table flex w-full pt-5 sm:pt-0 border-b border-gray-300 ">
              <div
                className={`row-header font-bold text-base ${
                  locationType === SurveyTemplateTypes.STANDARD ? 'w-1/2 2xl:w-2/3' : 'w-7/12'
                }`}>
                Template Name
              </div>
              {locationType === SurveyTemplateTypes.STANDARD && (
                <div className="row-header font-bold text-base w-1/5">Topic</div>
              )}
              <div
                className={`row-header font-bold text-base ${
                  locationType === SurveyTemplateTypes.STANDARD ? 'w-1/5' : 'w-5/12'
                }`}>
                # of Assessments
              </div>
              {locationType === SurveyTemplateTypes.CUSTOM && appData.selectedFacilityId && appData.selectedFacilityId.length > 1 && (
                  <div
                  className={`row-header font-bold text-base w-5/12`}>
                  Facility Name
                </div>
              )}
              <div className={`${(appData.selectedFacilityId?.length === 1 && isAdmin) ? 'w-1/12 row-header font-bold text-base' : ''}`}/>
              <div className="font-bold text-base pr-10 flex flex-row invisible ">..</div>
            </div>

            <div className="w-full bg-white">
              <Virtuoso
                style={{ height: `${height - headerHeight - 145}px` }}
                data={templatesData.data}
                endReached={handleEndReach}
                itemContent={rowRendererVirtue}
                components={{ Footer: footerComponent }}
              />
            </div>
          </div>
        </div>
      )}

      {templateLoading && templatesData.data.length === 0 && <SurveyTemplateListRowSkeletonLoading numberOfRow={6} />}
      {query.searchedPhase !== '' && !templateLoading && templatesData.data?.length === 0 && (
        <div
          className="flex justify-center items-center"
          style={{ height: `${height - headerHeight - 145}px` }}>
          <NoDataFound
            type="SEARCH"
            heading="No results"
            content="Refine your search and try again"
          />
        </div>
      )}

      {query.searchedPhase === '' && !templateLoading && templatesData.data?.length === 0 && (
        <div
          className="flex justify-center items-center h-5/6"
          style={{ height: `${height - headerHeight - 145}px` }}>
          <NoDataFound
            type="NODATA"
            heading="No assessment templates yet"
            content="Please wait for next assessment template."
          />
        </div>
      )}
    </div>
  );
}
