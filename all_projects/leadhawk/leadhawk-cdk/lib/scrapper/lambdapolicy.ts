import { aws_ecr } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export function createLambdaPolicy(
  scope: Construct,
  repo: aws_ecr.IRepository
) {
  const lambdaRole = new iam.Role(
    scope,
    "LeadhawkScrapperLambdaExecutionRole",
    {
      roleName: "LeadhawkScrapperLambdaExecutionRole",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    }
  );

  const lambdaPolicy = new iam.Policy(
    scope,
    "LeadHawkScrapperLambdaECRPolicy",
    {
      policyName: "LeadHawkScrapperLambdaECRPolicy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
          ],
          resources: [repo.repositoryArn],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["ecr:GetAuthorizationToken"],
          resources: ["*"],
        }),
      ],
    }
  );

  lambdaRole.attachInlinePolicy(lambdaPolicy);

  return {
    lambdaPolicy,
    lambdaRole,
  };
}
