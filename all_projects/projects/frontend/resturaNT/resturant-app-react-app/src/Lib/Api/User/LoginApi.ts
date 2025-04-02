import axiosInstance from '../Axios/axios';
import { LoginSubmitForm } from '../../Interface/User/UserSubmitInterface';
import { LoginInterface } from '../../Interface/User/UserInterface';

const LoginApi = async (data: LoginSubmitForm) => {
  const response = await axiosInstance.post('/user/login', data);
    return response.data as LoginInterface;
};

export default LoginApi;
