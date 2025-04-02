import { ReportTypes, TimeSeriesData } from 'interface/chart.interfaces';
import { AppleHeartStepsChartData, HeartStepsData, HeartStepsCallbackProp } from 'interface/heart-steps.interface';
import { getMonthAndDay } from './chart-helper';
import { addDays, format } from 'date-fns';
import { config } from 'config';

export function getHeartStepsAnomaly(data: TimeSeriesData[]) {
  if (data) {
    return data.map((el: TimeSeriesData) => {
    return {
        type: 'point',
        radius: 3,
        xValue: `${el.time}`,
        yValue: `${el.value}`,
        backgroundColor: 'rgba(228, 15, 2, 0.6)',
        borderWidth: 0
      };
    });
  }
  return {};
}

export function getHeartStepsData(data: HeartStepsData[]) {
  const labels: string[] = [];
  const dataSets: Array<number | null> = [];
  data.forEach((element: HeartStepsData) => {
    labels.push(element.time);
    dataSets.push(element.value);
  });
  return { labels, dataSets };
}

export function getScatterHeartStepsData(data: HeartStepsData[]) {
  return data.map((el, i) => ({ x: i, y: el.value, label: el.time })) as AppleHeartStepsChartData[];
}
export function getScatterHeartStepsAnomalyData(data: HeartStepsData[], pointerAnomalyData: any) {
  const getAppleHeartLabel = getScatterHeartStepsData(data).map((el: any) => (el.label));
  return pointerAnomalyData.map((el: any) => {
    return {
      time: getAppleHeartLabel.indexOf(`${el.time}`),
      value: el.value
    };
  });
}

export function formatDataLabels(data: string[], reportType: string | undefined, tickValue: number | undefined) {
  if (reportType === ReportTypes.WeeklyReport || reportType === ReportTypes.MonthlyReport) {
    return data.map((el, i, a) => {
      if ((a[a.length - 1].split(' ')[0]) === (a[a.length - (Number(tickValue) - 1)].split(' ')[0]) && i === a.length - 1) {
        const date = new Date(el.split(' ')[0]);
        return format(new Date(addDays(date, 1)), config.monthDateFormat);
      }
      return getMonthAndDay(el.split(' ')[0]);
    });
  }
  return data;
}

export function heartStepsCallback(callBackProps: HeartStepsCallbackProp) {
  const {callbackArgument, labelsData, typeOfReport} = callBackProps ?? {};

  // tmiestring to hh, mm, AM/PM
    const timeString = labelsData[callbackArgument];
    const [hh, mm, a] = timeString.split(/[:\s]/);

    // first and last index item
    const firstIndexItem = labelsData[0];
    const lastIndexItem = labelsData[labelsData.length - 1];
  
    // if has AM/PM
    const hasAMPM = firstIndexItem.includes("AM") || firstIndexItem.includes("PM");
  
    // if has 12:00 AM/12:00 PM
    const has12AMPM = timeString === "12:00 AM" || timeString === "12:00 PM";
  
    // report type
    const dailyReport = typeOfReport === ReportTypes.DailyReport;
    const specialReport = typeOfReport === ReportTypes.SpecialReport;
    const weeklyReport = typeOfReport === ReportTypes.WeeklyReport;
    const monthlyReport = typeOfReport === ReportTypes.MonthlyReport;
  
    // daily report label
    if (dailyReport && hasAMPM) {
      if (has12AMPM) {
        return `${hh} ${a}`;
      } else if (lastIndexItem === timeString) {
        return "12 AM";
      }
      return;
    }
  
    // special report label
    if (specialReport && hasAMPM) {
      if ((callbackArgument > 59 && callbackArgument < (labelsData.length - 1) - 60 && has12AMPM) || (firstIndexItem === timeString && mm === "00")) {
        return `${hh} ${a}`;
      }
      if ((firstIndexItem === timeString && mm !== "00") || lastIndexItem === timeString) {
        if (timeString === '11:59 PM') {
          return '12 AM';
        }
        return `${hh}:${mm} ${a}`;
      }
    
      return;
    }
  
    // weekly and monthly report label
    if (weeklyReport || monthlyReport) {
      const result = new Date(timeString.split(' ')[0]);
      if (callbackArgument === labelsData.length - 1) {
        return format(new Date(addDays(result, 1)), config.monthDateFormat);
      }

      return getMonthAndDay(result);
    }
  
    return timeString;
  }