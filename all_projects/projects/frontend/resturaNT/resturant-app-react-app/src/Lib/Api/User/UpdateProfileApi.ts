import axiosInstance from '../Axios/axios';
import { ProfileSubmitForm } from '../../Interface/User/UserSubmitInterface';
import { UpdateProfileInterface } from '../../Interface/User/UserInterface';

const UpdateProfileApi = async (data: ProfileSubmitForm) => {
  const response = await axiosInstance.put('/user/profile', data);
  return response.data as UpdateProfileInterface; 
};

export default UpdateProfileApi;
