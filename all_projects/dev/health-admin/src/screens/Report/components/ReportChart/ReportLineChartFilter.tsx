import { LineChartDataSetInterface } from 'interface/charts/line-chart.interface';

export default function ReportLineChartFilter({
  allBarChartDatasets,
  filterBarChart,
  filterSelected,
}: {
    allBarChartDatasets: LineChartDataSetInterface[],
    filterBarChart: (key: number) => void;
    filterSelected: number;
}) {
  return (
        <div className="flex md:flex-col justify-start content-center ">
          {allBarChartDatasets.map((chartElement) => {
            return (
              <div className="flex flex-row items-center my-2 " key={chartElement.key}>
                <div className='w-3  h-3 cursor-pointer' style={{ backgroundColor: chartElement.backgroundColor }}></div>
                <div onClick={() => filterBarChart(Number(chartElement.key))}
                  className={`pl-2 md:pl-5 text-gray-600 
                  ${filterSelected > 0 && filterSelected === chartElement.key ? 'font-bold cursor-pointer text-xss' : 'pr-4 md:pr-0 cursor-pointer text-xss'}`}>
                  {chartElement.label}
                </div>
              </div>
            );
          })}
        </div>
  );
}
