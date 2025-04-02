import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';

// INPUTS
// service ecr repo
export function deploymentUser(scope: Construct, bucket: s3.Bucket, lambda: lambda.Function) {
  const logStreamUser = new iam.User(scope, 'LeadHawkDeploymentUser', {
    userName: process.env.DEPLOYMENT_USER || 'LeadHawkDeploymentUser'
  });

  const logStreamPolicy = new iam.Policy(scope, 'LeadHawkDeploymentUserPolicy', {
    policyName: process.env.DEPLOYMENT_USER ? `${process.env.DEPLOYMENT_USER}Policy` : 'LeadHawkDeploymentUserPolicy',
    users: [logStreamUser],
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:DeleteObject',
          's3:ListBucket'
        ],
        resources: [
          bucket.bucketArn,
          bucket.arnForObjects('*'),
        ],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudfront:CreateInvalidation',
        ],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "lambda:UpdateFunctionCode",
          "lambda:GetFunction"
        ],
        resources: [lambda.functionArn],
      }),
    ]
  });

  const accessKey = new iam.CfnAccessKey(scope, 'LeadHawkDeploymentUserAccessKey', {
    userName: logStreamUser.userName
  });

  new cdk.CfnOutput(scope, 'LeadHawkDeploymentUser AccessKeyId', {
    value: accessKey.ref,
    description: 'Access Key for deployment pipelines'
  });
  new cdk.CfnOutput(scope, 'LeadHawkDeploymentUser SecretKeyId', {
    value: accessKey.attrSecretAccessKey,
    description: 'Secret Key for deployment pipelines'
  });

  logStreamUser.attachInlinePolicy(logStreamPolicy);
}
