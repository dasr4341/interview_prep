import { config } from 'config';
import { axiosClient } from '../axiosClient';
import { ReportLogPayload } from './logsApi.interface';
import { ApiResponse } from '../interface/apiConfig.interface';

export const logsApi = {
  getReportLogs: async <T>(payload: ReportLogPayload): Promise<ApiResponse<T>> => {
    const response: ApiResponse<T> = await axiosClient.post(config.apiEndPoints.reportLogs, payload);
    return response;
  },
};