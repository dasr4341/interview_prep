import { BarChartFiltersInterface } from 'interface/charts/barChart.interface';

export default function ReportBarChartFilters({
  allBarChartDatasets,
}: BarChartFiltersInterface) {
  return (
        <div className="flex md:flex-col justify-start content-center sm:flex-row flex-col ">
          {allBarChartDatasets.map((chartElement) => {
            return (
              <div className="flex flex-row items-center my-2 " key={chartElement.key}>
                <div className='w-3  h-3' style={{ backgroundColor: chartElement.backgroundColor }}></div>
                <div 
                  className={'pl-2 md:pl-5 text-gray-600  pr-4 md:pr-0 text-xss'}>
                  {chartElement.label}
                </div>
              </div>
            );
          })}
        </div>
  );
}
