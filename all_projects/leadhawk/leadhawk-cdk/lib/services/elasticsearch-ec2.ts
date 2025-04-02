import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';

export function elasticsearchEC2(
  scope: Construct,
  vpc: ec2.IVpc,
  serviceInstance: ec2.Instance,
  keyPair: ec2.IKeyPair,
  serviceInstanceSecurityGroupId: string,
  {ec2InstanceConnectIPs = []}: {ec2InstanceConnectIPs?: string[];}
) {
  if (process.env.NUMBER_OF_INSTANCES && +process.env.NUMBER_OF_INSTANCES <= 0) {
    return;
  }

  // Don't change the indentation. ElasticSearch config crashes if not properly indented
  const getUserDataCommands = (nodename: string) => {
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      `#!/bin/bash`,
      'set -x',
      `apt-get update -y`,
      `apt-get install -y git ec2-instance-connect`,
    
      'until git clone https://github.com/aws-quickstart/quickstart-linux-utilities.git; do echo "Retrying"; done',
      'cd /quickstart-linux-utilities',
      'source quickstart-cfn-tools.source',
      'qs_update-os || qs_err',
      'qs_bootstrap_pip || qs_err',
      'qs_aws-cfn-bootstrap || qs_err',
      'mkdir -p /opt/aws/bin',
      'ln -s /usr/local/bin/cfn-* /opt/aws/bin/',
    
      'curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elastic.gpg',
      'echo "deb [signed-by=/usr/share/keyrings/elastic.gpg] https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list',
      'sudo apt update',
      'sudo apt install elasticsearch',
      `sudo sh -c "echo '
cluster.name: leadHawk
node.name: ${nodename}
network.host: _site_
node.master: true' >> /etc/elasticsearch/elasticsearch.yml"`,
      'sudo systemctl start elasticsearch',
      'sudo systemctl enable elasticsearch',
      'echo "y" | sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install repository-s3',
      'sudo systemctl restart elasticsearch'
    );

    return userData;
  }

  const securityGroup = new ec2.SecurityGroup(scope, 'LeadHawkElasticSearchEC2SecurityGroup', {
    securityGroupName: 'LeadHawkElasticSearchEC2SecurityGroup',
    vpc,
  });

  if (process.env.ENABLE_SSH) {
    const staticIPs = process.env.YOUR_STATIC_IP_FOR_SSH;
    const SSHAccess: {
      ipCidr: string;
      description: string;
    }[] = staticIPs ? JSON.parse(staticIPs) : [];

    SSHAccess.forEach(ips => {
      securityGroup.addIngressRule(ec2.Peer.ipv4(ips.ipCidr), ec2.Port.SSH, ips.description || 'PERSONAL IP');
    });
  }

  securityGroup.addIngressRule(ec2.Peer.ipv4(`10.0.0.0/16`), ec2.Port.tcpRange(9200, 9300), `Elastic Services Instances Mapping`);
  securityGroup.addIngressRule(ec2.Peer.securityGroupId(serviceInstanceSecurityGroupId), ec2.Port.tcpRange(9200, 9300), `Private IP - ${serviceInstance.instanceId}`);

  ec2InstanceConnectIPs.forEach(ips => {
    securityGroup.addIngressRule(ec2.Peer.ipv4(ips), ec2.Port.SSH, 'EC2 Instance Connect');
  });

  const n = process.env.NUMBER_OF_INSTANCES ? +process.env.NUMBER_OF_INSTANCES : 1;

  const instances = []
  for (let index = 0; index < n; index++) {
    instances.push(
      new ec2.Instance(scope, `LeadHawkElasticCacheEC2-${index + 1}`, {
        instanceName: `LeadHawkElasticCacheEC2 - ${index + 1}`,
        vpc,
        securityGroup,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        machineImage: ec2.MachineImage.fromSsmParameter(
          '/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id', {
          "os": ec2.OperatingSystemType.LINUX,
          userData: getUserDataCommands(`node-${index + 1}`)
        }),
        blockDevices: [
          {
            deviceName: '/dev/sda1',
            volume: ec2.BlockDeviceVolume.ebs(50),
          },
        ],
        keyPair: (process.env.ENABLE_SSH || false) ? keyPair : undefined,
      })
    );
  }

  const ips = instances.map(instance => instance.instancePrivateIp);
  new cdk.CfnOutput(scope, 'Elastic Search Instance Private IP', {
    value: ips.toString(),
    description: 'Add this to filter service elastic search nodes'
  });
}
