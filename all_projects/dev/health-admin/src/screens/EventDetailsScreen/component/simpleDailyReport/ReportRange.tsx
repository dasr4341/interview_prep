import React, { useContext } from 'react';
import './_health-report.scoped.scss';
import RangeSlider from './RangeSlider';
import { SimpleDailyReportContext } from '../EventDetailAccordion';

import heartImg from '../../../../assets/images/heart-icon.svg';
import sleepImg from '../../../../assets/images/sleep-icon.svg';
import spoImg from '../../../../assets/images/spo2-icon.svg';
import asleepImg from '../../../../assets/images/asleep-icon.svg';
import tempImg from '../../../../assets/images/temp-icon.svg';
import hrvImg from '../../../../assets/images/hrv-icon.svg';
import stepImg from '../../../../assets/images/step-icon.svg';
import warningImg from '../../../../assets/images/warning2.svg';

export default function ReportRange() {
  const reportData = useContext(SimpleDailyReportContext);
  return (
    <React.Fragment>
      {/* Heart rate */}
      <RangeSlider
        rangeData={{
          sliderIcon: heartImg,
          warningIcon: warningImg,
          sliderLabel: 'Heart Rate',
          sliderUnit: '(BPM)',
          isAnomaly: reportData?.simpleReportData?.heart?.isAnomaly,
          lowerBound: reportData?.simpleReportData?.heart?.lowerBound,
          upperBound: reportData?.simpleReportData?.heart?.upperBound,
          maxRange: reportData?.simpleReportData?.heart?.maxRange,
          minRange: reportData?.simpleReportData?.heart?.minRange,
          value: reportData?.simpleReportData?.heart?.value,
          upperBoundPercentSpace: reportData?.simpleReportData?.heart?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData?.simpleReportData?.heart?.lowerBoundPercentSpace,
          boundPercentSpace: reportData?.simpleReportData?.heart?.boundPercentSpace
        }}
      />

      {/* Steps */}
      <RangeSlider
        rangeData={{
          sliderIcon: stepImg,
          warningIcon: warningImg,
          sliderLabel: 'Steps',
          sliderUnit: '(Daily Total)',
          rangeUnit: 'K',
          lowerBound: reportData?.simpleReportData?.steps?.lowerBound,
          upperBound: reportData?.simpleReportData?.steps?.upperBound,
          maxRange: reportData?.simpleReportData?.steps?.maxRange,
          minRange: reportData?.simpleReportData?.steps?.minRange,
          value: !reportData?.simpleReportData?.steps?.value ? null : reportData?.simpleReportData?.steps?.value,
          upperBoundPercentSpace: reportData.simpleReportData?.steps?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData.simpleReportData?.steps?.lowerBoundPercentSpace,
          boundPercentSpace: reportData?.simpleReportData?.steps?.boundPercentSpace
        }}
      />

      {/* Heart Rate Variability */}
      <RangeSlider
        rangeData={{
          sliderIcon: hrvImg,
          warningIcon: warningImg,
          sliderLabel: 'Heart Rate Variability',
          sliderUnit: '(Milliseconds)',
          isAnomaly: reportData?.simpleReportData?.hrv?.sdAnomaly?.isAnomaly,
          lowerBound: reportData?.simpleReportData?.hrv?.lowerBound,
          upperBound: reportData?.simpleReportData?.hrv?.upperBound,
          maxRange: reportData?.simpleReportData?.hrv?.maxRange,
          minRange: reportData?.simpleReportData?.hrv?.minRange,
          value: reportData?.simpleReportData?.hrv?.value,
          upperBoundPercentSpace: reportData.simpleReportData?.hrv?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData.simpleReportData?.hrv?.lowerBoundPercentSpace,
          boundPercentSpace: reportData.simpleReportData?.hrv?.boundPercentSpace
        }}
      />

      {/* Temp */}
      <RangeSlider
        rangeData={{
          sliderIcon: tempImg,
          warningIcon: warningImg,
          sliderLabel: 'Temp',
          sliderUnit: `(${reportData?.simpleReportUnit?.temp ?? String.fromCharCode(0x2103)})`,
          isAnomaly: reportData?.simpleReportData?.temp?.sdAnomaly?.isAnomaly,
          lowerBound: reportData?.simpleReportData?.temp?.lowerBound,
          upperBound: reportData?.simpleReportData?.temp?.upperBound,
          maxRange: reportData?.simpleReportData?.temp?.maxRange,
          minRange:
            reportData?.simpleReportData?.temp?.minRange === null &&
            reportData?.simpleReportData?.temp?.lowerBound === null &&
            reportData?.simpleReportData?.temp?.value !== null
              ? Number(reportData?.simpleReportData?.temp?.value) - 10
              : reportData?.simpleReportData?.temp?.minRange,
          value: reportData?.simpleReportData?.temp?.value,
          upperBoundPercentSpace: reportData.simpleReportData?.temp?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData.simpleReportData?.temp?.lowerBoundPercentSpace,
          boundPercentSpace: reportData.simpleReportData?.temp?.boundPercentSpace
        }}
      />

      {/* SpO2 Readings */}
      <RangeSlider
        rangeData={{
          sliderIcon: spoImg,
          warningIcon: warningImg,
          sliderLabel: 'SpO2',
          sliderUnit: '(SpO2 %)',
          isAnomaly:
            reportData?.simpleReportData?.spo2?.sdAnomaly?.isAnomaly ||
            reportData?.simpleReportData?.spo2?.medicalAnomaly,
          lowerBound: reportData?.simpleReportData?.spo2?.lowerBound,
          upperBound: reportData?.simpleReportData?.spo2?.upperBound,
          maxRange: reportData?.simpleReportData?.spo2?.maxRange,
          minRange: reportData?.simpleReportData?.spo2?.minRange,
          value: reportData?.simpleReportData?.spo2?.value,
          upperBoundPercentSpace: reportData.simpleReportData?.spo2?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData.simpleReportData?.spo2?.lowerBoundPercentSpace,
          boundPercentSpace: reportData.simpleReportData?.spo2?.boundPercentSpace
        }}
      />

      {/* Sleep */}
      <RangeSlider
        rangeData={{
          sliderIcon: sleepImg,
          warningIcon: warningImg,
          sliderLabel: 'Sleep',
          sliderUnit: '(Hours)',
          isAnomaly:
            reportData?.simpleReportData?.sleep?.sdAnomaly?.isAnomaly ||
            reportData?.simpleReportData?.sleep?.medicalAnomaly,
          lowerBound: reportData?.simpleReportData?.sleep?.lowerBound,
          upperBound: reportData?.simpleReportData?.sleep?.upperBound,
          maxRange: reportData?.simpleReportData?.sleep?.maxRange,
          minRange:
            reportData?.simpleReportData?.sleep?.minRange === null &&
            reportData?.simpleReportData?.sleep?.lowerBound === null &&
            reportData?.simpleReportData?.sleep?.value !== null
              ? 0
              : reportData?.simpleReportData?.sleep?.minRange,
          value: reportData?.simpleReportData?.sleep?.value,
          upperBoundPercentSpace: reportData.simpleReportData?.sleep?.upperBoundPercentSpace,
          lowerBoundPercentSpace: reportData.simpleReportData?.sleep?.lowerBoundPercentSpace,
          boundPercentSpace: reportData.simpleReportData?.sleep?.boundPercentSpace
        }}
      />

      {/* Time to Fall Asleep */}
      {reportData?.simpleReportData?.timeToFallAsleep?.value as number > 0 &&
        <RangeSlider
          rangeData={{
            sliderIcon: asleepImg,
            warningIcon: warningImg,
            sliderLabel: 'Time to Fall Asleep',
            sliderUnit: '(Mins)',
            lowerBound:
              reportData?.simpleReportData?.timeToFallAsleep?.lowerBound,
            upperBound:
              reportData?.simpleReportData?.timeToFallAsleep?.upperBound,
            maxRange: reportData?.simpleReportData?.timeToFallAsleep?.maxRange,
            minRange: reportData?.simpleReportData?.timeToFallAsleep?.minRange,
            value: reportData?.simpleReportData?.timeToFallAsleep?.value,
          }}
        />
      }

      {/* Alert section */}
      {(reportData?.simpleReportData?.heart?.isAnomaly ||
        reportData?.simpleReportData?.hrv?.sdAnomaly?.isAnomaly ||
        reportData?.simpleReportData?.sleep?.medicalAnomaly ||
        reportData?.simpleReportData?.sleep?.sdAnomaly?.isAnomaly ||
        reportData?.simpleReportData?.spo2?.medicalAnomaly ||
        reportData?.simpleReportData?.spo2?.sdAnomaly?.isAnomaly ||
        reportData?.simpleReportData?.temp?.sdAnomaly?.isAnomaly) && (
          <div
            className="container mx-auto px-4 md:px-14 py-6 md:py-8"
            id="supporter-anomaly-alert">
            <div className="flex justify-start items-center">
              <img
                src={warningImg}
                alt="Warning Icon"
                className="warning-icon"
              />
              <p className="inline-block text-normal font-medium text-gray-850 tracking-wide ml-2 text-sm">
                Indicates an anomaly occurred during the reporting period. For
                more information see corresponding anomaly report, published
                earlier today
              </p>
            </div>
          </div>
        )}
    </React.Fragment>
  );
}
