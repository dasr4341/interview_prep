import axios, { AxiosError } from 'axios';
import { config } from 'config';
import { resetToken } from 'Lib/HelperFunction/resetToken';
import { toast } from 'react-toastify';
import eventEm  from 'event-emitter';

export const eventEmitter = eventEm();

export const apiConfig = axios.create({
  baseURL: process.env.REACT_APP_SNAPMS_BACKEND_URL,
});

apiConfig.interceptors.request.use(
  (configuration) => {
    configuration.headers = {
      Authorization: 'Bearer ' + localStorage.getItem(config.storage.token),
    };
    return configuration;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiConfig.interceptors.response.use(
  (response) => response,
  (error: AxiosError | any) => {
    if (error.response?.status === 401 || error.response?.data?.error.includes('JWT Token not valid')) {
      eventEmitter.emit(config.emitter.tokenIncorrect);
      resetToken();
    }
    throw error;
  }
);

export function handleError(error: AxiosError) {
  console.error(error);
  if (error.code === 'ERR_BAD_REQUEST') {
    toast.error('API ERR_BAD_REQUEST!', { toastId: 'ERR_BAD_REQUEST' });
  } else if (error.code === 'ERR_NETWORK') {
    toast.error('Error Network!', { toastId: 'ERR_NETWORK' });
  } else {
    toast.error(error.message);
  }
}
