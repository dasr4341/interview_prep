import axios, { AxiosError } from 'axios';
import { config } from 'config';
import eventEm from 'event-emitter';
import { resetState } from 'lib/api/users';

export const eventEmitter = eventEm();

export const axiosClient = axios.create({
  baseURL: config.pretaa.apiRoot
});

axiosClient.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return request;
  },
  (e) => Promise.reject(e)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (e: AxiosError) => {
    console.log('Axios Error', e.message, e.response);

    if (e.response?.status === 401) {
      // UNAUTHENTICATED
      eventEmitter.emit(config.emitter.tokenIncorrect);
      resetState();
    } else if (e.response?.status === 403) {
      // FORBIDDEN
      eventEmitter.emit(config.emitter.forBidden);
    }

    if (e.response?.data) {
      return Promise.reject(e.response?.data);
    } else {
      return  Promise.reject({ message:  e.message });
    }
  }
);
