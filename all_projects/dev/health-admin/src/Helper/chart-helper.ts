import { config } from 'config';
import { addDays, format, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ReportTypes } from 'interface/chart.interfaces';
import { AppleHeartStepsCallbackProp, AppleHeartStepsChartData } from 'interface/heart-steps.interface';

export function averageFunction(data: any) {
  const values = data.chart.data.datasets[0].data.filter((e: number) => e);
  return values.reduce((a: number, b: number) => a + b, 0) / values.length;
}

export function getMonthAndDay(dateStr: string | number | Date) {
  // INFO: We are displaying user time date, which is provided by Fitbit 
  // Fitbit providing date without timezone ref with date string.
  // So if we convert to UTC date is same with which is provided 
  return `${formatInTimeZone(new Date(dateStr), 'UTC', config.monthDateFormat)}`;
}

export function getBarThicknessBreakpoint(data: Array<string | number | null>) {
  if (!data) {
    return 0;
  }
  if (data.length <= 7) {
    if (window.innerWidth <= 1199) {
      return 35;
    } else if (window.innerWidth <= 1399) {
      return 50;
    }
    return 55;
  } else if (data.length <= 16) {
    if (window.innerWidth <= 575) {
      return 15;
    } else if (window.innerWidth <= 767) {
      return 18;
    } else if (window.innerWidth <= 999) {
      return 25;
    } else if (window.innerWidth <= 1199) {
      return 18;
    } else if (window.innerWidth <= 1399) {
      return 23;
    } else if (window.innerWidth <= 1499) {
      return 30;
    } else if (window.innerWidth <= 1599) {
      return 38;
    } else if (window.innerWidth <= 1699) {
      return 44;
    }
    return 50;
  } else {
    if (window.innerWidth <= 575) {
      return 8;
    } else if (window.innerWidth <= 767) {
      return 10;
    } else if (window.innerWidth <= 999) {
      return 13;
    } else if (window.innerWidth <= 1199) {
      return 9;
    } else if (window.innerWidth <= 1399) {
      return 13;
    } else if (window.innerWidth <= 1499) {
      return 17;
    } 
    return 20;
  }
}

export function getPaddingBreakpoint(data: Array<number | null>) {
  if (data.some((e: number | null) => Number(e) < 0.5)) {
    return 15;
  }
  return 50;
}

export function monthDateYearFormatter(data: string | null | undefined) {

  if (!data) {
    // ✅ null or undefined
    return 'N/A';
  }

  if (data.includes('/')) {
    // ✅ 03/18/2023
    return data;
  }

  const isoRegex = /[0-9-]+T[0-9:.]+Z/gm;
  const matches = data?.match(isoRegex);
  if (matches?.length) {
    // ✅ ISO 
    // ✅ ISO - ISO
    return matches.map(match => format(new Date(match), config.dateFormat)).join(' - ');
  }

  if (data.includes('-')) {
    const dataSplit = data.split('-');
    
    if (dataSplit.length === 3) {
      // ✅ 2023-03-10
      return format(new Date(data), config.dateFormat);
    } else {
      // ✅ Dec 21 - Jan 21, 2023
      const [firstDate, lastDate] = data?.split(' - ');
      const [fLLL, fdd, fYYYY] = firstDate.replaceAll(',', '').split(' ');
      const [lLLL, ldd, lYYYY] = lastDate.replaceAll(',', '').split(' ');

      const start = parse([fLLL, fdd, fYYYY || lYYYY].join('/'), 'LLL/dd/yyyy', new Date());
      const end = parse([lLLL, ldd, lYYYY].join('/'), 'LLL/dd/yyyy', new Date());

      return [
        format(new Date(start), config.dateFormat),
        format(new Date(end), config.dateFormat)
      ].join(' - ');
    }
  }

  // If not execute above mentioned condition
  return 'N/A';
}

export function getBarChartAnomaly(data: boolean[]) {
  return data.map((el: boolean) => {
    if (el) {
      return 'rgba(234, 63, 42, 0.9)';
    }
    return '#DCDEDF';
  });
}

export function setBoundColor(lowerData?: number | null, upperData?: number | null): any {
  if ((lowerData || lowerData === 0) && upperData) {
    return {
      areaBackground: {
        type: 'box',
        yMin: lowerData,
        yMax: upperData,
        backgroundColor: 'rgba(11, 151, 59, 0.12)',
        borderWidth: 0,
      },
    };
  }
}

