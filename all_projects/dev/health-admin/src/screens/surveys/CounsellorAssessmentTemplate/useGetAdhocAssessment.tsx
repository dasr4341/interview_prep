import { useLazyQuery } from '@apollo/client';
import { getAdhocAssessmentForCounsellor } from 'graphql/getAdhocAssessmentForCounsellor.query';
import {
  GetAdHocSurveyForCounsellors,
  GetAdHocSurveyForCounsellorsVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AdhocAssessment,
} from './lib/assessment-template-interface';

export default function useGetAdhocAssessment() {
  const { assessmentId, duplicateId } = useParams();

  const [adhocData, setAdhocData] = useState<AdhocAssessment>();

  const [getAdhocAssessment, { loading: adhocLoading }] = useLazyQuery<
    GetAdHocSurveyForCounsellors,
    GetAdHocSurveyForCounsellorsVariables
  >(getAdhocAssessmentForCounsellor, {
    onCompleted: (d) => {
      if (d?.pretaaHealthGetAdHocSurveyForCounsellors) {
        const data = d.pretaaHealthGetAdHocSurveyForCounsellors;
        const patientList =
        d.pretaaHealthGetAdHocSurveyForCounsellors?.surveyReceipientList?.map((el) => {
          return {
            userId: el.patientId,
            firstName: el.patientFirstName as string,
            lastName: el.patientLasttName as string,
            id: el.patientId,
          };
        }) || [];
        setAdhocData({
          published: data.published,
          publishedAt: data.publishedAt,
          scheduledAt: data.scheduledAt,
          assessmentAssignmentList:
          patientList,
          assessmentId: data.surveyId,
          campaignAssessmentSignature: data.campaignSurveySignature
        });
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    if (assessmentId || duplicateId) {
      getAdhocAssessment({
        variables: {
          surveyId: (assessmentId || duplicateId) as string
        },
      });
    }
  // 
  }, [assessmentId, duplicateId]);

  return {
    adhocLoading,
    adhocData
  };
}
