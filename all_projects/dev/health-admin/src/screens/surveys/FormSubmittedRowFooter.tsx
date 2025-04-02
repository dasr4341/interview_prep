export function FormSubmittedRowFooter({
  browser,
  os,
  startTime,
  endTime,
  device,
  IPAddress,
  timeZone
}: {
  browser: string;
  os: string;
  endTime: string;
  startTime?: string;
  device: string;
  IPAddress: string;
  timeZone: string;
}) {
  return (
    <div>
      <hr className="border-t border-gray-150" />
      <div className="flex flex-col md:flex-row 2xl:flex-col text-sm text-pt-primary mb-4 md:justify-between 2xl:justify-normal page-breaker">
        <div className="flex flex-wrap flex-col 2xl:flex-row mt-6 ml-2 mr-2">
          <div className="2xl:flex-1">
            <span>Timezone of user taking assessment: </span>
            <span>{timeZone || 'N/A'}</span>
          </div>
          <div className="2xl:flex-1">
            <span>Browser: </span>
            <span>{browser || 'N/A'}</span>
          </div>
          <div className="2xl:flex-1">
            <span>Device(OS): </span>
            <span className="capitalize">{os || 'N/A'}</span>
          </div>
        </div>
        <div className="flex flex-wrap flex-col 2xl:flex-row md:mt-6 2xl:mt-0 m-2">
          <div className="2xl:flex-1">
            <span>Time started: </span>
            <span>{startTime || 'N/A'}</span>
          </div>

          <div className="2xl:flex-1">
            <span>IP: </span>
            <span>{IPAddress || 'N/A'}</span>
          </div>
          <div className="2xl:flex-1">
            <span>Device: </span>
            <span className="capitalize">{device || 'N/A'}</span>
          </div>
        </div>
        <div className="md:mt-6 2xl:mt-0 2xl:flex-1 ml-2 mr-2 ">
          <span>Finish time: </span>
          <span>{endTime || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
