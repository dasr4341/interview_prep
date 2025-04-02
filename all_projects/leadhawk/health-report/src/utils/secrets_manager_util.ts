import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

interface Lambda_Secrets {
  AWS_SQS_SET_URL: string;
  AWS_SQS_FETCH_URL_DAILY_REPORT: string;
  AWS_SQS_DEAD_LETTER_URL: string;
  AWS_S3_REPORT_BUCKET: string;
  AWS_S3_DATA_BUCKET: string;
  AWS_SNS_ARN: string;
  AWS_DYNAMODB_REPORT_TABLE: string;
  AWS_DYNAMODB_DATA_TABLE: string;
  AWS_DYNAMODB_MODEL_TABLE: string;
  FITBIT_BASE_URL: string;
  APPLEWATCH_BASE_URL: string;
  DATABASE_URL: string;
  SENTRY_ENV: string;
  SENTRY_DSN: string;
}

export async function get_secrets(lambda_secret_name: string, region: string): Promise<Lambda_Secrets | undefined> {
  try {
    const secret_manager_client = new SecretsManagerClient({ region: region });

    const command = new GetSecretValueCommand({
      SecretId: lambda_secret_name,
      VersionStage: 'AWSCURRENT',
    });

    const response = await secret_manager_client.send(command);

    const secret_string = response.SecretString;

    if (secret_string) {
      console.log('get_secrets: fetch success');
      return JSON.parse(secret_string) as Lambda_Secrets;
    }
  } catch (error) {
    console.log('get_secrets: error', error);
  }
}
