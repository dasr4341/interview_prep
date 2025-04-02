/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import login from "../../page/login";
import logout from "page/logout";
import Settings from "page/settings";
import pageTitleAssert from "components/page-title";

describe('Login positive/negative flow check', () => {
  const loginPage = new login();
  const logoutPage = new logout();
  const settingPage = new Settings();

  it('Go to the login page', () => {
    cy.visit('/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })

  it('Sign in without credentials', () => {
    loginPage.withOutCredential();
  })

  it('Sign in with wrong email', () => {
    loginPage.wrongEmailCredential(Cypress.env("patient_user_name_with_password").split(":"));
  })

  it('Sign in with wrong password', () => {
    loginPage.wrongPasswordCredential(Cypress.env("patient_user_name_with_password").split(":"));
  })

  it('Sign in with both invalid credentials', () => {
    loginPage.invalidCredentials();
  })

  it('Sign in with only space value', () => {
    loginPage.loginWithSpacesInFields();
  })

  it('Sign in with only password', () => {
    loginPage.onlyEmailCredential("patient_user_name_with_password");
  })

  it('Sign in with only email', () => {
    loginPage.onlyEmailCredential("patient_user_name_with_password");
  })

  it('Login with valid credentials', () => {
    loginPage.useValidCredential()
    pageTitleAssert('Events')
  })

  it('Logout using "Logout" link from nav', () => {
    logoutPage.logout()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })

  it('Logout using "Logout" button from profile page', () => {
    loginPage.useValidCredential()
    cy.get(settingPage.locators.settingsMenu).click()
    logoutPage.logoutFromProfilePage()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })
})
