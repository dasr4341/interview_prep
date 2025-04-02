#!/bin/bash

if [ -z ${1+x} ]
then
exit 1
fi

# Login to ECR
aws ecr get-login-password --region $1 | docker login --username AWS --password-stdin 865960754874.dkr.ecr.$1.amazonaws.com

# Build container image for deployment
docker build -t pretaa-fitbit .

# Tag the container image
docker tag pretaa-fitbit:latest 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit:v10.7.1

# Upload
docker push 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit:v10.7.1

sleep 60 

if [ $2 == 1 ]
then
  # Get the latest container image
  images=$(aws ecr describe-images --region $1 --output json --repository-name pretaa-fitbit --filter tagStatus=TAGGED);
  sha=$(jq -r '.imageDetails[0].imageDigest' <<< "$images")

  aws lambda update-function-code --region $1 --function-name pretaa-health-weekly-report-function --image-uri 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit@$sha
  aws lambda update-function-code --region $1 --function-name pretaa-health-monthly-report-function --image-uri 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit@$sha
  if [ $1 == 'us-west-1' ]
    then
      aws lambda update-function-code --region $1 --function-name pretaa-health-function --image-uri 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit@$sha
    else
      aws lambda update-function-code --region $1 --function-name Pretaa-Fitbit --image-uri 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit@$sha
  fi

  # This is for the new reporting system. sqs -> py -> s3 -> (node) -> sqs
  # aws lambda update-function-code --region $1 --function-name pretaa-health-daily-report --image-uri 865960754874.dkr.ecr.$1.amazonaws.com/pretaa-fitbit@$sha
fi

# lambda update creates a blank file. removing that.
if test -f "0"; then
  rm 0
fi
