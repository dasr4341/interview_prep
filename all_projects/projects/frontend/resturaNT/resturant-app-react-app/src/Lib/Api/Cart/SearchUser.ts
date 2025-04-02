import axios from '../Axios/axios';

const searchUsers = async (data: number) => {
    const response = await axios.post('/user/search-user',
      {
        phone: data,
      }
    );
    return response.data;
};

export default searchUsers;
