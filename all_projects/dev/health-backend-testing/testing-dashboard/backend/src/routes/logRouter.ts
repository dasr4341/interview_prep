import { Router } from 'express';
import { reportLogsController } from '../modules/controller/logs/logsContoller';

export default (router: Router) => {
    router.post('/logs/report-logs', reportLogsController);
}