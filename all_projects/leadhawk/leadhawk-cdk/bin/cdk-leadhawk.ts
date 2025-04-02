#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkLeadhawkStack } from '../lib/services/cdk-leadhawk-stack';
import * as dotenv from 'dotenv';
import { CdkLeadhawkScrapperStack } from '../lib/scrapper/cdk-leadhawk-scrapper-stack';
dotenv.config();

async function main () {
  const app = new cdk.App();

  const ipranges$ =  await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
  const ipranges = await ipranges$.json() as {prefixes: Array<{
    ip_prefix: string;
    region: string;
    service: string;
    network_border_group: string;
  }>};

  const ec2InstanceConnectIPs = ipranges.prefixes
    .filter(range =>
      range.region === process.env.region &&
      range.service === 'EC2_INSTANCE_CONNECT'
    )
    .map(({ip_prefix}) => ip_prefix);

  new CdkLeadhawkStack(app, 'CdkLeadhawkStack', {
    env: { region: process.env.region },
    ec2InstanceConnectIPs,
  });

  new CdkLeadhawkScrapperStack(app, 'CdkLeadhawkScrapperStack', {
    env: { region: process.env.region }
  });
}

main();
