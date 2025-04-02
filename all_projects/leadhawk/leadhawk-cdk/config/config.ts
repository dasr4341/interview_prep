import { Duration, Size } from "aws-cdk-lib";

const queueList = ["Google", "LinkedIn", "SaveData"];

const lambdaConfig = [
  {
    sqs: {
      triggerLambdaSqsKey: queueList[0],
      addEventSourceSqsKey: null,
    },
    lambdaName: "FormDSScrapper",
    handlerName: "dist/formDsHandler.handler",
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 1024,
    retryAttempts: 0,
    timeout: Duration.minutes(15),
    cornJob: {
      ruleName: "rule-formDs",
      cron: {
        minute: `*/${process.env.SCRAPPER_FORMDS_FREQUENCY}`,
        hour: `*`,
        month: "*",
        weekDay: "*",
        year: "*",
      },
    },
    env: {
      envData: process.env.FORMDS_ENV || "{}",
      sqsKey: "AWS_SQS_URL_GOOGLE_SEARCH",
    },
    lambdaTriggerConfig: {},
  },
  {
    sqs: {
      triggerLambdaSqsKey: queueList[1],
      addEventSourceSqsKey: queueList[0],
    },
    lambdaName: "GoogleScrapper",
    handlerName: "dist/googleHandler.handler",
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 1024,
    retryAttempts: 0,
    timeout: Duration.minutes(15),
    cornJob: {
      ruleName: null,
      cron: {},
    },
    env: {
      envData: process.env.GOOGLE_ENV || "{}",
      sqsKey: "AWS_SQS_URL_LINKEDIN",
    },
    lambdaTriggerConfig: {
      batchSize: 10,
      maxBatchingWindow: Duration.seconds(5),
      maxConcurrency: 10,
    },
  },
  {
    sqs: {
      triggerLambdaSqsKey: queueList[2],
      addEventSourceSqsKey: queueList[1],
    },
    lambdaName: "LinkedIn",
    handlerName: "dist/linkedInHandler.handler",
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 1024,
    retryAttempts: 0,
    timeout: Duration.minutes(15),
    cornJob: {
      ruleName: null,
      cron: {},
    },
    env: {
      envData: process.env.LINKED_ENV || "{}",
      sqsKey: "AWS_SQS_URL_SAVE_DATA",
    },
    lambdaTriggerConfig: {
      batchSize: 10,
      maxBatchingWindow: Duration.seconds(5),
      maxConcurrency: 10,
    },
  },
  {
    sqs: {
      triggerLambdaSqsKey: null,
      addEventSourceSqsKey: queueList[2],
    },
    lambdaName: "SaveScrapData",
    handlerName: "dist/saveDataHandler.handler",
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 128,
    retryAttempts: 0,
    timeout: Duration.minutes(15),
    cornJob: {
      ruleName: null,
      cron: {},
    },
    env: {
      envData: process.env.SAVE_DATA_ENV || "{}",
      sqsKey: null,
    },
    lambdaTriggerConfig: {
      batchSize: 50,
      maxBatchingWindow: Duration.seconds(300),
      maxConcurrency: 10,
      reportBatchItemFailures: false,
    },
  },
  {
    sqs: {
      triggerLambdaSqsKey: queueList[0],
      addEventSourceSqsKey: null,
    },
    lambdaName: "IndeedScrapper",
    handlerName: "dist/indeedHandler.handler",
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 1024,
    retryAttempts: 0,
    timeout: Duration.minutes(15),
    cornJob: {
      ruleName: "rule-indeed",
      cron: {
        minute: `0`,
        hour: `*`,
        month: "*", // Every month
        weekDay: "*",
        year: "*",
      },
    },
    env: {
      envData: process.env.INDEED_ENV || "{}",
      sqsKey: "AWS_SQS_URL_GOOGLE_SEARCH",
    },
    lambdaTriggerConfig: {},
  },
];

export default {
  lambdaConfig,
  queueList,
};
