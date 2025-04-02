import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';

export function cloudWatchLogGroups(scope: Construct) {
  // CloudWatch Log Group
  ['leadhawk_dataentry', 'leadhawk_admin', 'leadhawk_user', 'leadhawk_filter'].forEach((logGroup) => {
    new logs.LogGroup(scope, logGroup, {
      logGroupName: logGroup,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY // Adjust retention period as needed
    });
  });
}
