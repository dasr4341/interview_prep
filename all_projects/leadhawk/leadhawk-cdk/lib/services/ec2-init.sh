#!/bin/bash
set -x

usermod -a -G docker $(whoami)
systemctl enable docker
systemctl start docker
systemctl restart apache2
systemctl restart docker

echo "
<VirtualHost *:80>
    ServerName $ADMINDOMAIN
    ProxyPass / http://localhost:6005/
    ProxyPassReverse / http://localhost:6005/
</VirtualHost>

<VirtualHost *:80>
    ServerName $DATADOMAIN
    ProxyPass / http://localhost:6003/
    ProxyPassReverse / http://localhost:6003/
</VirtualHost>


<VirtualHost *:80>
    ServerName $USERDOMAIN
    ProxyPass / http://localhost:6001/
    ProxyPassReverse / http://localhost:6001/
</VirtualHost>

<VirtualHost *:80>
    ServerName $FILTERDOMAIN
    ProxyPass / http://localhost:6004/
    ProxyPassReverse / http://localhost:6004/
</VirtualHost>
" >> /etc/apache2/sites-available/000-default.conf

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm awscliv2.zip

sudo mkdir -p /home/ubuntu/.aws
sudo touch /home/ubuntu/.aws/credentials
sudo sh -c 'echo "[default]
aws_access_key_id = '$AccessKeyId'
aws_secret_access_key = '$SecretAccessKeyId'
" > /home/ubuntu/.aws/credentials'

sudo touch /home/ubuntu/.aws/config
sudo sh -c 'echo "[default]
region = us-east-1
output = json" > /home/ubuntu/.aws/config'

sudo mkdir -p /etc/systemd/system/docker.service.d/
sudo touch /etc/systemd/system/docker.service.d/aws-credentials.conf
sudo sh -c 'echo "
[Service]
  Environment="AWS_ACCESS_KEY_ID='$AccessKeyId'"
  Environment="AWS_SECRET_ACCESS_KEY='$SecretAccessKeyId'"
" > /etc/systemd/system/docker.service.d/aws-credentials.conf'

sudo systemctl daemon-reload
sudo systemctl restart docker
sudo systemctl restart apache2

sudo sh -c 'echo "
name: compose-leadhawk-ec2

services:
  admin-service:
    container_name: leadhawk_admin
    image: '$ECR_URL'/'$ADMINSERVICE':latest
    pull_policy: always
    restart: on-failure:3
    logging:
      driver: awslogs
      options:
        awslogs-group: leadhawk_admin
        awslogs-region: '$Region'
    ports:
      - 6005:6005

  dataentry-service:
    container_name: leadhawk_dataentry
    image: '$ECR_URL'/'$DATASERVICE':latest
    pull_policy: always
    restart: on-failure:3
    logging:
      driver: awslogs
      options:
        awslogs-group: leadhawk_dataentry
        awslogs-region: '$Region'
    ports:
      - 6003:6003

  filter-service:
    container_name: leadhawk_filter
    image: '$ECR_URL'/'$FILTERSERVICE':latest
    pull_policy: always
    restart: on-failure:3
    logging:
      driver: awslogs
      options:
        awslogs-group: leadhawk_filter
        awslogs-region: '$Region'
    ports:
      - 6004:6004

  user-service:
    container_name: leadhawk_user
    image: '$ECR_URL'/'$USERSERVICE':latest
    pull_policy: always
    restart: on-failure:3
    logging:
      driver: awslogs
      options:
        awslogs-group: leadhawk_user
        awslogs-region: '$Region'
    ports:
      - 6001:6001
" > /home/ubuntu/compose.yml'

ECR_REGION=$(echo $ECR_URL | awk -F '.' '{print $4}')
echo $ECR_REGION

sudo sh -c 'echo "
aws ecr get-login-password --region '$ECR_REGION' | sudo docker login --username AWS --password-stdin '$ECR_URL'
sudo docker compose up --build -d
" > /home/ubuntu/run-services.sh'
