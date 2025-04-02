import { UserSchemaInterface } from "../db/interface/user.interface.js";
import { UserModel } from "../db/model/user.js";

// services
export const userServices = {
  createUser: (values: UserSchemaInterface) =>
    new UserModel(values)
      .save()
      .then((user) => user.toObject())
      .catch((e) => {
        console.error("Found err - while creating user", e);
        return e;
      }),
  getAllUsers: () => UserModel.find(),
  getUserById: (id: string) => UserModel.findById(id),
  getUserByEmail : (email: string) => UserModel.findOne({ email }),
  getUserBySessionToken: (sessionToken: string) =>
    UserModel.findOne({ "authentication.sessionToken": sessionToken }),
  deleteUsersById: (id: string) => UserModel.findOneAndDelete({ _id: id }),
  updateUserById: (id: string, values: UserSchemaInterface) =>
    UserModel.findByIdAndUpdate(id, values),
};
