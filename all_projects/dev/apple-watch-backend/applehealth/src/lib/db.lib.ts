import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { ExceptionType } from '../enums/exception.enum.js';
import { CollectionType } from '../enums/health-data.enum.js';
import { UserModel, userModelGenerator } from '../models/user-model/user.model.js';
import messagesData from './message.lib.js';
import Exception from './exception.lib.js';
import { LogType, log } from './log.lib.js';

export const dbLib = {
  createTimeseriesCollection: async (userId: string, type: CollectionType) => {
    try {
      await mongoose.connection.db.createCollection(`${userId}/${type}`, {
        timeseries: {
          timeField: 'time',
          metaField: 'value',
          granularity: 'minutes',
        },
      });
    } catch (error) {
      log(LogType.warning, 'mongodb', `${userId}/${type} collection already exists, not creating new one`);
    }
  },

  createCollection: async (userId: string, type: CollectionType) => {
    try {
      await mongoose.connection.db.createCollection(`${userId}/${type}`);
    } catch (error) {
      log(LogType.warning, 'mongodb', `${userId}/${type} collection already exists, not creating new one`);
    }
  },

  listCollections: async () => {
    const list = await mongoose.connection.db.listCollections().toArray();
    return list;
  },

  checkIfCollectionExist: async (filter: object) => {
    const list = mongoose.connection.db.listCollections(filter);
    return list;
  },

  getUser: async (userId: string) => {
    const userModel = await userModelGenerator();
    const user = await userModel.findOne({ userId });

    if (!user) {
      throw new Exception('invalid user', StatusCodes.UNAUTHORIZED, '', ExceptionType.HTTP);
    }
    return user as UserModel;
  },

};
