import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';  // Used for specifying CloudFront origins
import * as acm from 'aws-cdk-lib/aws-certificatemanager'; 

// INPUT
// certificateARN
// domainName

export function frontendS3(scope: Construct, {
  account
}: {
  account: string;
}) {
  if (!process.env.DOMAIN_URL) {
    console.error('Domain URL not provided. Please set `DOMAIN_URL` in the env');
    process.exit(1);
  }
  if (!process.env.CERTIFICATE_ID) {
    console.error('Provide certificate id for cloud distirbution. Please set `CERTIFICATE_ID` in the env');
    process.exit(1);
  }
  // S3 Deployment (Upload website content to S3)
  const s3Bucket = new s3.Bucket(scope, process.env.DOMAIN_URL, {
    bucketName: process.env.DOMAIN_URL,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    blockPublicAccess: new s3.BlockPublicAccess({
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    })
  });

  const certificateArn = `arn:aws:acm:us-east-1:${account}:certificate/${process.env.CERTIFICATE_ID}`; // Change to your certificate ARN
  const certificate = acm.Certificate.fromCertificateArn(scope, 'SiteCertificate', certificateArn);

  console.log(certificate.certificateArn)

  // Create a CloudFront distribution for the S3 bucket
  const distribution = new cloudfront.Distribution(scope, 'SiteDistribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(s3Bucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    domainNames: [process.env.DOMAIN_URL],
    httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    certificate,
    errorResponses: [
      {
        "httpStatus": 404,
        "responseHttpStatus": 200,
        "responsePagePath": "/index.html"
      }
    ]
  });

  // Output the distribution domain name
  new cdk.CfnOutput(scope, 'DistributionDomainName', {
    value: distribution.distributionDomainName,
  });

  new cdk.CfnOutput(scope, 'BucketURL', {
    value: s3Bucket.bucketWebsiteUrl,
  });
  new cdk.CfnOutput(scope, 'S3 Frontend Distribution ID', {
    value: distribution.distributionId
  });
  new cdk.CfnOutput(scope, 'S3BucketName', {
    value: s3Bucket.bucketName
  });

  return s3Bucket;
}
