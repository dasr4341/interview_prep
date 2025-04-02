import axiosInstance from '../Axios/axios';
import { RegisterSubmitForm, UserSubmitForm } from '../../Interface/User/UserSubmitInterface';
import { RegisterInterface } from '../../Interface/User/UserInterface';

const RegisterApi = async (data: RegisterSubmitForm) => {
  const response = await axiosInstance.post('/user/signup', data);
    return response.data as RegisterInterface;
};
export const RegisterUserApi = async (data: UserSubmitForm) => {
    const response = await axiosInstance.post('/user/signup-user', data);
    return response.data;
};

export default RegisterApi;

