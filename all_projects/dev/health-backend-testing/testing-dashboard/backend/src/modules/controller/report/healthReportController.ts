import { Request, Response, NextFunction } from 'express';
import { userQueryForReport } from '../../../lib/db/service/users/userQueryForDailyReport';
import { getReportEventList } from '../../../lib/db/service/events/getReportEventsList';
import { reportFilterSchema } from './reportFilterSchema';
import { ReportEvent, ReportTableColumnKeys, ReportTestResponse, UserObject, reportTestDataColumns } from '../../../interface/report.interface';
import { EnvironmentList } from '../../../config/config.enum';

export const healthReportController = async function (req: Request, res: Response, next:NextFunction ) {
  try {
    reportFilterSchema.parse(req.body);
  } catch (e) {
    next(e);
  }

  try {
    const dbInstance = req.headers['db_instance'] as EnvironmentList;
    
    const userResponse = await userQueryForReport(req.body, dbInstance);
    const eventResponse = await getReportEventList(req.body,  dbInstance);

    const rowsData =
      userResponse?.rows.map((u: UserObject) => {
        const userEvents = eventResponse?.rows.filter((e: ReportEvent) => e.patient_id === u.id) || [];
        const row: any = {};

        row[ReportTableColumnKeys.fullName] = `${u.first_name} ${u.last_name}`;
        row[ReportTableColumnKeys.no_report_count] = userEvents.filter((e: ReportEvent) => e.no_report).length;
        row[ReportTableColumnKeys.report_count] = userEvents.filter((e: ReportEvent) => !e.no_report).length;
        row[ReportTableColumnKeys.events] = userEvents;
        row[ReportTableColumnKeys.email] = u.email;
        row[ReportTableColumnKeys.fitbit_user_id] = u.fitbit_user_id;
        row[ReportTableColumnKeys.user_id] = u.id;
        row[ReportTableColumnKeys.total_events] = userEvents.length;
        row[ReportTableColumnKeys.in_patient] = u.in_patient;
        row[ReportTableColumnKeys.discharge_date] = u.discharge_date || null;
        row[ReportTableColumnKeys.total_events] = userEvents.length;
        return row;
      }) || [];

    const reportTestData: ReportTestResponse = {
      message: 'health report test',
      payload: req.body,
      table: {
        columns: reportTestDataColumns,
        rows: rowsData,
      },
      userResponse: {
        rowsCount: userResponse?.rowCount,
        rows: userResponse?.rows,
      },
      eventResponse: {
        rowsCount: eventResponse?.rowCount,
        rows: eventResponse?.rows,
      },
    };

    res.json(reportTestData);
  } catch (e) {
    next(e);
  }
};
