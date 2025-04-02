/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
import login from './login-page';
import Logout from 'page/logout';

describe('Login positive flow check @happy-path', () => {
  const loginPage = new login();
  const logoutPage = new Logout();

  const userTypeArray = [
    'patient',
    'facilityUser',
    'facilityAdmin',
    'superAdmin',
    'pretaaAdmin',
  ];

  userTypeArray.forEach((userType) => {
    it(`Login functionality with valid credentials for user type : ${userType}`, () => {
      loginPage.visitTheLoginPage(
        userType === 'pretaaAdmin' ? '/pretaa-admin/login' : '/login'
      );
      // Get credentials baseed on env key name.
      // type mapped as key name in cypress.env.json
      loginPage.useValidCredential(userType);
      logoutPage.logout();
    });
  });
});
