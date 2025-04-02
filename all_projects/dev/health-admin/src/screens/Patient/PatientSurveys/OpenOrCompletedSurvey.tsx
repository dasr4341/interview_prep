import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';

import SurveyListRowSkeletonLoading from 'screens/surveys/Patient/skeletonLoading/SurveyListRowSkeletonLoading';
import SurveyRowView from './SurveyRowView';
import {
  GetPatientSurveysForCounsellor,
  GetPatientSurveysForCounsellorVariables,
  GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor,
  SurveyStatusTypePatient,
} from 'health-generatedTypes';

import { getPatientSurveyList } from 'graphql/getPatientSurveyList.query';
import { config } from 'config';
import catchError from 'lib/catch-error';
import NoDataFound from 'components/NoDataFound';
import useQueryParams from 'lib/use-queryparams';
import { range } from 'lodash';

interface PatientSurveysListInterface {
  data: GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor[];
  moreData: boolean;
}

export default function OpenOrCompletedSurvey() {
  const params: { type: SurveyStatusTypePatient; id: string } = useParams() as any;
  const [surveyData, setSurveyData] = useState<PatientSurveysListInterface>({
    data: [],
    moreData: true,
  });
  const query = useQueryParams();

  const [getSurveyList, { loading: surveyListLoading }] = useLazyQuery<
    GetPatientSurveysForCounsellor,
    GetPatientSurveysForCounsellorVariables
  >(getPatientSurveyList, {
    variables: {
      skip: 0,
      take: config.pagination.defaultTake,
      patientId: String(params.id),
      status: params.type,
      searchPhrase: query.searchedPhase,
    },
    onCompleted: (d) => {
      if (d.pretaaHealthGetPatientSurveysForCounsellor) {
        setSurveyData({
          moreData: config.pagination.defaultTake <= d.pretaaHealthGetPatientSurveysForCounsellor.length,
          data: (surveyData?.data.length ? surveyData.data : []).concat(d.pretaaHealthGetPatientSurveysForCounsellor),
        });
      }
    },
    onError: (e) => toast.error(catchError(e, true)),
  });

  function footerComponent() {
    if (surveyListLoading) {
      return <SurveyListRowSkeletonLoading />;
    }
    return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
  }

  function rowRendererVirtue(i: number, e: GetPatientSurveysForCounsellor_pretaaHealthGetPatientSurveysForCounsellor) {
    return <SurveyRowView data={e} type={params.type} />;
  }
  function handleEndReach() {
    if (surveyData.moreData) {
      getSurveyList({
        variables: {
          skip: surveyData.data.length,
          patientId: params.id,
          status: params.type,
        },
      });
    }
  }

  useEffect(() => {
    setSurveyData({
      data: [],
      moreData: true,
    });
    getSurveyList();
  }, [query.searchedPhase, location.pathname]);

  return (
    <div>
      {surveyListLoading && surveyData.data.length === 0 && (
         <>
         {range(0, 7).map(el => (
           <React.Fragment key={el}><SurveyListRowSkeletonLoading /></React.Fragment>
         ))}
         </>
      )}

      {surveyData.data.length > 0 && (
        <Virtuoso
          style={{ height: '70vh' }}
          data={surveyData.data}
          endReached={handleEndReach}
          itemContent={rowRendererVirtue}
          components={{ Footer: footerComponent }}
        />
      )}
      {(query.searchedPhase && !surveyListLoading && surveyData.data?.length === 0) && (
        <div className=" h-max flex justify-center items-center min-h-80 md:min-h-70">
          <NoDataFound type="SEARCH" heading="No results" content="Refine your search and try again" />
        </div>
      )}
      {(!query.searchedPhase && !surveyListLoading && surveyData.data?.length === 0) && (
        <div className=" h-max flex justify-center items-center min-h-80 md:min-h-70">
          <NoDataFound type="NODATA" heading={`No ${params.type === SurveyStatusTypePatient.COMPLETED ? 'complete' : 'incomplete'} assessments yet`} />
        </div>
      )}
    </div>
  );
}
