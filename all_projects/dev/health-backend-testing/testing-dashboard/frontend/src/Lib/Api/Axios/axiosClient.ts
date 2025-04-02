import axios, { AxiosError } from 'axios';
import { config } from 'config';
import { getDbCurrentInstance } from 'helper/dbInstance';

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

axiosClient.interceptors.request.use(
    (request: any) => {
      request.headers = {
        db_instance: getDbCurrentInstance() ?? config.environment.defaultEnv
      };
      return request;
  },
  );

axiosClient.interceptors.response.use(
  (response) => response.data,
  (e: AxiosError) => {
    console.log(e);
    return Promise.reject(e.response?.data);
  }
);
