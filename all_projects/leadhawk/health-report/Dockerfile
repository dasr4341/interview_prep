FROM amazon/aws-lambda-nodejs:18

RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install epel -y
# RUN yum install -y chromium
# RUN amazon-linux-extras install python3.8

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ${LAMBDA_TASK_ROOT}/
COPY dist ${LAMBDA_TASK_ROOT}/dist
COPY prisma ${LAMBDA_TASK_ROOT}/prisma
COPY html ${LAMBDA_TASK_ROOT}/html
# COPY python ${LAMBDA_TASK_ROOT}/python
COPY chromium ${LAMBDA_TASK_ROOT}/chromium

RUN npm install
RUN npx prisma generate
# RUN pip3.8 install -r ${LAMBDA_TASK_ROOT}/python/requirements.txt
RUN yum install -y ${LAMBDA_TASK_ROOT}/chromium/chromium-common-116.0.5845.187-1.el7.x86_64.rpm
RUN yum install -y ${LAMBDA_TASK_ROOT}/chromium/chromedriver-116.0.5845.187-1.el7.x86_64.rpm
RUN yum install -y ${LAMBDA_TASK_ROOT}/chromium/chromium-116.0.5845.187-1.el7.x86_64.rpm
RUN yum install -y ${LAMBDA_TASK_ROOT}/chromium/chromium-headless-116.0.5845.187-1.el7.x86_64.rpm
RUN rm -rf ${LAMBDA_TASK_ROOT}/chromium

