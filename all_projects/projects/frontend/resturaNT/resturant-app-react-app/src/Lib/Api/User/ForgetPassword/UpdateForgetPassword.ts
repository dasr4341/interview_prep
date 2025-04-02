import { ForgetPasswordApiResponse, UpdateForgetPasswordPayload } from '../../../Interface/User/UserInterface';
import axiosInstance from '../../Axios/axios';

// the api response for --> forget password & update forget password are same 
// so the return type --> updateForgetPassword (below) Promise<ForgetPasswordApiResponse> is used
async function updateForgetPassword(payload: UpdateForgetPasswordPayload): Promise<ForgetPasswordApiResponse> {
     console.log(payload);
      const { data } = await axiosInstance.put('/user/forget-password/new-password', payload);
      return data as ForgetPasswordApiResponse;
}
export default updateForgetPassword;