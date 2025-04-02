'use server';
import { cookies } from 'next/headers';

const setCookieAuthToken = (accessToken: string) => {
  cookies().set('authToken', accessToken);
};
export default setCookieAuthToken;

export const resetCookie = () => {
  cookies().delete('authToken');
};

export const getCookieAuthToken = () => {
  return cookies().get('authToken');
};
