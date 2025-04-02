import axiosInstance from '../Axios/axios';
import { GetProfileInterface } from '../../Interface/User/UserInterface';

const GetProfileApi = async () => {
  const response = await axiosInstance.get('/user/profile');
  return response.data as GetProfileInterface;
};

export default GetProfileApi;
