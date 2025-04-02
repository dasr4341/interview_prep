const axios = require('axios');

const WORKSPACE = 'bitbucket_pretaa';
const REPO_SLUG = 'admin';
const BITBUCKET_USER = 'prosenjit_itobuz';

const client = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  auth: {
    username: BITBUCKET_USER,
    password: process.env.BITBUCKET_APP_PASSWORD,
  },
});

async function main() {
  try {
      const branch = process.env.BITBUCKET_BRANCH;
      const res = await client.get(`/repositories/${WORKSPACE}/${REPO_SLUG}/pipelines/?target.branch=${branch}&status=BUILDING&status=PENDING`);
      if (res.data.values.length < 2) { // Skip if only one pipeline running
        return;
      }
      
      const uuid = res.data.values[0].uuid;
      await client.post(`/repositories/${WORKSPACE}/${REPO_SLUG}/pipelines/${uuid}/stopPipeline`);
  } catch(e) {
    console.log(e.message);
  }
}

main()