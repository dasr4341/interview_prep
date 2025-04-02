# Welcome to your Leadhawk CDK project
----------------------------------------
This project is to setup AWS services for leadhawk project.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Resources created
----------------------------------------
* IAM User - This will be used in the EC2 for various permissions
* EC2 Instance w/ EIP - This will host all the different services
* S3 - This will host the frontend for leadhawk app
* Cloudfront Distribution - This is for routing traffic from S3 bucket to DNS
* Lambda - This will have the scheduler service
* Scheduler - This will be run the scheduler service based on cron
* EC2 Instance - This will have Elastic cache installed and would connect to the services EC2 via Private IP

## Prerequisites
----------------------------------------
* [AWS CLI](https://aws.amazon.com/cli/) must be installed and configured
* [Keypair](https://ap-south-1.console.aws.amazon.com/ec2/home?region=ap-south-1#CreateKeyPair:) - This should be created beforehand and added to .env file with key: `KEYPAIR_NAME`
* [ECR Containers for all the backend services](https://ap-south-1.console.aws.amazon.com/ecr/home?region=ap-south-1#)
* [Cloudfront Distribution Certificate](https://us-east-1.console.aws.amazon.com/acm/home)
> Note: Generate in us-east-1, irrespective of the deployment region. Key algortihm should be RSA 2048


## Getting Started

1. Create a keypair in the intended region and add the keypair name to .env file

1. Run the CDK
```
npx cdk deploy
```

If you've multiple profiles setup, and you dont want to use the default profile, you can run
```
npx cdk deploy --profile profilename
```

3. To destroy the cdk
```
npx cdk destroy
```
If you'd used non-default profile, be sure to pass the same
```
npx cdk destroy --profile profilename
```

----------------------------------------
## Post CDK deployment
1. ssh into the services EC2 and run the following command:
```
sh run-services.sh
```
This will start all the services in the ec2 container.

> Note: The required run script and compose file is generated during instance creation and can be modified in the `ec2-init.sh` file.

Services Port Mapping
| Port | LeadHawk Service   |
|------|--------------------|
| 6001 | leadhawk_user      |
| 6003 | leadhawk_dataentry |
| 6004 | leadhawk_filter    |
| 6005 | leadhawk_admin     |

2. Use EC2 Instance Connect, to ssh into Elastic Service Instance.
> Note: ssh is not added in this instance, because of security reasons. In most cases, you'd only want to connect to this once. 

> You can override this behaviour by setting `ENABLE_SSH` to `1` in your .env file.

Collect the Private IPs of the number of instances, you've created for ElasticSearch.

_Check cloudformation outputs. `CdkLeadhawkStack.ElasticSearchInstancePrivateIP` will have the IPs._

Add the following two lines in '/etc/elasticsearch/elasticsearch.yml'
```
discovery.seed_hosts: ["10.xyz.xyz.xyz"]
cluster.initial_master_nodes: ["10.xyz.xyz.xyz"]
```

Steps:
   1. sudo nano /etc/elasticsearch/elasticsearch.yml
   2. add the above lines
   3. sudo systemctl restart elasticsearch


3. In filter service, application.properties change the value of keys, to the elastic search ip.
```
ec2.hostname.first=10.xyz.xyz.xyz
ec2.hostname.second=10.xyz.xyz.xyz
```

----------------------------------------
## Helpful Debugging Commands
* `less +F /var/log/cloud-init-output.log` - To check EC2 initialization logs
*  `curl http://ELASTICSEARCH_EC2_IP:9200/` - To check if Elastic search is up and running. You should get an output like this:
```
{
  "name" : "node-1",
  "cluster_name" : "leadHawk",
  "cluster_uuid" : "mH9_GC2FTdSjrwxcNitRuw",
  "version" : {
    "number" : "7.17.21",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "d38e4b028f4a9784bb74de339ac1b877e2dbea6f",
    "build_date" : "2024-04-26T04:36:26.745220156Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.3",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```