export function setBackgroundColor(lowerData?: number | null, upperData?: number | null): any {
  if ((lowerData || lowerData === 0) && upperData) {
    // If lowerData bigger than 0
    if (lowerData > 0) {
      return {
        areaBackground1: {
          type: 'box',
          yMin: 0,
          yMax: lowerData,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderWidth: 0,
        },
        areaBackground2: {
          type: 'box',
          yMin: lowerData,
          yMax: upperData,
          backgroundColor: 'rgba(11, 151, 59, 0.12)',
          borderWidth: 0,
        },
        areaBackground3: {
          type: 'box',
          yMin: upperData,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderWidth: 0,
        },
      };
    }
    // If lowerData equal to 0
    return {
      areaBackground: {
        type: 'box',
        yMin: lowerData,
        yMax: upperData,
        backgroundColor: 'rgba(11, 151, 59, 0.12)',
        borderWidth: 0,
      },
      areaBackground2: {
        type: 'box',
        yMin: upperData,
        backgroundColor: 'rgba(255, 99, 132, 0.25)',
        borderWidth: 0,
      },
    };
  }
  // if lowerData & upperData value have negative value 
  return {
    fullBackground: {
      type: 'box',
      backgroundColor: 'rgba(255, 99, 132, 0.25)',
      borderWidth: 0,
    },
  };
}

export function getMaxScaleValue(data:Array<number | null>, lowerBoundValue?: number | null, upperBoundValue?: number | null) {
  const convertToNumber = data.map((el: number | null) => Number(el));
  const getMinNumber = Math.min(...convertToNumber);
  const convertNegetiveToPositive = data.map((el: number | null) => Math.abs(Number(el)));
  const getMaxNumber = Math.max(...convertNegetiveToPositive);

  if (lowerBoundValue && upperBoundValue && getMinNumber > lowerBoundValue && getMaxNumber < upperBoundValue) {
    return {
      min: lowerBoundValue,
      max: upperBoundValue
    };
  } else if (data.length > 10 && getMinNumber < 0 && getMaxNumber > 0) {
    return {
      min: getMaxNumber * -1,
      max: getMaxNumber
    };
  } else if (data.length <= 7 && getMinNumber < 0 && getMaxNumber > 0) {
    return {
      min: (getMaxNumber + 4) * -1,
      max: getMaxNumber + 4
    };
  } else if (getMaxNumber === 0 && getMinNumber === 0) {
    return {
      min: 0,
      max: 10
    };
  }
  return {
    min: getMinNumber,
    max: getMaxNumber
  };
}

export function responsiveChartHeight() {
  if (window.innerWidth <= 1199) {
    return '150';
  } else if (window.innerWidth <= 1499) {
    return '110';
  } else if (window.innerWidth <= 1599) {
    return '90';
  } else if (window.innerWidth <= 1699) {
    return '80';
  }
  
  return '65';
}

export function responsiveBarFontAndOffset(data: Array<number | null>) {
  if (!data) {
    return {
      labelFontSize: 0,
      labelOffset: 0,
      xAxisFontSize: 0
    };
  }
  if (data.length <= 7) {
    if (window.innerWidth <= 767) {
      return {
        labelFontSize: 13,
        labelOffset: 7,
        xAxisFontSize: 12
      };
    } else if (window.innerWidth <= 1299) {
      return {
        labelFontSize: 15,
        labelOffset: 9,
        xAxisFontSize: 13
      };
    }
    return {
      labelFontSize: 16,
      labelOffset: 11,
      xAxisFontSize: 14
    };
    
  } else if (data.length > 7 && data.length <= 16) {
    if (window.innerWidth <= 767) {
      return {
        labelFontSize: 10,
        labelOffset: 5,
        xAxisFontSize: 10
      };
    } else if (window.innerWidth <= 1299) {
      return {
        labelFontSize: 12,
        labelOffset: 7,
        xAxisFontSize: 11
      };
    } else if (window.innerWidth <= 1499) {
      return {
        labelFontSize: 14,
        labelOffset: 8,
        xAxisFontSize: 12
      };
    } else if (window.innerWidth <= 1699) {
      return {
        labelFontSize: 15,
        labelOffset: 9,
        xAxisFontSize: 13
      };
    }
    return {
      labelFontSize: 16,
      labelOffset: 10,
      xAxisFontSize: 14
    };
  } else if (data.length > 16) {
    if (window.innerWidth <= 767) {
      return {
        labelFontSize: 8,
        labelOffset: 7,
        xAxisFontSize: 10
      };
    } else if (window.innerWidth <= 999) {
      return {
        labelFontSize: 11,
        labelOffset: 7,
        xAxisFontSize: 10
      };
    } else if (window.innerWidth <= 1199) {
      return {
        labelFontSize: 9,
        labelOffset: 7,
        xAxisFontSize: 10
      };
    } else if (window.innerWidth <= 1399) {
      return {
        labelFontSize: 11,
        labelOffset: 7,
        xAxisFontSize: 11
      };
    } else if (window.innerWidth <= 1499) {
      return {
        labelFontSize: 13,
        labelOffset: 8,
        xAxisFontSize: 12
      };
    }
    return {
      labelFontSize: 16,
      labelOffset: 11,
      xAxisFontSize: 14
    };
  }
}

