/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import login from "../../../page/login";

describe('Pretaa admin login validation check', () => {
  const loginPage = new login();

  it('Go to the login page', () => {
    cy.visit('/pretaa-admin/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In');
  })

  it('Sign in without credentials', () => {
    loginPage.withOutCredential();
  })

  it('Sign in with wrong email', () => {
    loginPage.wrongEmailCredential(Cypress.env("pretaa_admin_with_password").split(":"));
  })

  it('Sign in with wrong password', () => {
    loginPage.wrongPasswordCredential(Cypress.env("pretaa_admin_with_password").split(":"));
  })

  it('Sign in with both invalid credentials', () => {
    loginPage.invalidCredentials();
  })

  it('Sign in with only space value', () => {
    loginPage.loginWithSpacesInFields();
  })

  it('Sign in with only email', () => {
    loginPage.onlyEmailCredential("pretaa_admin_with_password");
  })

  it('Sign in with only password', () => {
    loginPage.onlyEmailCredential("pretaa_admin_with_password");
  })

  it('Valid credentials login', () => {
    loginPage.pretaaAdminLogin();
  })

})