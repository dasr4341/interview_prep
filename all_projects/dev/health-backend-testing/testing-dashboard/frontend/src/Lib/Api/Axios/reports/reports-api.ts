import { ReportsData } from 'Page/Dashboard/Test/Reports/ReportsData.interface';
import { axiosClient } from '../axiosClient';
import { GetReportsTestPayload } from './reports-api.interface';
import { config } from 'config';

export const reportsApi = {
  getReports: (payload: GetReportsTestPayload): Promise<ReportsData> => {
    return axiosClient.post(config.apiEndPoints.reportTestData, payload);
  },
};
