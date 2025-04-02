import React, { useContext, useEffect, useState } from 'react';
import './_assessment-template.scoped.scss';
import {
  SurveyTemplateTypes,
  TemplateForCounsellors,
  TemplateForCounsellorsVariables,
  TemplateForCounsellors_pretaaHealthTemplatesForCounsellors,
} from 'health-generatedTypes';
import { useLazyQuery } from '@apollo/client';
import { getTemplateForCounsellor } from 'graphql/getTemplateForCounsellor.query';
import { config } from 'config';
import catchError from 'lib/catch-error';
import { useParams } from 'react-router-dom';
import NoDataFound from 'components/NoDataFound';
import { useViewportSize } from '@mantine/hooks';
import { Virtuoso } from 'react-virtuoso';
import AssessmentTemplateRow from './component/AssessmentTemplateRow';
import AssessmentTemplateSkeleton from './component/AssessmentTemplateSkeleton';
import { HeaderContext } from 'components/ContentHeaderContext';
import useQueryParams from 'lib/use-queryparams';
import { getAppData } from 'lib/set-app-data';
import { getSearchedPhaseQuery } from 'components/lib/CustomSearchFieldLib';
import { range } from 'lodash';
export interface GetClinicalTemplate {
  data: TemplateForCounsellors_pretaaHealthTemplatesForCounsellors[];
  moreData: boolean;
}

export default function AssessmentTemplatePage() {
  const params = useParams();
  const query = useQueryParams();
  const [searchedPhase, setSearchedPhase] = useState('');
  const [templatesData, setTemplatesData] = useState<GetClinicalTemplate>({
    data: [],
    moreData: false,
  });
  function rowRendererVirtue(i: number, e: TemplateForCounsellors_pretaaHealthTemplatesForCounsellors) {
    return (
      <AssessmentTemplateRow
        key={i}
        template={e}
      />
    );
  }

  const [getTemplateData, { loading: templateLoading }] = useLazyQuery<
    TemplateForCounsellors,
    TemplateForCounsellorsVariables
  >(getTemplateForCounsellor, {
    variables: {
      skip: 0,
      take: config.pagination.defaultTake,
      type: params.type as SurveyTemplateTypes,
      searchPhrase: searchedPhase
    },
    onCompleted: (d) => {
      if (d.pretaaHealthTemplatesForCounsellors) {
        setTemplatesData({
          moreData: d.pretaaHealthTemplatesForCounsellors.length === config.pagination.defaultTake,
          data: (templatesData?.data.length ? templatesData.data : []).concat(d.pretaaHealthTemplatesForCounsellors),
        });
      }
    },
    onError: (e) => {
      catchError(e, true)
  }
    ,
  });

  function handleEndReach() {
    if (templatesData.moreData) {
      getTemplateData({
        variables: {
          skip: templatesData.data.length,
          type: params.type as SurveyTemplateTypes,
        },
      });
    }
  }

  useEffect(() => {
    setTemplatesData({
      data: [],
      moreData: true,
    });

    getTemplateData();
  }, [params.type, searchedPhase]);

  function footerComponent() {
    if (templateLoading) {
      return <AssessmentTemplateSkeleton />;
    } else if (!templatesData.moreData) {
      return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
    }
    return <></>;
  }
  const { height, width } = useViewportSize();

  const { headerHeight } = useContext(HeaderContext);
  const [resHeight, setResHeight] = useState('100vh');

  useEffect(() => {
    if (width > 1024) {
      const pureHeaderHeight = headerHeight + 150;
      setResHeight(`${height - pureHeaderHeight}px`);
    }
  }, [width, headerHeight]);
  const appData = getAppData();

   // set value from the params
   useEffect(() => {
    setSearchedPhase(getSearchedPhaseQuery(location.search) || '');
  }, [location.search]);
  

  return (
    <div>
      {templatesData.data.length > 0 && (
        <div className="overflow-x-scroll">
          <div className="w-full min-w-900">
              <div className="bg-gray-50 header-table flex w-full pt-5 sm:pt-0 border-b border-gray-300 ">
                <div
                  className={`row-header font-bold text-base ${
                    params.type === SurveyTemplateTypes.STANDARD ? ' w-1/2 2xl:w-2/3' : 'w-7/12'
                  }`}>
                  Template Name
                </div>
                {params.type === SurveyTemplateTypes.STANDARD && (
                  <div className="row-header font-bold text-base w-1/5">Topic</div>
                )}
                <div
                  className={`row-header font-bold text-base ${
                    params.type === SurveyTemplateTypes.STANDARD ? 'w-1/5' : 'w-4/12'
                  }`}>
                  # of Assessments
                </div>
                {params.type === SurveyTemplateTypes.CUSTOM && appData.selectedFacilityId && appData.selectedFacilityId.length > 1 && (
                  <div
                    className={`row-header font-bold text-base w-1/5`}>
                    Facility Name
                  </div>
                )}
                <div className="row-header font-bold text-base w-1/12" />
              </div>

              <div className="w-full bg-white">
                <Virtuoso
                  style={{ height: resHeight }}
                  data={templatesData.data}
                  endReached={handleEndReach}
                  itemContent={rowRendererVirtue}
                  components={{ Footer: footerComponent }}
                />
              </div>
          </div>
        </div>
      )}

      {(templateLoading && templatesData.data.length === 0) && (
        <React.Fragment>
          { range(0, 6).map(el => (
           <div key={el}><AssessmentTemplateSkeleton /></div>
          )) }
        </React.Fragment>
      )}

      {query.searchedPhase !== '' && !templateLoading && templatesData.data?.length === 0 && (
        <div
          className="h-max flex justify-center items-center"
          style={{ height: resHeight }}>
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
          style={{ height: resHeight }}>
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
