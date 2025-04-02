# Configuration steps

### To set up the Okta SSO integration:

1. In the Admin view of your Okta organization, click Add Application, search for Pretaa, then click Add.

2. In the Sign On tab, copy the Client ID and Client Secret and fill in your Dashboard > Settings > Okta Settings

3. Send these values, along with the Org Name and the Okta Issuer URL (https://example.okta.com) in the Okta settings of your Pretaa dashboard.

4. Follow these steps, to create an API token. https://developer.okta.com/docs/guides/create-an-api-token/main/#create-the-token

5. Fill this in the Okta settings in the Pretaa dashboard and click 'Save'

### Assign users
To give users access to the Pretaa SSO, click the Assignments tab, then click Assign. Ensure the User Name field is a valid email.

### Import Users

Once you've assigned users, click on Import Users in dashboard. Depending on the number of users, this will take some time.

Assigned users will now be able to log into Pretaa via SSO through the Pretaa app on their Okta dashboards. Keep in mind, accounts won't be created in Pretaa until the initial SSO login.

