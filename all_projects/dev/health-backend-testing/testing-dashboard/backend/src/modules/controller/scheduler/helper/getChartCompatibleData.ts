import { formatInTimeZone, format } from "date-fns-tz";
import { config } from "../../../../config/config";

export function getChartCompatibleData1(transFormedSchedularData: { label: string; value: string }[], xAxisLabels: string[]) {
  const chartFormattedData: {
    [key: string]: {
        data: number[],
        label: string,
        backgroundColor: string
      }
  } = {};
  
    transFormedSchedularData.forEach((data, i) => {
    
      if (!chartFormattedData[data.label]) {
        chartFormattedData[data.label] = {
          data: new Array(xAxisLabels.length - 1).fill(0),
          'label': data.label,
          'backgroundColor': '#' + config.colors[i]
        };
      }
      
      for (let index = 0; index < xAxisLabels.length - 1; index++) {
        
        const axis = xAxisLabels[index];
        const axis2 = xAxisLabels[index + 1];
  
        const [date, hr, min] = formatInTimeZone(new Date(data.value), 'UTC', 'dd-HH-mm').split('-');
        
        const [ axisDate1, axisHr1, axisMin1 ] = formatInTimeZone(new Date(axis), 'UTC', 'dd-HH-mm').split('-');
        const [ axisDate2, axisHr2, axisMin2 ] = formatInTimeZone(new Date(axis2), 'UTC', 'dd-HH-mm').split('-');
       
        const currentRange = hr + min;
  
        const range = {
          start: axisHr1 + axisMin1,
          end: axisHr2 + axisMin2
        };
  
        if (date >= axisDate1 && axisDate2 <= date && (currentRange >= range.start && range.end <= currentRange)) {
          chartFormattedData[data.label].data[index] = 1;
        } 

      }
    });
  
    return {
      data: Object.values(chartFormattedData),
      labels: xAxisLabels,
      maxLen: xAxisLabels.length
    };
}

export function getChartCompatibleData(transFormedSchedularData: { label: string; value: string }[], xAxisLabels: string[], rawData:any) {
  const chartFormattedData: {
    [key: string]: {
        data: number[],
        label: string,
        backgroundColor: string
      }
  } = {};
  
 Object.entries(rawData).forEach((schedular, i) => {
    const [label, dates] = schedular;

  let  count = 0;

    if (!chartFormattedData[label]) {
      chartFormattedData[label] = {
        data: new Array(xAxisLabels.length - 1).fill(0),
        'label': label,
        'backgroundColor': config.colors[i]
      };
    }

    for (let index = 0; index < xAxisLabels.length ; index++) {
     
     
      const currentAxis = xAxisLabels[index];
     

      const [currentDate, currentHr, currentMin] = formatInTimeZone(new Date(currentAxis), 'UTC', 'dd-HH-mm').split('-');
      
      const nextMin = Number(currentMin) + 15;
      const prevMin = Number(currentMin) - 15;

        for (let j = 0; j < (dates as string[]).length; j++) {
          const date = (dates as string[])[j];
          const [d, hr, min] = formatInTimeZone(new Date(date), 'UTC', 'dd-HH-mm').split('-');

          if (currentDate === d && currentHr === hr
            &&
            ((currentMin >= min && (currentMin === min || prevMin < Number(min)))
              ||
            (nextMin > Number(min) &&  Number(min) > Number(prevMin)))) {
            
            chartFormattedData[label].data[index] = 1;
            console.log(date, currentAxis, d, hr, min, '||', currentDate, currentHr, currentMin, index);
            count++;
            break;
          } 
        }

    }
  
  });
    
  
    return {
      data: Object.values(chartFormattedData),
      labels: xAxisLabels.map(date =>  format(new Date(date), 'yyyy-MM-dd HH:mm')),
      maxLen: xAxisLabels.length
    };
  }