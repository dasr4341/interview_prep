import { UserData } from './data/UserData.js'; //data as we are not using db for now
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config.js';

// using the model 
const UserModel = mongoose.model('User');

const resolvers = {
    Query: {
        getAllUsers: () => UserData,
        userById: (_, { _id }) => UserData.find((element) => element._id === _id)
    },
    Mutation: {
        signUpUser: async (_, { signUpUserData }) => {
            // checking the email exist in DB 
            const user = await UserModel.findOne({ email: signUpUserData.email });
            if (user) {
                throw new Error("User exist with the same email !")
            }
            // hashing the password
            const hashedPassword = await bcrypt.hash(signUpUserData.password, 12);
            // creating the instance
            const newUser = new UserModel({
                ...signUpUserData,
                password: hashedPassword
            })
            // saving the data
            const createdUser = await newUser.save();
            return createdUser;
        },
        signInUser: async (_, { signInUserData }) => {
            // get the details corresponding to the email provided
            const user = await UserModel.findOne({ email: signInUserData.email });
            if (!user) {
                throw new Error("Invalid details !")
            }
            const doPasswordMatch = await bcrypt.compare(signInUserData.password, user.password);
            if (!doPasswordMatch) {
                throw new Error("Invalid details ... !")
            }
            // signing ...
            const token = jwt.sign({
                user: {
                    id: user._id,
                    email: user.email
                }
            }, config.JWT_SECRET_KEY, { expiresIn: '1d' })
            return { token };
        }
    }
}
export default resolvers;