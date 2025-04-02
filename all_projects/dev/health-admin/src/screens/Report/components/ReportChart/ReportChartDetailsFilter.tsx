import {
  DoughnutDetailsChartFiltersInterface,
  FilterStyleEnum,
} from 'interface/charts/dougnutChart.interface';
import phqImg from '../../../../assets/images/phq.svg';

export default function ReportChartDetailsFilter({
  allDoughnutChartDatasets,
  filterDoughnutChart,
  filterSelected,
  filterStyle,
  templateTitle,
}: DoughnutDetailsChartFiltersInterface) {
  return (
    <>
      <div className="ml-20">
        <div className="flex gap-2">
          <img
            src={phqImg}
            alt="shape"
            className=""
          />
          <div className="font-medium text-xsmd capitalize text-gray-600">
            {templateTitle}
          </div>
        </div>

        <div className="font-medium text-xsmd capitalize text-gray-600 pb-3.5 pl-7">
          Score breakdown
        </div>
        <div className='pl-7'>
          {allDoughnutChartDatasets?.map((each, index1) => {
            return (
              <div key={each?.id}>
                {each?.dataWithKeys?.map((el: any) => {
                  return (
                    <div
                      key={String(el?.key)}
                      className={`flex flex-row items-center 
                    ${
                      filterStyle === FilterStyleEnum.style2
                        ? 'py-3 px-4  border-2 rounded-lg '
                        : ' pb-3 md:pb-5 pt-1 md:pt-2 border-b-2 last:border-b-0'
                    }`}>
                      <div
                        className="w-2.5 h-2.5"
                        style={{
                          backgroundColor: String(el.background),
                        }}></div>
                      <span className="pl-2 font-extrabold text-xmd md:text-smd ">
                        {el.value}
                      </span>
                      <button
                        className={`pl-2 md:pl-10 text-left  capitalize  text-xss ${
                          Boolean(Number(el.value))
                            ? 'cursor-pointer'
                            : 'cursor-text'
                        }  ${
                          filterSelected > 0 && filterSelected === el.key
                            ? ' text-black font-bold'
                            : 'font-medium text-gray-600 '
                        }`}
                        onClick={() => {
                          if (Boolean(Number(el.value))) {
                            filterDoughnutChart(el.key, index1);
                          }
                        }}>
                        {el.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
