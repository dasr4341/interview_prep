
import { ResetPasswordPayLoad } from '../../Interface/User/UserInterface';
import http from '../../Api/Axios/axios';

export interface ResetPasswordApiResponse {
  success: boolean;
  message: string;
  data: string;
}


async function resetpassword(payload: ResetPasswordPayLoad): Promise<ResetPasswordApiResponse> {
  const { reEnterPassword, ...apiPayload } = payload;
    const { data } = await http.put('/user/reset-password', apiPayload);
    return data as ResetPasswordApiResponse;

}




export default resetpassword;
