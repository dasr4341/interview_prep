import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Popover from 'components/Popover';
import InfoCircle from 'components/icons/InfoCircle';
import { config } from 'config';
import {
  FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer,
  GetPatientSurvey_pretaaHealthGetPatientSurvey,
} from 'health-generatedTypes';
import './_SurveyForm-submitted-header.scoped.scss';
import SafeHtml from 'components/SafeHtml';
import { SurveyDetailsContext } from './SurveyFormSubmitted';
import BamChart from 'components/charts/BamSeriesChart/BamChart';
import GadPhqChart from '../../../components/charts/GadPhqSeriesChart/GadPhqChart';
import { formatInTimeZone } from 'date-fns-tz';
import { ChartTypes } from 'components/charts/enum/ChartTypes.enum';
import UricaChart from 'components/charts/UricaSeriesChart/UricaChart';
import useGadPhqSurvey from 'screens/surveys/Patient/customHooks/useGadPhqSurvey';
import useBamSurvey from './customHooks/useBamSurvey';
import { useLocation, useSearchParams } from 'react-router-dom';

function getChartVisibilityState(location: Location, searchParams: URLSearchParams) {
  if (location.pathname.includes('downloadPdf') && searchParams.get('chart-visibility')) {
      return !!searchParams.get('chart-visibility')?.includes('true');
  }
  return true;
}

function getChartType(templateName: string | null) {
  if (!templateName) {
    return null;
  }
  if (templateName.includes('gad-7')) {
    return ChartTypes['GAD-7'];
  } else if (templateName.includes('phq-9')) {
    return ChartTypes['PHQ-9'];
  } else if (templateName.includes('phq-15')) {
    return ChartTypes['PHQ-15'];
  } else if (templateName.includes('bam-r')) {
    return ChartTypes['BAM-R'];
  } else if (templateName.includes('bam-iop')) {
    return ChartTypes['BAM-IOP'];
  }
}

