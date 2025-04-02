import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { surveyDetailsQuery } from 'graphql/survey-details.query';
import { surveyDetailsForFacility } from 'graphql/survey-details-for-facility.query';
import {
  FacilitySurveyWithAnswer,
  FacilitySurveyWithAnswerVariables,
  FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer,
  FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields,
  GetPatientSurvey,
  GetPatientSurveyVariables,
  UserTypeRole,
  GetSurveyHealthReportPdf,
  GetSurveyHealthReportPdfVariables,
} from 'health-generatedTypes';
import SkeletonLoading from 'components/SkeletonLoading';
import catchError from 'lib/catch-error';
import SurveySubmittedAnswer from './SurveySubmittedAnswer';
import SurveyFormSubmittedHeader from '../SurveyFormSubmittedHeader';
import { FormSubmittedRowFooter } from 'screens/surveys/FormSubmittedRowFooter';
import { config } from 'config';
import { format } from 'date-fns';
import downloadIcon from 'assets/icons/download_icon_blue.svg';
import './_form-submitted-row.scoped.scss';

import EventCardView from '../../../EventsScreen/component/EventCard';
import { CustomSurveyDetails } from 'interface/custom-survey-details.interface';
import SurveyNameCardView from './SurveyNameCardView';
import { getSurveyHealthReportPdf } from 'graphql/getSurveyHealthReportPdf.query';
import Button from 'components/ui/button/Button';
import Logo from '../../../../assets/images/logo-small.svg';
import PdfLogo from '../../../../assets/images/footer-logo.png';
import { toast } from 'react-toastify';
import useSelectedRole from 'lib/useSelectedRole';
import { utcToZonedTime } from 'date-fns-tz';
import { cloneDeep } from 'lodash';
import shortid from 'shortid';

