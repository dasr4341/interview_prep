// import { faker } from '@faker-js/faker';
// import _ from 'lodash';

// import { CurrentUserResponse, User, ResetPasswordPayLoad, ResetPasswordApiResponse } from '../../../Interface/User/UserInterface';
// import http from '../../../Axios/axios';

// const options = {
//   headers: {
//     Authorization:
//       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJlbWFpbCI6InNhbmp1a3RAaXRvYnV6LmNvbSJ9LCJpYXQiOjE2NjExNzE4ODl9.CETBSdCT3IfeuAE1QTW2fCcDk8s90rMIxsnohdvSCzU',
//   },
// };
export const userApi = {
  // getCurrentUser: (): Promise<CurrentUserResponse> => {
  //   return new Promise((resolve) => {
  //     _.delay(() => {
  //       const user: User = {
  //         id: faker.datatype.uuid(),
  //         firstName: faker.name.firstName(),
  //         lastName:  faker.name.lastName(),
  //         phoneNo: faker.phone.phoneNumber(),
  //         token: faker.datatype.uuid(),
  //         image: faker.image.avatar()
  //       };
  //       resolve({ user });
  //     }, 3000);
  //   });
  // },

  // forgetPassword: (): Promise<{ token: string }> => {
  //   return new Promise((resolve) => {
  //     _.delay(() => {
  //       resolve({ token: faker.datatype.uuid() });
  //     }, 3000);
  //   });
  // }
};

export default userApi;
