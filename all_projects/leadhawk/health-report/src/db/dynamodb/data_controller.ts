import { PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { config } from '../../config/config.js';
import { DynamoDB_Data_Range } from '../../interface/dynamodb_interface.js';
import { notify } from '../../utils/upload_util.js';
import { dynamodb_client } from './dynamodb.js';

export class DataController {
  async create(user_id: string, data_id: string, created_at: string) {
    try {
      const input: PutItemCommandInput = {
        TableName: config.aws.dynamodb.data_table,
        Item: marshall({
          user_id: user_id,
          data_id: data_id,
          created_at: created_at,
        }),
      };

      const command = new PutItemCommand(input);
      await dynamodb_client.send(command);

      console.log(`DataController: user_id - ${user_id} create success`);
    } catch (error) {
      console.log(`DataController: user_id - ${user_id} create error`, error);
      await notify(`DataController: user_id - ${user_id} create error`, error);
    }
  }

  async get_data_by_date_range(
    user_id: string,
    start_date_yyyyMMdd: string,
    end_date_yyyyMMdd: string,
    sort: 'asc' | 'desc',
    limit: number | null
  ) {
    try {
      const input: QueryCommandInput = {
        TableName: config.aws.dynamodb.data_table,
        Limit: limit ?? undefined,
        ScanIndexForward: sort === 'asc',
        KeyConditionExpression: 'user_id = :x AND created_at BETWEEN :y AND :z ',
        ExpressionAttributeValues: marshall({
          ':x': user_id,
          ':y': start_date_yyyyMMdd,
          ':z': end_date_yyyyMMdd,
        }),
      };

      const command = new QueryCommand(input);
      const response = await dynamodb_client.send(command);
      const { Items } = response;

      if (Items?.length) {
        return Items.map((e) => unmarshall(e)) as DynamoDB_Data_Range[];
      }

      console.log(`DataController: user_id - ${user_id} get_data_by_date_range success`);

      return null;
    } catch (error) {
      console.log(`DataController: user_id - ${user_id} get_data_by_date_range error`, error);
      await notify(`DataController: user_id - ${user_id} get_data_by_date_range error`, error);
    }
  }
}
