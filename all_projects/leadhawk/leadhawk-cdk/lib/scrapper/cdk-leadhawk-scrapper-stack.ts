import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { createLambdaPolicy } from "./lambdapolicy";
import * as iam from "aws-cdk-lib/aws-iam";
import { createQueue } from "./create-queue";
import config from "../../config/config";
import { createLambda } from "./create-lambda";

export class CdkLeadhawkScrapperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!process.env.SCRAPPER_REPO_NAME) {
      console.error(
        "Scrapper Repo Name not provided. Please set `SCRAPPER_REPO_NAME` in the env"
      );
      process.exit(1);
    }

    const repo = ecr.Repository.fromRepositoryAttributes(
      this,
      "LeadHawkScrapperLambda",
      {
        repositoryName: process.env.SCRAPPER_REPO_NAME,
        repositoryArn: `arn:aws:ecr:${this.region}:${this.account}:repository/${process.env.SCRAPPER_REPO_NAME}`,
      }
    );

    const queues = createQueue(this);

    const { lambdaPolicy, lambdaRole } = createLambdaPolicy(this, repo);

    config.lambdaConfig.forEach((configurationData) => {
      const queueArn = [];

      // We are finding the queue details
      const triggerSqsQueue = configurationData.sqs.triggerLambdaSqsKey
        ? queues[configurationData.sqs.triggerLambdaSqsKey]
        : null;
      const triggerSqsUrl = triggerSqsQueue?.queueUrl || null;

      const addEventSourceSqs = configurationData.sqs.addEventSourceSqsKey
        ? queues[configurationData.sqs.addEventSourceSqsKey]
        : null;

      // we are creating the lambda
      const { logGroup } = createLambda(this, {
        lambdaRole,
        repo,
        triggerSqsUrl,
        addEventSourceSqs,
        queue: [queues.Google],
        configuration: configurationData,
      });

      // ----------------------------------------
      // adding the arn for send message cmd
      if (triggerSqsQueue) {
        queueArn.push(triggerSqsQueue.queueArn);
      }
      if (addEventSourceSqs) {
        queueArn.push(addEventSourceSqs.queueArn);
      }
      // ----------------------------------------

      lambdaPolicy.addStatements(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "sqs:SendMessage",
          ],
          resources: [logGroup.logGroupArn, ...queueArn],
        })
      );
    });
  }
}
