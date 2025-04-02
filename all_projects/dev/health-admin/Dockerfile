FROM ubuntu:22.04
ARG DEBIAN_FRONTEND=noninteractive
ARG MAX_OLD_SPACE_SIZE=7000
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

RUN apt update 


RUN apt-get -y install curl gnupg nano jq git
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs

RUN npm install -g serve 
RUN npm install -g yarn 
