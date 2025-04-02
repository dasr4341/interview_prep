import { DoughnutChartFiltersInterface, FilterStyleEnum } from 'interface/charts/dougnutChart.interface';
import { useContext, useEffect, useRef } from 'react';
import { PoorSurveyDetailContext } from '../PoorSurveyScores/PoorSuvreyContext';
import { useLocation } from 'react-router-dom';
import { routes } from 'routes';

function getLabel(value: number) {
  const limit = 1000;
  if (value > limit) {
    return value / limit + 'K';
  }
  return value;
}

export default function ReportDoughnutChartFilter({
  allDoughnutChartDatasets,
  filterDoughnutChart,
  filterSelected,
  filterStyle,
  clickedOption,
  labelClickable
}: DoughnutChartFiltersInterface) {
  const { updateTemplateDetail, updateToggleReport } = useContext(PoorSurveyDetailContext);
  const previouslyClickedOption = useRef<string | null>(null);
  const location = useLocation();
  const poorSurveyLocation = location.pathname.includes(routes.report.poorSurveyScores.match);

  // remove previous selected option
  useEffect(() => {
    if (clickedOption) {
      previouslyClickedOption.current = null;
    }
  }, [clickedOption]);

  /*
  Info: 
  Basically mentioned templates does not contains breakdown so cursers pointer not needed 
  */
  function filterTextCursorPoint(label: string) {
    if (!labelClickable) {
      return true;
    }
    return ['BAM-R', 'BAM-IOP', 'URICA'].some((e) => label.includes(e));
  }

  return (<div
        className={`grid mt-8 md:mt-0 grid-cols-1 ${
          filterStyle === FilterStyleEnum.style1 && ' md:pl-28'
        } items-center ${poorSurveyLocation && 'w-4/4'}`}>
        {allDoughnutChartDatasets.map((each, index1) => {
          return (
            
            <div
              className={`${
                filterStyle === FilterStyleEnum.style2
                  ? 'grid sm:grid-cols-2 grid-cols-1 w-full'
                  : 'flex flex-col gap-4'
              }  gap-4 `}
              key={each?.id}>
              
              {each?.dataWithKeys.map((el: any) => {
                return (
                  <div
                    key={String(el?.key)}
                    onClick={() => {
                      if (filterTextCursorPoint(el.label) || !Boolean(Number(el.value))) { 
                        return;
                      }
                      filterDoughnutChart(el.key, index1);
                      if (previouslyClickedOption.current && previouslyClickedOption.current === el.label) {
                        previouslyClickedOption.current = null;
                        updateToggleReport(false);
                        updateTemplateDetail('');
                      } else {
                        previouslyClickedOption.current = el.label;
                        updateToggleReport(true);
                        updateTemplateDetail(el.code);
                      }
                    }}
                    className={`flex flex-row  items-center 
                    ${filterTextCursorPoint(el.label) || !Boolean(Number(el.value)) ? ' cursor-not-allowed  pointer-events-none' : 'cursor-pointer'}
                    ${
                      filterStyle === FilterStyleEnum.style2
                        ? 'py-3 px-4 w-full border-2 rounded-lg'
                        : ' pb-3 md:pb-5 pt-1 md:pt-2 border-b-2 last:border-b-0'
                    } 
                    ${
                      filterSelected > 0 &&
                      filterSelected === el.key &&
                      poorSurveyLocation &&
                      ' border border-black px-1 last:border-b'
                    } `}>
                    <div className=" flex items-center justify-start ">
                      <div
                        className="w-2.5 h-2.5 pr-2.5"
                        style={{ backgroundColor: String(el.background) }}></div>
                      <div
                        style={{ wordBreak: 'keep-all' }}
                        className={`pl-2 font-extrabold text-sm md:text-smd  ${
                          filterStyle === FilterStyleEnum.style2 ? '' : 'pr-2 md:pr-0'
                        } `}>
                        {getLabel(Number(el.value || 0))}
                      </div>
                    </div>
                    <div
                      style={{ wordBreak: 'keep-all' }}
                      className={` pl-4 text-justify capitalize  
                      text-xss 
                        ${
                          filterSelected > 0 && filterSelected === el.key
                            ? ' text-black font-bold'
                            : 'font-medium text-gray-600 '
                        }`}>
                      {el.label}
                    </div>
                  </div>
                );
              })}

            </div>
          );
        })}
      </div>
  );
}
