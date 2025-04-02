import { Duration } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import config from "../../config/config";

export function createQueue(scope: Construct): { [key: string]: Queue } {
  return config.queueList.reduce((agg, queueName) => {
    const q = new Queue(scope, `LeadHawkLambda${queueName}ScrapperQueue`, {
      queueName: `LeadHawkLambda${queueName}`,
      retentionPeriod: Duration.minutes(5),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      visibilityTimeout: Duration.seconds(900),
    });
    return { ...agg, [queueName]: q };
  }, {});
}
