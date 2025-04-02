import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appEventBus, appEvents } from '../../EventBus/global-event-bus';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_RESTAURANT_APP_BACKEND_URL,
});
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers = {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    };

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers = {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    };

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      appEventBus.emit(appEvents.invalidAuthToken);
    }
    throw error;
  }
);

export default axiosInstance;

export function apiErrorHandler({ error, toastMessage }: { error: AxiosError; toastMessage?: boolean }) {
  console.error('API error', error);
  if (error && toastMessage) {
    const errorResponse = error.response?.data as { message?: string };
    toast.error(errorResponse.message || error.message);
  }
}
