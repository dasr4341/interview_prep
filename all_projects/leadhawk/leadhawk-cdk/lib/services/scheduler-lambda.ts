import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration, Size } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';

// ENV
// SCHEDULER_REPO_NAME - Scheduler ECR Repo Name
// SCHEDULER_ENV - ENV variables for lambda in stringified JSON format
// SCHEDULER_FREQUENCY - number. in hours.

export function schedulerLambda(scope: Construct, {
  region,
  account
}: {
  region: string;
  account: string;
}) {
  if (!process.env.SCHEDULER_REPO_NAME) {
    console.error('Scheduler Repo Name not provided. Please set `SCHEDULER_REPO_NAME` in the env');
    process.exit(1);
  }

  const repo = ecr.Repository.fromRepositoryAttributes(
    scope,
    'LeadHawkSchedulerLambda',
    {
      repositoryName: process.env.SCHEDULER_REPO_NAME,
      repositoryArn: `arn:aws:ecr:${region}:${account}:repository/${process.env.SCHEDULER_REPO_NAME}`
    }
  );

  const lambdaRole = new iam.Role(scope, 'LeadhawkSchedulerLambdaExecutionRole', {
    roleName: 'LeadhawkSchedulerLambdaExecutionRole',
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  const lambdaPolicy = new iam.Policy(scope, 'LeadHawkSchedulerLambdaECRPolicy', {
    policyName: 'LeadHawkSchedulerLambdaECRPolicy',
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage'
        ],
        resources: [repo.repositoryArn],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecr:GetAuthorizationToken',
        ],
        resources: ['*'],
      }),
    ]
  });

  lambdaRole.attachInlinePolicy(lambdaPolicy);

  // AWS Lambda Function
  const lambdaFn = new lambda.Function(scope, 'LeadHawkLambdaSchedulerFunction', {
    functionName: 'LeadHawkLambdaSchedulerFunction',
    runtime: lambda.Runtime.FROM_IMAGE,
    handler: lambda.Handler.FROM_IMAGE,
    code: lambda.Code.fromEcrImage(repo, {
      cmd: ["dist/index.handler"],
      tagOrDigest: 'latest'
    }),
    environment: JSON.parse(process.env.SCHEDULER_ENV || '{}'),
    role: lambdaRole,
    timeout: Duration.minutes(15),
    ephemeralStorageSize: Size.mebibytes(512),
    memorySize: 128,
  });

  const logGroup = new logs.LogGroup(scope, 'LeadHawkLambdaSchedulerFunctionLogGroup', {
    logGroupName: `/aws/lambda/${lambdaFn.functionName}`,
    retention: logs.RetentionDays.ONE_WEEK, // Set log retention policy
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove log group when the stack is deleted
  });

  lambdaPolicy.addStatements(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents'
    ],
    resources: [
      logGroup.logGroupArn,
    ]
  }));

  // Scheduled Event Rule to trigger Lambda
  new events.Rule(scope, 'LeadHawkLambdaSchedulerScheduleRuleOneDayRemaining', {
    ruleName: 'rule-leadhawk-one-day-remain-trial',
    enabled: true,
    schedule: events.Schedule.cron({ // Use 'cron' instead of 'expression'
      minute: '0',
      hour: `*/${process.env.SCHEDULER_FREQUENCY}`,
      month: '*',    // Every month
      weekDay: '*'
    }),
    targets: [
      new targets.LambdaFunction(lambdaFn)
    ]
  });
  new events.Rule(scope, 'LeadHawkLambdaSchedulerScheduleRuleTrialExpired', {
    ruleName: 'rule-leadhawk-trial-expired',
    enabled: true,
    schedule: events.Schedule.cron({ // Use 'cron' instead of 'expression'
      minute: '15',
      hour: `*/${process.env.SCHEDULER_FREQUENCY}`,
      month: '*',    // Every month
      weekDay: '*'
    }),
    targets: [
      new targets.LambdaFunction(lambdaFn)
    ]
  });

  return lambdaFn;
}
