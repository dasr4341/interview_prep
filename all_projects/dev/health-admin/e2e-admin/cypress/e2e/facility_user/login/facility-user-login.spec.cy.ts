/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />


import { getMenu } from "components/nav";
import login from "../../../page/login";
import logout from "page/logout";
import Settings from "page/settings";

describe('Facility user login', () => {
  const loginPage = new login();
  const logoutPage = new logout();
  const settingPage = new Settings();

  it('Go to the login page', () => {
    cy.visit('/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In');
  })

  it('Login with valid credential and verify as facility user logged in', () => {
    loginPage.facilityUserLogin();
    getMenu('Patients').should('contain.text','Patients');
  })

  it('Logout using logout link from nav', () => {
    logoutPage.logout()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })

  it('Logout using logout button from profile page', () => {
    loginPage.facilityUserLogin()
    cy.get(settingPage.locators.settingsMenu).click()
    logoutPage.logoutFromProfilePage()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })
})
