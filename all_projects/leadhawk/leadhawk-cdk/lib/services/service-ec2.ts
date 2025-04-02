import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';

export function serviceEC2(scope: Construct, {
  AccessKeyId,
  SecretAccessKeyId,
}: {
  AccessKeyId: string;
  SecretAccessKeyId: string;
}, vpc: ec2.Vpc, keyPair: ec2.IKeyPair, {
  region,
  ec2InstanceConnectIPs = [],
}: {
  region?: string;
  ec2InstanceConnectIPs?: string[];
}) {
  const userData = ec2.UserData.forLinux()
  userData.addCommands(
    `#!/bin/bash`,
    'set -x',
    `apt-get update -y`,
    `apt-get install -y git ec2-instance-connect unzip`,

    'apt-get install ca-certificates curl',
    'install -m 0755 -d /etc/apt/keyrings',
    'curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc',
    'sudo chmod a+r /etc/apt/keyrings/docker.asc',

    'echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
    'apt-get update -y',

    'apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin',

    'until git clone https://github.com/aws-quickstart/quickstart-linux-utilities.git; do echo "Retrying"; done',
    'cd /quickstart-linux-utilities',
    'source quickstart-cfn-tools.source',
    'qs_update-os || qs_err',
    'qs_bootstrap_pip || qs_err',
    'qs_aws-cfn-bootstrap || qs_err',
    'mkdir -p /opt/aws/bin',
    'ln -s /usr/local/bin/cfn-* /opt/aws/bin/',

    'apt update',
    'apt install apache2 -y',
    'a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests',

    `export AccessKeyId=${AccessKeyId}`,
    `export SecretAccessKeyId=${SecretAccessKeyId}`,
    `export ECR_URL=${process.env.ECR_URL}`,
    `export Region=${region}`,
    `export ADMINSERVICE=${process.env.ADMINSERVICE}`,
    `export DATASERVICE=${process.env.DATASERVICE}`,
    `export FILTERSERVICE=${process.env.FILTERSERVICE}`,
    `export USERSERVICE=${process.env.USERSERVICE}`,
    `export ADMINDOMAIN=${process.env.ADMINDOMAIN}`,
    `export DATADOMAIN=${process.env.DATADOMAIN}`,
    `export FILTERDOMAIN=${process.env.FILTERDOMAIN}`,
    `export USERDOMAIN=${process.env.USERDOMAIN}`,
  );

  const securityGroup = new ec2.SecurityGroup(scope, 'LeadHawkServicesEC2SecurityGroup', {
    securityGroupName: 'LeadHawkServicesEC2SecurityGroup',
    vpc,
  });
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP);
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTPS);

  const staticIPs = process.env.YOUR_STATIC_IP_FOR_SSH;
  const SSHAccess: {
    ipCidr: string;
    description: string;
  }[] = staticIPs ? JSON.parse(staticIPs) : [];

  SSHAccess.forEach(ips => {
    securityGroup.addIngressRule(ec2.Peer.ipv4(ips.ipCidr), ec2.Port.SSH, ips.description || 'PERSONAL IP');
  });
  ec2InstanceConnectIPs.forEach(ips => {
    securityGroup.addIngressRule(ec2.Peer.ipv4(ips), ec2.Port.SSH, 'EC2 Instance Connect');
  });

  // EC2 Instance with Elastic IP
  const instance = new ec2.Instance(scope, 'LeadHawkServicesEC2', {
    instanceName: 'LeadHawkServicesEC2',
    vpc,
    securityGroup,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
    machineImage: ec2.MachineImage.fromSsmParameter(
      '/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id', {
      "os": ec2.OperatingSystemType.LINUX,
      userData
    }),
    blockDevices: [
      {
        deviceName: '/dev/sda1',
        volume: ec2.BlockDeviceVolume.ebs(50),
      },
    ],
    init: ec2.CloudFormationInit.fromElements(
      ec2.InitFile.fromFileInline('/home/ubuntu/ec2-init.sh', 'lib/services/ec2-init.sh', {
        mode: '000755',
        group: 'root',
        owner: 'root',
      }),
      ec2.InitCommand.shellCommand('sh /home/ubuntu/ec2-init.sh')
    ),
    initOptions: {
      configSets: ['default'],
      timeout: cdk.Duration.minutes(60)
    },
    keyPair,
  });

  const elasticIp = new ec2.CfnEIP(scope, 'LeadHawkElasticIP', {
    instanceId: instance.instanceId,
  });

  new cdk.CfnOutput(scope, 'Elastic IP', {
    value: elasticIp.attrPublicIp
  });
  new cdk.CfnOutput(scope, 'Service Instance Private IP', {
    value: instance.instancePrivateIp
  });

  return {
    serviceInstanceSecurityGroupId: securityGroup.securityGroupId,
    serviceInstance: instance
  };
}