// formatted array for scatter chart weekly and monthly
export function getXLabelData(data: Array<AppleHeartStepsChartData>) {
  return data.reduce((acc, curr) => {
    const newDate = getMonthAndDay(curr.label.split(' ')[0]);
    if (!acc.includes(newDate)) {
      acc.push(newDate);
    }
    return acc;
  }, [] as string[]);
}

// scatter chart tick's max, min and step number
export function xTickStepNumber(data: Array<AppleHeartStepsChartData>, reportDataType?: string) {
  const maxX = Math.max(...data.map(el => el.x) as Array<number>);
  const minX = Math.min(...data.map(el => el.x) as Array<number>);

  let xTickStep: number | null = null;
  if (reportDataType === ReportTypes.DailyReport || reportDataType === ReportTypes.SpecialReport) {
    xTickStep = (maxX - minX) / data.length;
  } else if (reportDataType === ReportTypes.WeeklyReport  || reportDataType === ReportTypes.MonthlyReport ) {
    xTickStep = (maxX - minX) / getXLabelData(data).length;
  }
  
  return { maxX, minX, xTickStep };
}

// scatter chart callback x label
export function appleHeartStepsCallback(data: AppleHeartStepsCallbackProp) {
  const { value, indexNumber, reportType, heartData } = data ?? {};
  // tmiestring to hh, mm, AM/PM
  const timeString = heartData[Math.round(Number(value))]?.label;
  const [hh, mm, a] = timeString.split(/[:\s]/);

  // first and last index item
  const firstIndexItem = heartData[0]?.label;
  const lastIndexItem = heartData[heartData.length - 1]?.label;

  // if has 12:00 AM/12:00 PM
  const has12AMPM = timeString === '12:00 AM' || timeString === '12:00 PM';
  const hasSpecial12AMPM = (timeString === '12:00 AM' || timeString === '12:01 PM') || (timeString === '12:01 AM' || timeString === '12:00 PM');
  const specialReportAMPM = (firstIndexItem === '12:00 AM' || firstIndexItem === '12:00 PM') ? has12AMPM : hasSpecial12AMPM; 

  // report type
  const dailyReport = reportType === ReportTypes.DailyReport;
  const specialReport = reportType === ReportTypes.SpecialReport;
  const weeklyReport = reportType === ReportTypes.WeeklyReport;
  const monthlyReport = reportType === ReportTypes.MonthlyReport;

  // daily report label
  if (dailyReport) {
    if (has12AMPM) {
      return `${hh} ${a}`;
    } else if (lastIndexItem === timeString) {
      return '12 AM';
    }
    return;
  } 

  // special report label
  if (specialReport) {
    if (((Number(value) > 59 && Number(value) < (heartData.length - 1) - 60) && specialReportAMPM) || (firstIndexItem === timeString && mm === '00')) {
      return `${hh} ${a}`;
    }

    if ((firstIndexItem === timeString && mm !== '00') || lastIndexItem === timeString) {
      if (timeString === '11:59 PM') {
        return '12 AM';
      }
      return `${hh}:${mm} ${a}`;
    }
  
    return;
  } 
  
  // weekly and monthly report label
  if (weeklyReport || monthlyReport) {
    if (value === heartData.length - 1) {
      const result = new Date(timeString.split(' ')[0]);
      return format(new Date(addDays(result, 1)), config.monthDateFormat);
    }
    return getXLabelData(heartData)[indexNumber];
  }

  return timeString;
}
