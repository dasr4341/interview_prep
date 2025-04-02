# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites
- Node.js 14
- Yarn (npm install --global yarn)

## Setup
- Make sure you're running pretaa-core
`yarn install`

## Deployment/Infrastructure
The static build artifacts are served up using AWS S3 with a CloudFront CDN distribution in front of 
it that serves both the API (pretaa-core) and this frontend.

The app is automatically built and deployed using AWS CodePipeline/CodeCommit when a commit is made or 
merged into the main branch. 

## Available Scripts

In the project directory, you can run:

### `yarn start`
Run development server, Connect application with .env file 
```
REACT_APP_PRETAA_API_URL={coreURL}
```

## Code Tags 
Code level some comments sometime saves lot of time for finding todo, notes, and etc. So all comments will be start with these prefix

You can use this extension for better color highlighting https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments

```
// * Alerts
// ? Queries
// * TODO
// * Highlights
// ! BLOCKER
// ! BLOCKER BACKEND
// * Info

```

## Static analysis 
sonar-scanner \
  -Dsonar.projectKey=pretaa-admin \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://13.213.96.170:9000/ \
  -Dsonar.login={key}


## Schema update and schema generate 
App types heavily dependent on graphql codegen. if any graphql query modified or added, or schema changed in API server
 frontend schema and types must needs update. 

So for schema download - `yarn fetch-schema:env` and for update application types run `yarn codegen:env`.

Warning !!

Do not modify generated types `src/generatedTypes.ts` manually. This file will update by codegen. If you want to add new 
types you can create a different interface file.
