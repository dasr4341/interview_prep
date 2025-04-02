import { config } from '../config/config.js';

export const userHelper = {
  getFirebaseUser: async () => {
    const response = await fetch('http://127.0.0.1:5001/pretaa-fitness/us-central1/healthKitShow', {
      method: 'POST',
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZDdiMzEwMy0xMGQyLTQzYmYtOTdmZC03OWE2ZTAzZTM5ZGUiLCJhZG1pbiI6ZmFsc2UsInBhcmVudFRva2VuIjoiIiwicGFyZW50TG9nSWQiOiIiLCJjb2RlIjoiIiwiaWF0IjoxNjgzMjYyNDIzLCJleHAiOjE2ODMyNjk2MjN9.f3cm6XR1Zkp3yfxxm9Dj6FPzJvBKzmfRP_SfQyaXxGk',
        'content-type': 'application/json',
      },
    });
    const user = await response.json();
    const userId = String(user.data.user.id);
    const heart = user.data.heart;

    return { userId, heart };
  },

  getPretaaUser: async (access_token: string) => {
    const response = await fetch(config.pretaa.base_url.dev as string, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'PretaaHealthCurrentUser',
        query: 'query PretaaHealthCurrentUser {\n  pretaaHealthCurrentUser {\n    id, \n    status, \n  }\n}',
        variables: {},
      }),
    });

    const user = await response.json();

    return user.data;
  },
};
