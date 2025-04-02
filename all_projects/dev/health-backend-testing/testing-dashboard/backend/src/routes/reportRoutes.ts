import { Router } from 'express';
import { healthReportController } from '../modules/controller/report/healthReportController';

export default (router: Router) => {
    router.post('/reports/reports-test-data', healthReportController);
}