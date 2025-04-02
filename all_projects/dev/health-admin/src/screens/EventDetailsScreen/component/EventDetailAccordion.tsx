import { Accordion } from '@mantine/core';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import {
  PatientHealthData,
  PatientHealthDataVariables,
  PretaaHealthDownloadReportPdf,
  PretaaHealthDownloadReportPdfVariables,
  UserTypeRole,
} from 'health-generatedTypes';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getPatientHealthData } from 'graphql/eventDetails.query';
import { useParams } from 'react-router-dom';
import ChartLayout from './ChartLayout';
import HeartChart from './HeartChart';
import StepsChart from './StepsChart';
import SleepChart from './SleepChart';
import { getMonthAndDay, monthDateYearFormatter } from 'Helper/chart-helper';
import Spo2Chart from './Spo2Chart';
import HrvChart from './HrvChart';
import TempChart from './TempChart';
import NoDataFound from 'components/NoDataFound';
import {
  ChartNames,
  HealthData,
  ReportTypes,
  SourceSystmHealthData,
  TimeSeriesData,
  Units,
} from 'interface/chart.interfaces';
import Button from 'components/ui/button/Button';
import downloadIcon from 'assets/icons/download_icon_blue.svg';
import { getEventReportPdfDownload } from 'graphql/getEventReportPdfDownload.mutation';
import SimpleDailyReport from './simpleDailyReport/SimpleDailyReport';
import Interpretations from './simpleDailyReport/Interpretations';
import { SimpleDailyReportInterface } from 'interface/report.interface';
import { toast } from 'react-toastify';
import SkeletonLoading from 'components/SkeletonLoading';
import './_eventDetailsAccordion.scoped.scss';
import useSelectedRole from 'lib/useSelectedRole';
import TotalStepsChart from './TotalStepsChart';

export const SimpleDailyReportContext = createContext<{
  simpleReportData: SimpleDailyReportInterface | null;
  simpleReportUnit?: Units | null;
}>({
  simpleReportData: null,
  simpleReportUnit: null,
});

export default function EventDetailAccordion() {
  const isEndUser = useSelectedRole({ roles: [UserTypeRole.PATIENT, UserTypeRole.SUPPORTER] });
  const isClinician = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR, UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });

  const { id } = useParams();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [reportData, setReportData] = useState<{
    simpleReportData: SimpleDailyReportInterface | null;
    simpleReportUnit?: Units | null;
  }>({
    simpleReportData: null,
    simpleReportUnit: null,
  });

  const [loadHealthData, { loading: healthDataLoading }] = useLazyQuery<
    PatientHealthData,
    PatientHealthDataVariables
  >(getPatientHealthData, {
    onCompleted: (d) => {
      if (d.pretaaHealthRetriveEventRawData) {
        setHealthData(d);
        setReportData({
          simpleReportData: d.pretaaHealthRetriveEventRawData.simpleDailyReport,
          simpleReportUnit: d.pretaaHealthRetriveEventRawData.units,
        });
      }
    },
    variables: {
      eventId: String(id),
    },
  });

  const [getEventReportPdf, { loading: getEventReportPdfLoading }] =
    useMutation<
      PretaaHealthDownloadReportPdf,
      PretaaHealthDownloadReportPdfVariables
    >(getEventReportPdfDownload, {
      onCompleted: (d) => {
        if (d.pretaaHealthDownloadReportPdf) {
          window.open(d.pretaaHealthDownloadReportPdf, '_blank', 'noreferrer');
        }
      },
      onError: () => {
        toast.error('Unable to download PDF!');
      }
    });

  function getHealthPdf() {
    if (id) {
      getEventReportPdf({
        variables: {
          eventId: String(id),
        },
      });
    }
  }

  useEffect(() => {
    if (id) {
      loadHealthData();
    }
  }, [id, loadHealthData]);

  // get heart anomaly data
  function heartAnomalyData() {
    const { heartStepsAnomaly, tanakaAnomaly } = healthData?.pretaaHealthRetriveEventRawData ?? {};

    if (heartStepsAnomaly) {
      // if normal heart and steps anomaly
      return heartStepsAnomaly.filter(el => el.heart !== undefined && el.heart !== null).map(el => ({
        time: el.time, 
        value: el.heart
      })) as TimeSeriesData[];
    } else if (tanakaAnomaly) {
      // if tanaka anomaly
      return tanakaAnomaly.filter(el => el.value !== undefined && el.value !== null).map(el => ({
        time: el.time, 
        value: el.value
      })) as TimeSeriesData[];
    }

    return [];
  }

  // get first and last label of chart
  function getFirstAndLastLabel() {
    const { heartCurrentDay } = healthData?.pretaaHealthRetriveEventRawData?.heart ?? {};

    if (!!heartCurrentDay) {
      return {
        firstLabelTime: heartCurrentDay[0].time,
        lastLabelTime: heartCurrentDay[heartCurrentDay.length - 1].time,
      }
    }
  }

