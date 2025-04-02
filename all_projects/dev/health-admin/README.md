## Prerequisites
- Node.js 16
- Yarn (npm install --global yarn)

## Setup
`yarn install`
`yarn git:submodule:init`
`yarn start:dev`

## Submodules 
 
### ./src/graphql
This codes placed as a submodule because of we are using this query in multiple places. See the article https://www.atlassian.com/git/tutorials/git-submodule
 
This submodule automatically pulled when you run yarn command. pre-commit scripts has this code "git submodule update --init --remote --recursive"

If ./src/graphql codes modified need to commit two times once inside the submodule, then commit outside the submodule. this will create a ref for submodule 
commits. 

If you want to pull or update submodule run: `npm run pull`


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



## Schema update and schema generate 
App types heavily dependent on graphql codegen. if any graphql query modified or added, or schema changed in API server
 frontend schema and types must needs update. 

So for schema download - `yarn fetch-schema:env` and for update application types run `yarn codegen:env`.

Warning !!

Do not modify generated types `src/generatedTypes.ts` manually. This file will update by codegen. If you want to add new 
types you can create a different interface file.

