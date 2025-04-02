/*  */
import React, { useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { routes } from 'routes';

import SurveyListRow from './SurveyListRow';
import SurveyListRowSkeletonLoading from '../skeletonLoading/SurveyListRowSkeletonLoading';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import {
  GetSurveysForPatient,
  GetSurveysForPatientVariables,
  GetSurveysForPatient_pretaaHealthGetPatientSurveys,
  SurveyStatusTypePatient,
} from 'health-generatedTypes';
import { getSurveysForPatient } from 'graphql/getSurveysForPatient.query';
import catchError from 'lib/catch-error';
import { config } from 'config';
import NoDataFound from 'components/NoDataFound';
import useQueryParams from 'lib/use-queryparams';
import SurveyFeedbackModal from './SurveyFeedbackModal';
import { useLazyQuery } from '@apollo/client';
import { range } from 'lodash';

interface PatientSurveysInterface {
  data?: GetSurveysForPatient_pretaaHealthGetPatientSurveys[];
  take: number;
  error?: string;
  moredata: boolean;
}
function getSearchedPhaseQueryData(query: string) {
  if (query) {
    return String(queryString.parse(query).searchedPhase);
  }
  return '';
}

export default function ListOpenOrCompleted() {
  const location = useLocation();
  const query = useQueryParams();
  const navigate = useNavigate();
  const [feedbackModal, setFeedbackModal] = useState(false);
  const ref = useRef<any>(null);
  const listType =
    routes.patientSurveyList.open.match === location.pathname
      ? SurveyStatusTypePatient.OPEN
      : SurveyStatusTypePatient.COMPLETED;
  const [searchedPhase, setSearchedPhase] = useState(
    getSearchedPhaseQueryData(location.search) ? getSearchedPhaseQueryData(location.search) : '',
  );
  const [surveyData, setSurveyData] = useState<PatientSurveysInterface>({
    take: config.pagination.defaultTake,
    data: [],
    moredata: true,
  });

  const [getSurveyData, { loading: templateLoading }] = useLazyQuery<
    GetSurveysForPatient,
    GetSurveysForPatientVariables
  >(getSurveysForPatient, {
    variables: {
      skip: 0,
      take: config.pagination.defaultTake,
      status: listType,
      searchPhrase: searchedPhase === 'undefined' ? '' : searchedPhase,
    },
    onCompleted: (d) => {
      if (d.pretaaHealthGetPatientSurveys) {
        const surveyArr = d.pretaaHealthGetPatientSurveys;
        setSurveyData({
          ...surveyData,
          data: (surveyData?.data?.length ? surveyData.data : []).concat(surveyArr),
          moredata: config.pagination.defaultTake <= surveyArr.length,
        });
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  function handleEndReach() {
    if (surveyData.moredata) {
      getSurveyData({
        variables: {
          skip: surveyData.data?.length,
        },
      });
    }
  }

  function footerComponent() {
    if (templateLoading) {
      return <SurveyListRowSkeletonLoading />;
    } else if (!surveyData.moredata) {
      return <div className="p-4 text-center text-gray-150 text-sm bg-gray-100">No more data</div>;
    }
    return <></>;
  }

  function rowRendererVirtue(i: number, e: GetSurveysForPatient_pretaaHealthGetPatientSurveys) {
    return (
      <SurveyListRow
        data={e}
        key={i}
        type={listType}
      />
    );
  }

  useEffect(() => {
    setSearchedPhase(() => getSearchedPhaseQueryData(location.search));
  }, [location.search]);

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      data: [],
      moredata: true,
    });

    getSurveyData({
      variables: {
        skip: 0,
      },
    });
  }, [searchedPhase, location.pathname]);

  useEffect(() => {
    if (query.showModal) {
      setFeedbackModal(true);
    }
  }, [query.showModal]);

  const modalClose = () => {
    setFeedbackModal(false);
    navigate(routes.patientSurveyList.open.match);
  };

  return (
    <ContentFrame>
      {templateLoading && surveyData.data?.length === 0 && (
        <React.Fragment>
          {range(0, 7).map((el) => (
            <div key={el}>
              <SurveyListRowSkeletonLoading />
            </div>
          ))}
        </React.Fragment>
      )}

      {!!surveyData?.data?.length && (
        <Virtuoso
          style={{ height: '70vh' }}
          ref={ref}
          data={surveyData.data}
          endReached={handleEndReach}
          itemContent={rowRendererVirtue}
          components={{ Footer: footerComponent }}
        />
      )}
      {searchedPhase && !feedbackModal && !templateLoading && surveyData.data?.length === 0 ? (
        <div className=" h-max flex justify-center items-center min-h-80 md:min-h-70">
          <NoDataFound
            type="SEARCH"
            heading="No results"
            content="Refine your search and try again"
          />
        </div>
      ) : (
        ''
      )}
      {searchedPhase === '' && !templateLoading && surveyData.data?.length === 0 ? (
        <div className=" h-max flex justify-center items-center min-h-80 md:min-h-70">
          <NoDataFound
            type="NODATA"
            heading={`No ${
              location.pathname === routes.patientSurveyList.open.match ? 'open' : 'completed'
            } assessments yet`}
          />
        </div>
      ) : (
        ''
      )}
      {feedbackModal && <SurveyFeedbackModal onClose={() => modalClose()} />}
    </ContentFrame>
  );
}
