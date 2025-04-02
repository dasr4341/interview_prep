import { axiosClient } from 'axios-api/axiosClient';

export interface ContactToCounselorResponse {
  message: string;
}

export const contactToCounselor = (date: string): Promise<ContactToCounselorResponse> => {
  return axiosClient.post('/notification', {
    date
  });
};