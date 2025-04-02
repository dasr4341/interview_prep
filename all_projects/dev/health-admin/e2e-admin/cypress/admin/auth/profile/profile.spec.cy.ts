/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
import login from '../login/login-page';
import Profile from './profile-page';
import Logout from 'auth/logout/logout-page';

describe('Verify current user email for all users @happy-path', () => {
  const loginPage = new login();
  const profilePage = new Profile();
  const logoutPage = new Logout();

  const userTypeArray = [
    'patient',
    'facilityUser',
    'facilityAdmin',
    'superAdmin',
  ];

  userTypeArray.forEach((userType) => {
    it(`Verify current user email for user type : ${userType}`, () => {
      loginPage.visitTheLoginPage('/login');
      // Get credentials baseed on env key name.
      // type mapped as key name in cypress.env.json
      loginPage.useValidCredential(userType);
      const email = Cypress.env(userType).email;
      profilePage.verifyEmail(email);
      logoutPage.logout();
    });
  });
});
