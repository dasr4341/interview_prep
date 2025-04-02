import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

// INPUTS
// service ecr repo
export function ec2User(scope: Construct) {
  const logStreamUser = new iam.User(scope, 'LeadHawkEC2User', {
    userName: process.env.EC2_USER || 'LeadHawkEC2User'
  });

  const logStreamPolicy = new iam.Policy(scope, 'LeadHawkEC2UserPolicy', {
    policyName: process.env.EC2_USER ? `${process.env.EC2_USER}Policy` : 'LeadHawkDeploymentUserPolicy',
    users: [logStreamUser],
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogStream',
          'logs:CreateLogGroup',
          'logs:PutLogEvents'
        ],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'ecr:DescribeImages',
          'ecr:ListImages'
        ],
        resources: ['*'],
      }),
    ]
  });

  const accessKey = new iam.CfnAccessKey(scope, 'ApiUserAccessKey', {
    userName: logStreamUser.userName
  });

  new cdk.CfnOutput(scope, 'User Name', { value: logStreamUser.userName, });
  new cdk.CfnOutput(scope, 'AccessKeyId', { value: accessKey.ref, });

  logStreamUser.attachInlinePolicy(logStreamPolicy);

  return {
    AccessKeyId: accessKey.ref,
    SecretAccessKeyId: accessKey.attrSecretAccessKey
  }
}
