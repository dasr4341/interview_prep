import { config } from 'config';
import { axiosClient } from '../axiosClient';
import { ApiResponse } from 'Lib/Api/interface/ApiResponse.interface';

export const facilitiesApi = {
  getFacilities: async <T>(): Promise<ApiResponse<T>> => {
    const response: ApiResponse<T> = await axiosClient.post(
      config.apiEndPoints.facilitiesList
    );
    return response;
  },
};
