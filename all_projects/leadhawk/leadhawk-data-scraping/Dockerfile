# Stage 1

FROM node:20.12.2-alpine3.19 as builder

WORKDIR /build

COPY package*.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

RUN npm install

RUN npm run build


# Stage 2

FROM amazon/aws-lambda-nodejs:20 as runner

RUN corepack enable

  

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist dist/

RUN yarn
