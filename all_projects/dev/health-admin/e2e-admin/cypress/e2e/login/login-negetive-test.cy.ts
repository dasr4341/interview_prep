
import { describe } from 'mocha';
import login from '../../page/login';

const loginPage = new login();
describe('Login Negative test flow check',()=>{
  it.skip('Sign-in with invalid email', () => {
    loginPage.wrongEmailCredential(Cypress.env(`patient`).password);
  });
  
  it.skip('Sign in with wrong password', () => {
    loginPage.wrongPasswordCredential(Cypress.env(`patient`).email);
  });
  
  it.skip('Sign in with wrong email and password both', () => {
    loginPage.invalidCredentials();
  });
  
  it.skip('Sign in with only space value', () => {
    loginPage.loginWithSpacesInFields();
  });
  it.skip('Sign-in with empty fields', () => {
    loginPage.withOutCredential();
  });
})