// get steps anomaly data 
  function stepsAnomalyData() {
    const { heartStepsAnomaly } = healthData?.pretaaHealthRetriveEventRawData ?? {};

    if (!!heartStepsAnomaly) {
      return heartStepsAnomaly.filter(el => el.steps !== undefined && el.steps !== null).map((el) => ({
        time: String(el.time), 
        value: Number(el.steps)
      }));
    }

    return [];
  }

  function totalStepsData() {
    const { stepsTotal7Day } = healthData?.pretaaHealthRetriveEventRawData?.stepsTotal ?? {};

    const totalStepsLabels: string[] = [];
    const totalStepsDataSets: Array<number | null> = [];
    const isAnomaly: boolean[] = [];
    if (stepsTotal7Day) {
      stepsTotal7Day.forEach((el) => {
        totalStepsLabels.push(getMonthAndDay(String(el.dateTime)));
        totalStepsDataSets.push(el.value);
        isAnomaly.push(Boolean(el.isAnomaly));
      });
    }
    return { totalStepsLabels, totalStepsDataSets, isAnomaly };
  }

  function sleepData() {
    const { sleep7Day } = healthData?.pretaaHealthRetriveEventRawData?.sleep ?? {};
    const sleepLabels: string[] = [];
    const sleepDataSets: Array<number | null> = [];
    const isAnomaly: boolean[] = [];
    if (sleep7Day) {
      sleep7Day.forEach((el) => {
        sleepLabels.push(getMonthAndDay(el.dateOfSleep));
        sleepDataSets.push(el.minutesAsleep);
        isAnomaly.push(el.isAnomaly);
      });
    }

    return { sleepLabels, sleepDataSets, isAnomaly };
  }

  function spo2Data() {
    const { spo27Day } = healthData?.pretaaHealthRetriveEventRawData?.spo2 ?? {};
    const spo2Labels: string[] = [];
    const spo2DataSets: Array<number | null> = [];
    const isAnomaly: boolean[] = [];
    if (spo27Day) {
      spo27Day.forEach((el) => {
        spo2Labels.push(getMonthAndDay(el.dateTime));
        spo2DataSets.push(el.value.avg as number);
        isAnomaly.push(el.isAnomaly);
      });
    }
    return { spo2Labels, spo2DataSets, isAnomaly };
  }

  function hrvData() {
    const { hrv7Day } = healthData?.pretaaHealthRetriveEventRawData?.hrv ?? {};
    const hrvLabels: string[] = [];
    const hrvDataSets: Array<number | null> = [];
    const isAnomaly: boolean[] = [];
    if (hrv7Day) {
      hrv7Day.forEach((el) => {
        hrvLabels.push(getMonthAndDay(el.dateTime));
        hrvDataSets.push(el.value.dailyRmssd);
        isAnomaly.push(el.isAnomaly);
      });
    }
    return { hrvLabels, hrvDataSets, isAnomaly };
  }

  function tempData() {
    const { temp7Day } = healthData?.pretaaHealthRetriveEventRawData?.temp ?? {};
    const tempLabels: string[] = [];
    const tempDataSets: Array<number | null> = [];
    const isAnomaly: boolean[] = [];
    if (temp7Day) {
      temp7Day.forEach((el) => {
        tempLabels.push(getMonthAndDay(el.dateTime));
        tempDataSets.push(el.value.nightlyRelative);
        isAnomaly.push(el.isAnomaly);
      });
    }
    return { tempLabels, tempDataSets, isAnomaly };
  }

  function hasAnomaly() {
    return [
      heartAnomalyData().length > 1,
      stepsAnomalyData().length > 1,
      sleepData().isAnomaly.some((e) => e),
      spo2Data().isAnomaly.some((e) => e),
      hrvData().isAnomaly?.some((e) => e),
      tempData().isAnomaly?.some((e) => e)
    ].some((el) => el);
  }

  function chartTemplate() {
    return (
      <React.Fragment>
        {!healthDataLoading && (
          <div className="bg-white px-5 py-6 border border-gray-200 rounded-xl mt-10 relative simple-daily-report">
            <React.Fragment>
              {healthData?.pretaaHealthRetriveEventRawData?.simpleDailyReport && isClinician && (
                <React.Fragment>
                  <div className="absolute top-5 right-6 z-10 pdf-download-button">
                    <Button
                      disabled={getEventReportPdfLoading}
                      loading={getEventReportPdfLoading}
                      buttonStyle="other"
                      testId="button"
                      className='contents'
                      onClick={() => getHealthPdf()}>
                      <img src={!getEventReportPdfLoading ? downloadIcon : ''} alt="" />
                    </Button>
                  </div>
                  <SimpleDailyReport />
                </React.Fragment>
              )}

              {!healthDataLoading && healthData?.pretaaHealthRetriveEventRawData?.simpleDailyReport && isEndUser &&
                <SimpleDailyReport />
              }
            </React.Fragment>

            {/* simple daily report end */}

            {/* wellness report */}
            {(!healthDataLoading && 
            healthData && 
            ((isEndUser && healthData.pretaaHealthRetriveEventRawData?.reportType !== ReportTypes.DailyReport) || isClinician)) && (
              <React.Fragment>
                {(healthData?.pretaaHealthRetriveEventRawData?.reportType !== ReportTypes.DailyReport || 
                !healthData?.pretaaHealthRetriveEventRawData?.simpleDailyReport) && (
                  <div className="block sm:flex sm:justify-between mb-5 relative">
                    <div className="text-left pt-4">
                      <h2 className="text-gray-850 font-semibold text-xs-md mb-2 tracking-widest uppercase">
                        {healthData?.pretaaHealthRetriveEventRawData?.reportName ?? 'N/A'}
                      </h2>
                      <span className="block text-sm font-normal text-gray-850 tracking-widest">
                        Event date: &nbsp;
                        {monthDateYearFormatter(healthData?.pretaaHealthRetriveEventRawData?.eventDate)}
                      </span>
                      <span className="block text-sm font-normal text-gray-850 tracking-widest">
                        Date published: &nbsp;
                        {monthDateYearFormatter(healthData?.pretaaHealthRetriveEventRawData?.datePublished)}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="pb-2 inline-block absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto">
                        {isClinician && (
                          <Button
                            disabled={getEventReportPdfLoading}
                            loading={getEventReportPdfLoading}
                            buttonStyle="other"
                            testId="button"
                            className='contents'
                            onClick={() => getHealthPdf()}>
                            <img
                              src={!getEventReportPdfLoading ? downloadIcon : ''}
                              alt=""
                            />
                          </Button>
                        )}
                      </div>
                      <label className="block text-more text-gray-850 tracking-widest font-semibold capitalize mt-2 sm:mt-0">
                        {healthData?.pretaaHealthRetriveEventRawData?.name ?? 'N/A'}
                      </label>
                      <span className="block text-sm font-normal text-gray-850 tracking-widest">
                        <span className='whitespace-nowrap inline-block'>Patient Report: &nbsp;</span>
                        {healthData?.pretaaHealthRetriveEventRawData?.reportId ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {healthData?.pretaaHealthRetriveEventRawData?.simpleDailyReport && (
                  <div className="border-gray-200 border-b my-7 sm:my-8"></div>
                )}

                {(healthData?.pretaaHealthRetriveEventRawData?.reportType === ReportTypes.SpecialReport && 
                hasAnomaly() && 
                !!healthData?.pretaaHealthRetriveEventRawData?.anomalyText) && (
                  <div className="relative">
                    <p className="text-primary text-sm">
                      <span className='font-bold'>Anomaly Detected: </span>
                      {healthData?.pretaaHealthRetriveEventRawData?.anomalyText}
                    </p>
                  </div>
                )}

                <Accordion multiple={true} defaultValue={['heart', 'steps', 'totalSteps', 'sleep', 'spo2', 'hrv', 'temp']}>
                  {healthData?.pretaaHealthRetriveEventRawData?.heart?.heartCurrentDay && (
                    <Accordion.Item value="heart">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">Heart Rate</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.heart?.heartCurrentDay.length && (
                          <React.Fragment>
                            <ChartLayout
                              chartFooterData={{
                                reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                                chartName: ChartNames.heart,
                                eventDate: healthData?.pretaaHealthRetriveEventRawData?.eventDate,
                                timePeriod: getFirstAndLastLabel(),
                                timeZone: healthData?.pretaaHealthRetriveEventRawData?.timezone ?? 'N/A',
                              }}>
                              <HeartChart
                                chartPropsData={{
                                  chartData: healthData?.pretaaHealthRetriveEventRawData?.heart?.heartCurrentDay,
                                  anomalyData: heartAnomalyData(),
                                  reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                                  lowerBound: healthData?.pretaaHealthRetriveEventRawData?.heart?.lowerBound,
                                  upperBound: healthData?.pretaaHealthRetriveEventRawData?.heart?.upperBound,
                                  version: healthData?.pretaaHealthRetriveEventRawData?.version,
                                  sourceSystem: healthData?.pretaaHealthRetriveEventRawData?.sourceSystem,
                                  heartAverage: healthData?.pretaaHealthRetriveEventRawData?.heart?.heartCurrentDayStats?.avg
                                }}
                              />
                            </ChartLayout>
                          </React.Fragment>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.heart?.heartCurrentDay.length && (
                          <NoDataFound type="NODATA" />
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {healthData?.pretaaHealthRetriveEventRawData?.steps?.stepsCurrentDay && (
                    <Accordion.Item value="steps">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">Steps</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.steps?.stepsCurrentDay.length && (
                          <ChartLayout
                            chartFooterData={{
                              reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                              chartName: ChartNames.steps,
                              timeZone: healthData?.pretaaHealthRetriveEventRawData?.timezone ?? 'N/A',
                            }}>
                            <StepsChart
                              chartPropsData={{
                                chartData: healthData?.pretaaHealthRetriveEventRawData?.steps?.stepsCurrentDay,
                                anomalyData: stepsAnomalyData(),
                                reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.steps?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.steps?.upperBound,
                                version: healthData?.pretaaHealthRetriveEventRawData.version,
                                sourceSystem: healthData?.pretaaHealthRetriveEventRawData?.sourceSystem
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.steps?.stepsCurrentDay.length && (
                          <NoDataFound type="NODATA" />
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {!!healthData?.pretaaHealthRetriveEventRawData?.stepsTotal?.stepsTotal7Day && (
                    <Accordion.Item value="totalSteps">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">Total Steps</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.stepsTotal?.stepsTotal7Day.length && (
                          <ChartLayout
                            chartFooterData={{
                              reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                              chartName: ChartNames.totalSteps,
                              legend: true,
                            }}>
                            <TotalStepsChart
                              chartData={{
                                data: totalStepsData(),
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.stepsTotal?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.stepsTotal?.upperBound,
                                totalStepsAverage: healthData.pretaaHealthRetriveEventRawData.stepsTotal.stepsTotal7DayStats?.avg as number
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.stepsTotal?.stepsTotal7Day?.length &&
                          <NoDataFound type="NODATA" />
                        }
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {healthData?.pretaaHealthRetriveEventRawData?.spo2?.spo27Day && (
                    <Accordion.Item value="spo2">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">SpO2</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.spo2?.spo27Day.length && (
                          <ChartLayout
                            chartFooterData={{
                              legend: true,
                            }}>
                            <Spo2Chart
                              chartData={{
                                data: spo2Data(),
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.spo2?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.spo2?.upperBound,
                                spo2Average: healthData.pretaaHealthRetriveEventRawData.spo2.spo27DayStats?.avg as number
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.spo2?.spo27Day.length &&
                          <NoDataFound type="NODATA" />
                        }
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {healthData?.pretaaHealthRetriveEventRawData?.sleep?.sleep7Day && (
                    <Accordion.Item value="sleep">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">Minutes Slept</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.sleep?.sleep7Day?.length && (
                          <ChartLayout
                            chartFooterData={{
                              reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                              chartName: ChartNames.sleep,
                              legend: true,
                            }}>
                            <SleepChart
                              chartData={{
                                data: sleepData(),
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.sleep?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.sleep?.upperBound,
                                sleepAverage: healthData.pretaaHealthRetriveEventRawData.sleep.sleep7DayStats?.avg as number
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.sleep?.sleep7Day.length &&
                          <NoDataFound type="NODATA" />
                        }
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {healthData?.pretaaHealthRetriveEventRawData?.hrv?.hrv7Day && (
                    <Accordion.Item value="hrv">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">Heart Rate Variability</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!!healthData?.pretaaHealthRetriveEventRawData?.hrv?.hrv7Day.length && (
                          <ChartLayout
                            chartFooterData={{
                              reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                              chartName: ChartNames.hrv,
                              legend: true,
                            }}>
                            <HrvChart
                              chartData={{
                                data: hrvData(),
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.hrv?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.hrv?.upperBound,
                                hrvAverage: healthData.pretaaHealthRetriveEventRawData.hrv.hrv7DayStats?.avg as number
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.hrv?.hrv7Day.length &&
                          <NoDataFound type="NODATA" />
                        }
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}

                  {healthData?.pretaaHealthRetriveEventRawData?.temp?.temp7Day && (
                    <Accordion.Item value="temp">
                      <Accordion.Control>
                        <div className="flex justify-between">
                          <p className="font-semibold text-xs-md">{
                            healthData?.pretaaHealthRetriveEventRawData.sourceSystem === SourceSystmHealthData.APPLEWATCH
                            ? 'Apple Sleeping Wrist Temperature'
                            : 'Daily Average Deviation from Baseline Skin Temperature'
                          }</p>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {!healthData?.pretaaHealthRetriveEventRawData?.isTemperatureSupported?.value &&
                          <div className='font-semibold text-center my-20'>{healthData?.pretaaHealthRetriveEventRawData?.isTemperatureSupported?.text}</div>
                        }
                        
                        {(
                          (!!healthData?.pretaaHealthRetriveEventRawData?.isTemperatureSupported?.value || 
                            !healthData?.pretaaHealthRetriveEventRawData?.isTemperatureSupported?.value) && 
                            !!healthData?.pretaaHealthRetriveEventRawData?.temp?.temp7Day.length) && (
                          <ChartLayout
                            chartFooterData={{
                              reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType,
                              chartName: ChartNames.temp,
                              legend: true,
                            }}>
                            <TempChart
                              chartData={{
                                data: tempData(),
                                lowerBound: healthData?.pretaaHealthRetriveEventRawData?.temp?.lowerBound,
                                upperBound: healthData?.pretaaHealthRetriveEventRawData?.temp?.upperBound,
                                chartUnit: healthData?.pretaaHealthRetriveEventRawData?.units?.temp,
                              }}
                            />
                          </ChartLayout>
                        )}

                        {!healthData?.pretaaHealthRetriveEventRawData?.temp?.temp7Day.length &&
                          <NoDataFound type="NODATA" />
                        }
                      </Accordion.Panel>
                    </Accordion.Item>
                  )}
                </Accordion>
              </React.Fragment>
            )}
            {/* wellness report end */}

            <div className="mb-5">
              {healthData?.pretaaHealthRetriveEventRawData?.simpleDailyReport && isEndUser && (
                <div className="border-gray-200 border-b my-8"></div>
              )}
              <Interpretations 
                dataType={{
                  reportType: healthData?.pretaaHealthRetriveEventRawData?.reportType as string,
                  anomalyType: healthData?.pretaaHealthRetriveEventRawData?.anomalyType as Array<ChartNames>,
                }}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <SimpleDailyReportContext.Provider value={useMemo(() => {
        return reportData;
      }, [reportData])}>
        {healthDataLoading && (
          <div className="bg-white px-5 py-10 border border-gray-200 rounded-xl mt-10">
            <SkeletonLoading />
          </div>
        )}
        {chartTemplate()}
      </SimpleDailyReportContext.Provider>
    </React.Fragment>
  );
}
