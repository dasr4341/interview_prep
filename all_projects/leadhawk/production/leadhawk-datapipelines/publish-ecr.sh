#!/bin/bash

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 767397854223.dkr.ecr.ap-south-1.amazonaws.com
# sudo docker build -t leadhawk-scraping -f Dockerfile.Lambda .
sudo docker build --no-cache -t leadhawk-scraping:lambda-latest -f Dockerfile.lambda .
sudo docker tag leadhawk-scraping:lambda-latest 767397854223.dkr.ecr.ap-south-1.amazonaws.com/leadhawk-scraping:lambda-latest
sudo docker push 767397854223.dkr.ecr.ap-south-1.amazonaws.com/leadhawk-scraping:lambda-latest