export default function FormSubmittedRow({
  timeZoneUpdater,
  surveyId,
  userId,
  eventId,
  token,
}: {
  timeZoneUpdater: React.Dispatch<React.SetStateAction<string>>,
  surveyId: string;
  userId?: string;
  eventId?: string;
  token?: string;
}) {
  const [facilitySurveyData, setFacilitySurveyData] = useState<FacilitySurveyWithAnswer>();
  const isClinician = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR, UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });
  const isEndUser = useSelectedRole({ roles: [UserTypeRole.PATIENT, UserTypeRole.SUPPORTER] });
  const [surveyDetails, setSurveyDetails] = useState<CustomSurveyDetails>({
    name: null,
    submissionDate: null,
    createdAt: null,
    templateText: null,
    surveyTemplateTitle: '',
    signature: null,
    patientFirstName: null,
    patientLastName: null,
  });

  const [skipIndexIds, setSkipIndexIds] = useState<number[]>([]);

  const [patientSurveyData, { data: surveyData, loading: surveyDataLoading }] = useLazyQuery<
    GetPatientSurvey,
    GetPatientSurveyVariables
  >(surveyDetailsQuery, {
    variables: {
      surveyId: surveyId,
    },
    onCompleted: (d) => {
      setSurveyDetails({
        name:
          d.pretaaHealthGetPatientSurvey?.surveyTemplate?.name || d.pretaaHealthGetPatientSurvey.surveyTemplate?.title,
        submissionDate: d.pretaaHealthGetPatientSurvey.submissionDate,
        createdAt: d.pretaaHealthGetPatientSurvey.createdAt,
        templateText: d.pretaaHealthGetPatientSurvey.surveyTemplate?.templateInfo as string,
        surveyTemplateTitle: d.pretaaHealthGetPatientSurvey.surveyTemplate?.title
          ? d.pretaaHealthGetPatientSurvey.surveyTemplate?.title
          : '',
        signature: d.pretaaHealthGetPatientSurvey.signature,
        patientFirstName: String(d.pretaaHealthGetPatientSurvey.patientDetails?.firstName),
        patientLastName: String(d.pretaaHealthGetPatientSurvey.patientDetails?.lastName),
      });
    },
    onError: (e) => catchError(e, true),
  });

  const [facilitySurveyQuery, { loading: facilitySurveyDataLoading }] = useLazyQuery<
    FacilitySurveyWithAnswer,
    FacilitySurveyWithAnswerVariables
  >(surveyDetailsForFacility, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetSurveyWithAnswer.timezone) {
        timeZoneUpdater(d.pretaaHealthGetSurveyWithAnswer.timezone);
      }
      setSurveyDetails({
        name:
          d.pretaaHealthGetSurveyWithAnswer?.surveyTemplate?.name ||
          d.pretaaHealthGetSurveyWithAnswer?.surveyTemplate?.title,
        submissionDate: d.pretaaHealthGetSurveyWithAnswer.submissionDate,
        createdAt: d.pretaaHealthGetSurveyWithAnswer.createdAt,
        templateText: d.pretaaHealthGetSurveyWithAnswer.templateText,
        surveyTemplateTitle: d.pretaaHealthGetSurveyWithAnswer.surveyTemplate?.title
          ? d.pretaaHealthGetSurveyWithAnswer.surveyTemplate?.title
          : '',
        signature: d.pretaaHealthGetSurveyWithAnswer.signature,
        patientFirstName: String(d.pretaaHealthGetSurveyWithAnswer.patientDetails?.firstName),
        patientLastName: String(d.pretaaHealthGetSurveyWithAnswer.patientDetails?.lastName),
      });

      // This is intended because of react performance 
      const data = cloneDeep(d);
      data.pretaaHealthGetSurveyWithAnswer.surveyFields?.map(e => {
        e.options = e?.options ?  e?.options?.map(o => {
          return {
            ...o,
            id: shortid()
          }
        }) : null;
        return e;
      })
      console.log(data);
      setFacilitySurveyData(data);
    },
    onError: (e) => catchError(e, true),
  });

  //addinng get pdf
  const [getPdf, { loading: pdfUrlLoading }] = useLazyQuery<
    GetSurveyHealthReportPdf,
    GetSurveyHealthReportPdfVariables
  >(getSurveyHealthReportPdf, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetSurveyReportPdf) {
        const link = document.createElement('a');
        link.href = d.pretaaHealthGetSurveyReportPdf;
        link.setAttribute(
          'download',
          `${new Date().getTime()}.pdf`
        );
        link.setAttribute(
          'target',
          '_blank'
        );
        link.setAttribute(
          'features',
          'noreferrer'
        );   
        // Start download
        link.click();
        
      } else {
        toast.error('PDF not available. Please try again later.');
      }
    },
    onError: (e) => catchError(e, true),
  });

  function getHealthPdf() {
    if (userId && surveyId) {
      getPdf({
        variables: {
          surveyAssignId: surveyId,
          userId: userId,
        },
      });
    }
  }

  useEffect(() => {
    if (isEndUser && surveyId) {
      patientSurveyData();
    } else if ((isClinician && surveyId && userId) || (surveyId && userId && token)) {
      facilitySurveyQuery({
        variables: {
          userId,
          surveyId,
        },
      });
    }
  }, [
    facilitySurveyQuery,
     patientSurveyData,
     surveyId,
     userId,
     token,
     isClinician,
     isEndUser
  ]);

  function findSkippedIndex(item:FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields,
     index:number){
    if (item.validation?.conditionalValidation && item.value?.includes(item.validation.conditionalValidation?.value)) {
      for (let i = index + 1; i < item.validation.conditionalValidation?.skip; i++) {
        setSkipIndexIds(current => [...current, i]);
      }
    }
  }

  useEffect(() => {
    if (surveyData?.pretaaHealthGetPatientSurvey.surveyFields){
      surveyData?.pretaaHealthGetPatientSurvey.surveyFields.forEach((item, index) => {
        findSkippedIndex(item, index);
      });
    }

    if (facilitySurveyData?.pretaaHealthGetSurveyWithAnswer.surveyFields){
      facilitySurveyData?.pretaaHealthGetSurveyWithAnswer.surveyFields.forEach((item, index) => {
        findSkippedIndex(item, index);
      });
    }
  }, [surveyData, facilitySurveyData]);

  return (
    <React.Fragment>
      {!token && (
        <React.Fragment>
          {eventId && <EventCardView eventId={String(eventId)} assignedDate={surveyDetails.createdAt} />}
          {!eventId && (
            <SurveyNameCardView
              surveyDetails={surveyDetails}
              loading={surveyDataLoading || facilitySurveyDataLoading}
            />
          )}
        </React.Fragment>
      )}


      <div className="bg-white relative rounded-xl py-5 border-2 mt-4 px-4 pdf-body">
        <div className="bg-white rounded-xl pdf-body">
          {(surveyDataLoading || facilitySurveyDataLoading) && <SkeletonLoading />}
         
         {!surveyDataLoading && !facilitySurveyDataLoading && <table className='w-full pdf-table'>
            <thead className='pdf-table-header'>
              <tr>
                <td></td>
              </tr>
            </thead>

            <tbody>
            {(isClinician || token) && (
              <tr>
                <td>
            
                  <React.Fragment>
                    {!facilitySurveyDataLoading && facilitySurveyData && (
                      <div className="md:px-4">
                          <SurveyFormSubmittedHeader
                          surveyDetails={
                            facilitySurveyData?.pretaaHealthGetSurveyWithAnswer as FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer
                          }
                          pdfDownloadBtn={
                            token ? (
                              ''
                            ) : (
                              <div className='w-4'>
                              <Button
                                disabled={pdfUrlLoading}
                                loading={pdfUrlLoading}
                                buttonStyle="other"
                                align='right'
                                testId="button"
                                className="contents"
                                onClick={() => getHealthPdf()}>
                                <img src={!pdfUrlLoading ? downloadIcon : ''} alt="" />
                              </Button>
                              </div>
                            )
                          }
                        />

                        <hr />
                      </div>
                    )}
                  </React.Fragment>
                
                </td>
              </tr>
              )}

              <tr>
                <td>
                  {(!surveyDataLoading || !facilitySurveyDataLoading) && (
                  <React.Fragment>
                    <div className="px-2 pb-3 pt-2">{surveyDetails.templateText ? surveyDetails.templateText : ''}</div>
                    <div className="px-2 pb-3 font-bold">
                      {surveyDetails.surveyTemplateTitle ? surveyDetails.surveyTemplateTitle : ''}
                    </div>
                  </React.Fragment>
                )}
                </td>
              </tr>

              
              {facilitySurveyData && token &&
              facilitySurveyData.pretaaHealthGetSurveyWithAnswer.surveyFields?.map((element) => (
                <tr key={element.id}>
                  <td>
                    <React.Fragment>
                      <SurveySubmittedAnswer item={element} />
                    </React.Fragment>
                    </td>
                </tr>
              ))}

          {facilitySurveyData && !token &&
            facilitySurveyData.pretaaHealthGetSurveyWithAnswer.surveyFields?.map((element, index) => (
              <React.Fragment key={element.id}>
                <SurveySubmittedAnswer item={element} isSkipped={skipIndexIds.includes(index)} />
              </React.Fragment>
            ))}

          {surveyData &&
            surveyData.pretaaHealthGetPatientSurvey.surveyFields?.map((element, index) => (
              <React.Fragment key={element.id}>
                <SurveySubmittedAnswer item={element} isSkipped={skipIndexIds.includes(index)}/>
              </React.Fragment>
            ))}
               {surveyDetails.signature && (
                <tr>
                  <td>
                      <div className="border-t border-gray-150 py-5 px-2 mt-6 page-breaker">
                        <label className="font-bold pb-3">Signature</label>
                        <img src={surveyDetails.signature} className="signature-image" alt="signature" />
                        <p className="text-gray-150 text-xs">
                          {surveyDetails.patientFirstName} {surveyDetails.patientLastName}
                        </p>
                      </div>
                    
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  {facilitySurveyData && (
                  <FormSubmittedRowFooter
                    browser={facilitySurveyData?.pretaaHealthGetSurveyWithAnswer.browser as string}
                    os={facilitySurveyData?.pretaaHealthGetSurveyWithAnswer.os as string}
                    endTime={format(utcToZonedTime(new Date(facilitySurveyData.pretaaHealthGetSurveyWithAnswer.submissionDate), String(facilitySurveyData.pretaaHealthGetSurveyWithAnswer.timezone)), config.timeFormat)}
                    startTime={format(utcToZonedTime(new Date(facilitySurveyData.pretaaHealthGetSurveyWithAnswer.surveyStartedAt), String(facilitySurveyData.pretaaHealthGetSurveyWithAnswer.timezone)), config.timeFormat)}
                    device={facilitySurveyData.pretaaHealthGetSurveyWithAnswer.device as string}
                    IPAddress={facilitySurveyData.pretaaHealthGetSurveyWithAnswer.ipAddress as string}
                    timeZone={facilitySurveyData.pretaaHealthGetSurveyWithAnswer.timezone as string}
                  />
                )}
                </td>
              </tr>

              <tr>
                <td>
                  {surveyData && (
                  <FormSubmittedRowFooter
                    browser={surveyData?.pretaaHealthGetPatientSurvey.browser as string}
                    os={surveyData?.pretaaHealthGetPatientSurvey.os as string}
                    endTime={format(utcToZonedTime(new Date(surveyData.pretaaHealthGetPatientSurvey.submissionDate), String(surveyData.pretaaHealthGetPatientSurvey.timezone)), config.timeFormat)}
                    startTime={format(utcToZonedTime(new Date(surveyData.pretaaHealthGetPatientSurvey.surveyStartedAt), String(surveyData.pretaaHealthGetPatientSurvey.timezone)), config.timeFormat)}
                    device={surveyData?.pretaaHealthGetPatientSurvey.device as string}
                    IPAddress={surveyData?.pretaaHealthGetPatientSurvey.ipAddress as string}
                    timeZone={surveyData.pretaaHealthGetPatientSurvey.timezone as string}
                  />
                )}
                </td>
              </tr>
            </tbody>

            <tfoot className='pdf-table-footer'>
              <tr>
                <td></td>
              </tr>
            </tfoot>
          </table>}

        </div>
      </div>

      {/* pdf-header */}
      <div className="pdf-header">
        <img src={Logo} alt="logo" className="header-img" />
      </div>

      {/* pdf-footer */}
      <div className="pdf-footer">
        <hr className="divider" />
        <div className="w-100 md:h-22 items-center flex flex-row justify-between px-10">
          <div className="flex flex-row items-center">
            <img src={PdfLogo} alt="logo" className="inline-block object-contain mr-4 footer-logo" />
            <p className="text-gray-150 text-xs footer-text">pretaa.com</p>
          </div>
          <div className="footer-text hidden">
            <span>
              Page <span className="pagenumber" /> of <span className="pagecount" />
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

