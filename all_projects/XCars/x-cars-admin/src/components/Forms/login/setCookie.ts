'use server';
import { cookies } from 'next/headers';

const setCookie = async (key: string, value: string) => {
  cookies().set(key, value);
};
export default setCookie;

export const resetCookie = (key: string) => {
  console.log(`reset ${key} from cookie !!!!`);
  cookies().delete(key);
};

export const getCookie = (key: string) => {
  return cookies().get(key)?.value;
};
