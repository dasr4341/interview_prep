import { Request, Response, NextFunction } from 'express';
import { ReportLogsPayload, reportLogsPayload } from '../../../lib/db/service/logs/logsSchema';
import { getReportLogs } from '../../../lib/db/service/logs/logs';
import { EnvironmentList } from '../../../config/config.enum';
import { responseLib } from '../../../lib/response.lib';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../../../config/messageData';

export const reportLogsController = async function (req: Request, res: Response, next: NextFunction) {
  const payload: ReportLogsPayload = req.body;
  try {
    reportLogsPayload.parse(payload);
  } catch (e) {
    next(e);
  }

  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    const reportLogs = await getReportLogs(req.body, dbInstance);

    // res.json({
    //   message: 'Report Logs max limit 20',
    //   payload: req.body,
    //   reportLogs: reportLogs?.rows || [],
    // });

    console.log(reportLogs?.rows);
    

    responseLib.success(res, {
      status: StatusCodes.OK,
      message: `${messageData.fetchedDataSuccessfully}  ${messageData.reportLogsInfo}`,
      data: reportLogs?.rows || []
    });

  } catch (e) {
    next(e);
  }
};
