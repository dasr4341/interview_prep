import mongoose from 'mongoose';
import path from 'path';

import { config } from '../config/config.js';
import { LogType, log } from '../lib/log.lib.js';

export async function mongodb() {
  try {
    const uri = config.db.uri as string;
    await mongoose.connect(uri, { tlsCAFile: path.join(process.cwd(), 'global-bundle.pem') });

    log(LogType.success, 'mongodb', `database connection established: ${uri}`);
  } catch (error) {
    console.log(error);
    throw new Error('database connection error');
  }
}
