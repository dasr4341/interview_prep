import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as cdk from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import * as eventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { ILambdaConfiguration } from "../../interface/lambda.interface";

export function createLambda(
  scope: Construct,
  {
    repo,
    lambdaRole,
    triggerSqsUrl,
    addEventSourceSqs,
    queue,
    configuration,
  }: {
    repo: ecr.IRepository;
    lambdaRole: iam.Role;
    triggerSqsUrl: string | null;
    addEventSourceSqs: Queue | null;
    queue: Queue[];
    configuration: ILambdaConfiguration;
  }
) {
  const {
    lambdaName,
    handlerName,
    ephemeralStorageSize,
    memorySize,
    retryAttempts,
    timeout,
    cornJob,
    env,
    lambdaTriggerConfig,
  } = configuration;

  const envSqsToBeTriggeredConfig = env.sqsKey
    ? { [env.sqsKey]: triggerSqsUrl }
    : {};

  // AWS Lambda Function
  const lambdaFn = new lambda.Function(
    scope,
    `LeadHawkLambda${lambdaName}Function`,
    {
      functionName: `LeadHawkLambda${lambdaName}Function`,
      runtime: lambda.Runtime.FROM_IMAGE,
      handler: lambda.Handler.FROM_IMAGE,
      code: lambda.Code.fromEcrImage(repo, {
        cmd: [handlerName],
        tagOrDigest: "latest",
      }),
      environment: {
        ...JSON.parse(env.envData),
        ...envSqsToBeTriggeredConfig,
      },
      role: lambdaRole,
      timeout,
      ephemeralStorageSize,
      memorySize,
      retryAttempts,
    }
  );

  const logGroup = new logs.LogGroup(
    scope,
    `LeadHawkLambda${lambdaName}FunctionLogGroup`,
    {
      logGroupName: `/aws/lambda/${lambdaFn.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK, // Set log retention policy
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove log group when the stack is deleted
    }
  );

  queue.forEach((e) => {
    e.grantConsumeMessages(lambdaFn);
  });

  // Scheduled Event Rule to trigger Lambda
  if (cornJob?.ruleName) {
    new events.Rule(scope, `LeadHawkLambda${lambdaName}Rule`, {
      ruleName: cornJob.ruleName,
      enabled: true,
      schedule: events.Schedule.cron(cornJob.cron),
      targets: [new targets.LambdaFunction(lambdaFn)],
    });
  } else if (addEventSourceSqs) {
    lambdaFn.addEventSource(
      new eventSources.SqsEventSource(addEventSourceSqs, lambdaTriggerConfig)
    );
  }

  return { lambdaFn, logGroup };
}
