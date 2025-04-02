import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { serviceEC2 } from './service-ec2';
import { cloudWatchLogGroups } from './cloudwatch-loggroup';
import { frontendS3 } from './frontend-s3';
import { schedulerLambda } from './scheduler-lambda';
import { ec2User } from './ec2-user';
import { createVpc } from './create-vpc';
import { elasticsearchEC2 } from './elasticsearch-ec2';
import { deploymentUser } from './deployment-user';

interface LeadHawkStackProps extends cdk.StackProps {
  ec2InstanceConnectIPs: string[];
}

export class CdkLeadhawkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: LeadHawkStackProps) {
    super(scope, id, props);

    if (!process.env.KEYPAIR_NAME) {
      console.error('Keypair for instance not provided. Please set `KEYPAIR_NAME` in the env');
      process.exit(1);
    }
    const keypair = ec2.KeyPair.fromKeyPairName(
      this,
      'keypair-for-ec2',
      process.env.KEYPAIR_NAME
    );
    const vpc = createVpc(this);
    const user = ec2User(this);
    const {
      serviceInstance,
      serviceInstanceSecurityGroupId
    } = serviceEC2(this, user, vpc, keypair, {
      region: props?.env?.region,
      ec2InstanceConnectIPs: props?.ec2InstanceConnectIPs,
    });
    cloudWatchLogGroups(this);
    const bucket = frontendS3(this, {
      account: this.account,
    });
    const lambda = schedulerLambda(this, {
      region: this.region,
      account: this.account,
    });
    deploymentUser(this, bucket, lambda);
    elasticsearchEC2(this, vpc, serviceInstance, keypair, serviceInstanceSecurityGroupId, {
      ec2InstanceConnectIPs: props?.ec2InstanceConnectIPs,
    });
  }
}
