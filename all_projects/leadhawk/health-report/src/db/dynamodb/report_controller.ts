import {
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { config } from '../../config/config.js';
import { DynamoDB_User } from '../../interface/dynamodb_interface.js';
import { notify } from '../../utils/upload_util.js';
import { dynamodb_client } from './dynamodb.js';

export class ReportController {
  async create(user_id: string) {
    try {
      const input: PutItemCommandInput = {
        TableName: config.aws.dynamodb.report_table,
        Item: marshall({
          user_id: user_id,
        }),
      };

      const command = new PutItemCommand(input);
      await dynamodb_client.send(command);

      console.log(`ReportController: user_id - ${user_id} create success`);
    } catch (error) {
      console.log(`ReportController: user_id - ${user_id} create error`, error);
      await notify(`ReportController: user_id - ${user_id} create error`, error);
    }
  }

  async get(user_id: string) {
    try {
      const input: GetItemCommandInput = {
        TableName: config.aws.dynamodb.report_table,
        Key: marshall({
          user_id: user_id,
        }),
      };

      const command = new GetItemCommand(input);
      const response = await dynamodb_client.send(command);
      const { Item } = response;

      console.log(`ReportController: user_id - ${user_id} get success`);

      if (Item) {
        return unmarshall(Item) as DynamoDB_User;
      }

      return null;
    } catch (error) {
      console.log(`ReportController: user_id - ${user_id} get error`, error);
      await notify(`ReportController: user_id - ${user_id} get error`, error);
    }
  }

  async update(user_id: string, data: DynamoDB_User) {
    try {
      const _k = 'user_id';

      const UpdateExpression = `SET ${Object.keys(data)
        .filter((e) => e !== _k)
        .map((e) => `${e} = :${e}`)
        .join(', ')}`;

      const ExpressionAttributeValues = Object.keys(data)
        .filter((e) => e !== _k)
        .reduce(
          (acc, curr) => ({
            ...acc,
            [`:${curr}`]: data[curr as keyof DynamoDB_User],
          }),
          {}
        );

      const input: UpdateItemCommandInput = {
        TableName: config.aws.dynamodb.report_table,
        Key: marshall({
          user_id: user_id,
        }),
        ExpressionAttributeValues: marshall(ExpressionAttributeValues),
        UpdateExpression: UpdateExpression,
      };

      const command = new UpdateItemCommand(input);
      await dynamodb_client.send(command);

      console.log(`ReportController: user_id - ${user_id} update success`);
    } catch (error) {
      console.log(`ReportController: user_id - ${user_id} update error`, error);
      await notify(`ReportController: user_id - ${user_id} update error`, error);
    }
  }
}
