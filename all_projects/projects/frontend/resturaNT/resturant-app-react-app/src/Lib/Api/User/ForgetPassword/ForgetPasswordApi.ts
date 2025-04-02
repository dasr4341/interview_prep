
import { ForgetPasswordApiResponse, ForgetPasswordPayload } from '../../../Interface/User/UserInterface';
import axiosInstance from '../../Axios/axios';

async function forgetPassword(payload: ForgetPasswordPayload): Promise<ForgetPasswordApiResponse> {
  const { data } = await axiosInstance.post('/user/forget-password', payload);
  return data as ForgetPasswordApiResponse;
}

export default forgetPassword;
