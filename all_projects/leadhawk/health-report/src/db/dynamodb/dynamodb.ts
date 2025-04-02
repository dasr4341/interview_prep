import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { config } from '../../config/config.js';

export const dynamodb_client = new DynamoDBClient({ region: config.aws.default_region });
