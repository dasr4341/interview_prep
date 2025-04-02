import { PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { config } from '../../config/config.js';
import { notify } from '../../utils/upload_util.js';
import { dynamodb_client } from './dynamodb.js';

export class ModelController {
  async create(user_id: string, model_data: any, model_date: string) {
    try {
      const input: PutItemCommandInput = {
        TableName: config.aws.dynamodb.model_table,
        Item: marshall({
          user_id: user_id,
          model_data: model_data,
          model_date: model_date,
        }),
      };

      const command = new PutItemCommand(input);
      await dynamodb_client.send(command);

      console.log(`ModelController: user_id - ${user_id} create success`);
    } catch (error) {
      console.log(`ModelController: user_id - ${user_id} create error`, error);
      await notify(`ModelController: user_id - ${user_id} create error`, error);
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
        TableName: config.aws.dynamodb.model_table,
        Limit: limit ?? undefined,
        ScanIndexForward: sort === 'asc',
        KeyConditionExpression: 'user_id = :x AND model_date BETWEEN :y AND :z ',
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
        return Items.map((e) => unmarshall(e));
      }

      console.log(`ModelController: user_id - ${user_id} get_data_by_date_range success`);

      return null;
    } catch (error) {
      console.log(`ModelController: user_id - ${user_id} get_data_by_date_range error`, error);
      await notify(`ModelController: user_id - ${user_id} get_data_by_date_range error`, error);
    }
  }
}
