import { Pool } from 'pg';
import { EnvironmentList } from '../../config/config.enum';
import { config } from '../../config/config';
import { Exception } from '../../exception/Exception';
import { messageData } from '../../config/messageData';
import { StatusCodes } from 'http-status-codes';


export async function getRemoteData({ query, dbInstance }: {
  query: {
    text: string, 
    values: (string | undefined)[]
}, dbInstance: EnvironmentList }) {
  try {
    const poolConfig = config.poolConfig(dbInstance);
    
    if (!poolConfig) {
      throw new Exception(
        messageData.dbInstanceNotFound,
        { dbInstance },
        StatusCodes.BAD_REQUEST,
      );
    }

    const db = new Pool(poolConfig);
    const pool = await db.connect();

    console.log('db connected');
    const response = await db.query(query);
    pool.release();
    console.log('db disconnected');
    return response;
  } catch (e) {
    throw e;
  }
}

export default {
  getRemoteData,
};
