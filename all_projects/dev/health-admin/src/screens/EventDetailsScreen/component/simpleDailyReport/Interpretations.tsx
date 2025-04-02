import { ChartNames, ReportTypes } from 'interface/chart.interfaces';
import React from 'react';

interface InterpretationDataType {
  reportType: string;
  anomalyType: Array<ChartNames>;
}

export default function Interpretations({ dataType }: { dataType: InterpretationDataType }) {
  const { reportType, anomalyType } = dataType ?? {};

  // get anomaly
  const heartInterAnomaly = anomalyType?.some((el) => el === ChartNames.heart);
  const stepsInterAnomaly = anomalyType?.some((el) => el === ChartNames.steps);
  const spo2InterAnomaly = anomalyType?.some((el) => el === ChartNames.spo2);
  const sleepInterAnomaly = anomalyType?.some((el) => el === ChartNames.sleep);
  const hrvInterAnomaly = anomalyType?.some((el) => el === ChartNames.hrv);
  const tempInterAnomaly = anomalyType?.some((el) => el === ChartNames.temp);

  // report type
  const dailyInterReport = reportType === ReportTypes.DailyReport;
  const specialInterReport = reportType === ReportTypes.SpecialReport;
  const weeklyInterReport = reportType === ReportTypes.WeeklyReport;
  const monthlyInterReport = reportType === ReportTypes.MonthlyReport;

  return (
    <div>
      <h3 className="font-semibold uppercase text-xs-md text-gray-850 mt-10 mb-5 tracking-widest">Interpretations</h3>

      {/* Biometrics Scale */}
      {dailyInterReport && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Biometrics Scale:</span>The Biometrics scale is an indicator of how
          many different physiological measurements are within or outside normal parameters.
        </p>
      )}

      {/* Anomaly Recognition */}
      {(dailyInterReport || specialInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Anomaly Recognition:</span>If a data point diverges from the
          expected range, we label it as an anomaly. We use several methods to identify these discrepancies. We review
          SpO2, HRV, Temp, and Sleep data, provided it's available for at least seven of the past ten days. We review
          Heart-rate and steps together against the previous day.
        </p>
      )}

      {/* Heart Rate */}
      {(((!!anomalyType && heartInterAnomaly) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Heart Rate:</span>Resting heart rate is the number of times your
          heart beats per minute while you are at rest, such as sitting or lying down. It is a measurement of your
          heart's efficiency and cardiovascular fitness level. A lower resting heart rate generally indicates a more
          efficient heart, which can be a sign of good health.
        </p>
      )}

      {/* Steps & Heart Rate */}
      {(((!!anomalyType && (heartInterAnomaly || stepsInterAnomaly)) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Steps & Heart Rate:</span>When monitoring Steps and Heart Rate,
          there exist four distinct categories of abnormal readings. The initial category pertains to a high heart rate
          during periods of low or no activity, which is the most prevalent anomaly. The second category includes a high
          heart rate coupled with high step count, followed by a low heart rate and high step count, and finally, a low
          heart rate and low step count. In each of these situations, an anomaly arises when the readings deviate
          significantly from the typical behavior.
        </p>
      )}

      {/* Sleep */}
      {(((!!anomalyType && sleepInterAnomaly) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Sleep:</span>Sleep volume refers to the amount of sleep a person
          gets in a given period of time. Adequate sleep volume is important for substance use recovery as it helps
          regulate mood, reduce cravings, and improve cognitive functioning. For individuals in recovery from substance
          use disorders, sleep disregulation can be particularly problematic, as it may interfere with their ability to
          manage cravings and maintain sobriety.
        </p>
      )}

      {/* SpO2 */}
      {(((!!anomalyType && spo2InterAnomaly) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">SpO2:</span>stands for peripheral capillary oxygen saturation. It is
          a measurement of the amount of oxygen in the blood, specifically the percentage of hemoglobin molecules in the
          blood that are saturated with oxygen. A high SpO² level is essential for the body's ability to detoxify and
          repair itself.
        </p>
      )}

      {/* HRV */}
      {(((!!anomalyType && hrvInterAnomaly) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm">Heart Rate Variability (HRV):</span>
          HRV is the change in time intervals between consecutive heartbeats and this measurement is the variability
          measured while you sleep. HRV is influenced by the balance between the sympathetic and parasympathetic nervous
          systems. It can be measured using specialized equipment or wearable devices, and is used in various fields
          including sports performance, mental health, and disease management. A healthy heart is one that can adapt to
          meet physical and psychological stimulation.
        </p>
      )}

      {/* Temperature */}
      {(((!!anomalyType && tempInterAnomaly) || (!anomalyType && specialInterReport)) || dailyInterReport || weeklyInterReport || monthlyInterReport) && (
        <p className="font-normal text-more text-gray-850 tracking-wide pb-4">
          <span className="font-bold mr-1 text-xsm1">Temperature:</span>Skin temperature refers to the temperature of
          the outermost layer of the skin. It is influenced by various factors such as the surrounding environment,
          physical activity, and blood flow to the skin. Changes in skin temperature can indicate underlying health
          conditions or physiological responses. The wearable establishes a baseline temperature over several sleep
          periods and displayed is the differences from that baseline temperature.
        </p>
      )}
    </div>
  );
}