export default function SurveyFormSubmittedHeader({
  surveyDetails,
  pdfDownloadBtn,
}: {
  surveyDetails:
    | GetPatientSurvey_pretaaHealthGetPatientSurvey
    | FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer;
  pdfDownloadBtn: any;
}) {
  const surveyDetailsContext = useContext(SurveyDetailsContext);
  const chartType = getChartType(
    surveyDetails.surveyTemplate?.name?.toLowerCase() || null
  );

  const surveyId = surveyDetails.id;
  const timeZone =
  surveyDetails.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const location: any = useLocation();
  const [searchParams] = useSearchParams();
  const [chartVisibility, setChartVisibility] = useState<boolean>(() => getChartVisibilityState(location, searchParams));
  
  const [isDownloadPdfRoute, setDownloadPdfRoute] = useState<boolean>(false);
  
  useEffect(() => {
    setDownloadPdfRoute(location.pathname.includes('downloadPdf') ? true : false);
  }, []);

  const { chartDataSets, labels, loading } = useGadPhqSurvey({
    chart: chartType as ChartTypes,
    timeZone,
    campaignSurveyId: surveyId,
  });

  const { loading: bamDataLoading, dataSets } = useBamSurvey({
    chart: chartType as ChartTypes,
    campaignSurveyId: surveyId,
    timeZone,
  });

  useEffect(() => {
    setChartVisibility(() => getChartVisibilityState(location, searchParams));
  }, [location, searchParams]);

  // This table is only present for URICA template 
  const scores =
    'scoreTable' in surveyDetails &&
    surveyDetails.scoreTable !== null &&
    typeof surveyDetails.scoreTable === 'object' &&
    Object.keys(surveyDetails.scoreTable).length > 0
      ? surveyDetails.scoreTable
      : {};
  

  function createMarkup() {
    return {
      __html: `${surveyDetails?.assessment?.scoring?.overAllPatientScore} ${
        surveyDetails?.assessment?.scoring?.overAllTotalScore && '/'
      } 
    ${surveyDetails?.assessment?.scoring?.overAllTotalScore}`,
    };
  }

  
  return (
    <div>
      <React.Fragment>
        <div className="mb-4 flex flex-col md:flex-row items-start md:justify-between">
          <div className="font-bold text-base order-last md:order-first">
            {surveyDetailsContext.token && (
              <div className="flex items-center">
                <span> Template name:</span>
                {surveyDetails?.surveyTemplate?.name && (
                  <span className="font-normal capitalize pl-2">
                    {`${surveyDetails?.surveyTemplate?.name || 'N/A'} `}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start md:items-center">
              <span className='whitespace-nowrap'> Participant Name:</span>
              {surveyDetails?.patientDetails && (
                <span className="font-normal capitalize pl-2">
                  {`${surveyDetails?.patientDetails?.firstName || 'N/A'} ${
                    surveyDetails?.patientDetails?.lastName || ''
                  }`}
                </span>
              )}
            </div>
            <div className="flex items-start md:items-center">
              <span className='whitespace-nowrap'>Initiated by:</span>
              <span className="font-normal capitalize pl-2">
                {`${surveyDetails?.createdby?.firstName || 'N/A'} ${
                  surveyDetails?.createdby?.lastName || ''
                }`}
              </span>
            </div>
            {surveyDetailsContext.token && (
              <React.Fragment>
                <div className="">
                  <span>Patient MR No:</span>
                  <span className="font-normal pl-2">
                    {surveyDetails.patientMRNumber || 'N/A'}
                  </span>
                </div>
                <div className="">
                  <span>Assessment Issued on:</span>
                  <span className="font-normal pl-2">
                    {(surveyDetails?.createdAt && (
                      <React.Fragment>
                        {formatInTimeZone(
                          new Date(surveyDetails?.createdAt as string),
                          timeZone,
                          config.dateFormat
                        )}
                      </React.Fragment>
                    )) ||
                      'N/A'}
                  </span>
                </div>
              </React.Fragment>
            )}
            <div className=" mb-5 md:mb-5">
              <span>Date completed:</span>
              <span className="font-normal pl-2">
                {(surveyDetails?.submissionDate &&
                  typeof surveyDetails?.submissionDate === 'string' && (
                    <React.Fragment>
                      {formatInTimeZone(
                        new Date(surveyDetails?.submissionDate as string),
                        timeZone,
                        config.dateFormat
                      )}
                    </React.Fragment>
                  )) ||
                  'N/A'}
              </span>
            </div>

            {scores && Object.keys(scores).length === 0 && (
              <React.Fragment>
                <div className="mt-1 md:mt-3 flex font-bold text-base">
                  {surveyDetails?.assessment?.scoring?.infoWindow && (
                    <div className="flex justify-between items-center -ml-1">
                      <Popover
                        position="bottom left"
                        arrowStyle={{ right: 'calc(50% - 15px)' }}
                        trigger={
                          <div>
                            <button>
                              <InfoCircle />
                            </button>
                          </div>
                        }>
                        {surveyDetails?.assessment?.scoring?.infoWindow}
                      </Popover>
                    </div>
                  )}
                  {surveyDetails?.assessment?.scoring?.displayLabel && (
                    <div className="flex flex-row flex-1">
                     <span className='whitespace-nowrap'>{surveyDetails?.assessment?.scoring?.displayLabel}</span>
                      <span className=" result-wrapper pl-1">
                        <div dangerouslySetInnerHTML={createMarkup()} />
                      </span>
                    </div>
                  )}
                </div>

                {chartVisibility && surveyDetails.surveyTemplate?.name
                  ?.toLowerCase()
                  .includes('urica') &&
                  surveyDetailsContext.chart?.date.length > 1 && (
                    <UricaChart />
                  )}

                <div className=" flex font-bold text-base">
                  {surveyDetails?.assessment?.result?.infoWindow && (
                    <div className="-ml-1 md:-ml-0 flex-1">
                      <Popover
                        position="bottom left"
                        arrowStyle={{ right: 'calc(50% - 15px)' }}
                        trigger={
                          <div>
                            <button>
                              <InfoCircle />
                            </button>
                          </div>
                        }>
                        {surveyDetails?.assessment?.result?.infoWindow}
                      </Popover>
                    </div>
                  )}

                  {!surveyDetails?.assessment?.subScales?.length &&
                    surveyDetails?.assessment && (
                      <div className="font-bold flex flex-row align-top items-start result-wrapper">
                        <div
                          className="font-bold flex"
                          dangerouslySetInnerHTML={{
                            __html: `<div class="text-black whitespace-nowrap"> Result: </div>&nbsp;
                          ${
                            surveyDetails?.assessment?.result?.displayResult
                              ? surveyDetails?.assessment?.result?.displayResult
                              : ''
                          }`,
                          }}></div>
                      </div>
                    )}
                </div>
              </React.Fragment>
            )}

            {surveyDetails?.assessment?.subScales && (
              <div className=" text-left survey-header-subScales">
                {surveyDetails?.assessment?.subScales?.map((el: any) => {
                  return (
                    <div key={el.label}>
                      <div className="survey-header-subScales-content">
                        <div className='whitespace-nowrap'>{el?.label} : </div>
                        <div className=" font-bold pl-1 result-wrapper">
                          <SafeHtml rawHtml={el?.score} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className='order-first md:order-last mb-3 md:mb-0 w-full md:w-auto flex justify-end'>{pdfDownloadBtn}</div>
        </div>

        {scores && Object.keys(scores).length > 0 && (
          <div className={`w-full ${!isDownloadPdfRoute && 'flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between'}`}>
            <div className={`w-full ${!isDownloadPdfRoute && 'md:w-3/5 lg:w-full xl:w-3/5'}`}>
              <div className="mt-1 md:mt-3 font-bold text-base">
                {surveyDetails?.assessment?.scoring?.infoWindow && (
                  <div className="flex justify-between items-center -ml-1">
                    <Popover
                      position="bottom left"
                      arrowStyle={{ right: 'calc(50% - 15px)' }}
                      trigger={
                        <div>
                          <button>
                            <InfoCircle />
                          </button>
                        </div>
                      }>
                      {surveyDetails?.assessment?.scoring?.infoWindow}
                    </Popover>
                  </div>
                )}

                {surveyDetails?.assessment?.scoring?.displayLabel && (
                  <div className="flex flex-row flex-1">
                    {surveyDetails?.assessment?.scoring?.displayLabel}
                    <span className=" result-wrapper pl-1">
                      <div dangerouslySetInnerHTML={createMarkup()} />
                    </span>
                  </div>
                )}

                {chartVisibility && surveyDetails.surveyTemplate?.name
                  ?.toLowerCase()
                  .includes('urica') &&
                  surveyDetailsContext.chart?.date.length > 1 && (
                    <UricaChart />
                  )}
              </div>
            </div>

            <div className="flex flex-col mb-7 2xl:mb-0">
              <div className="">
                <div className="mt-1 md:mt-3 flex font-bold text-base justify-start md:justify-end lg:justify-start xl:justify-end">
                  {surveyDetails?.assessment?.result?.infoWindow && (
                    <div className="-ml-1 md:-ml-0 flex-1">
                      <Popover
                        position="bottom left"
                        arrowStyle={{ right: 'calc(50% - 15px)' }}
                        trigger={
                          <div>
                            <button>
                              <InfoCircle />
                            </button>
                          </div>
                        }>
                        {surveyDetails?.assessment?.result?.infoWindow}
                      </Popover>
                    </div>
                  )}

                  <div className="font-bold flex flex-row text-right result-wrapper">
                    Result:
                    <span className="font-bold">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            surveyDetails?.assessment?.result?.displayResult ||
                            'N/A',
                        }}
                        className="pl-1"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-fit mt-2">
                <h3 className="text-center font-bold">{scores?.heading}</h3>
                <table className="divide-y text-left  w-full border mt-3 border-black-500">
                  {scores.values.map((el: any) => {
                    return (
                      <tbody key={Object.keys(el)[0]}>
                        <tr>
                          <td className="border border-black-500 p-2 text-center">
                            {' '}
                            {Object.keys(el)[0]}{' '}
                          </td>
                          <td className=" border border-black-500 md:pl-4 font-bold md:text-right pr-2">
                            {Object.values(el)[0] as ReactNode}
                          </td>
                        </tr>
                        <tr></tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>

      {!!(chartType && chartVisibility) && 
        ((chartType?.includes('phq') || chartType?.includes('gad')) &&  chartDataSets.data.length > 0 ) && (
          <GadPhqChart
            chart={chartType as ChartTypes}
            data={chartDataSets}
            loading={loading}
            labels={labels}
            currentPoint={surveyDetailsContext.chart.currentPoint}
            isDownloadPdfRoute={isDownloadPdfRoute}
          />
        )}
        

      {(!!chartVisibility && !!chartType &&
        chartType?.includes('bam') &&
        dataSets.data.length > 0) && (
        <BamChart
          data={dataSets}
          loading={bamDataLoading}
            chart={chartType as ChartTypes}
          currentPoint={surveyDetailsContext.chart.currentPoint}
          chartDirection={{
            leftAxis: 'line',
            rightAxis: 'bar',
        }}
          isDownloadPdfRoute={isDownloadPdfRoute}
          />
        )}
    </div>
  );
}
