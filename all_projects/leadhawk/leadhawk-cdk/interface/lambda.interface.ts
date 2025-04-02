import { Duration, Size } from "aws-cdk-lib";

export interface ILambdaConfiguration {
  sqs: {
    triggerLambdaSqsKey: string | null;
    addEventSourceSqsKey: string | null;
  };
  lambdaName: string;
  handlerName: string;
  ephemeralStorageSize: Size;
  memorySize: number;
  retryAttempts: number;
  timeout: Duration;
  cornJob: {
    ruleName: string | null;
    cron:
      | {
          minute: string;
          hour: string;
          month: string;
          weekDay: string;
          year: string;
        }
      | {};
  };
  env: {
    envData: string;
    sqsKey: string | null;
  };
  lambdaTriggerConfig:
    | {
        batchSize: number;
        maxBatchingWindow: Duration;
        maxConcurrency: number;
        reportBatchItemFailures: boolean;
      }
    | {};
}
