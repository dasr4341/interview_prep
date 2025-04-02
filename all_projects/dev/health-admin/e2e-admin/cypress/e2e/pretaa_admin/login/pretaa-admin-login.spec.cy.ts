/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import login from "../../../page/login";
import logout from "page/logout";
import { getNavLink } from "components/nav";

describe('Pretaa admin login', () => {
  const loginPage = new login();
  const logoutPage = new logout();

  it('Go to the login page', () => {
    cy.visit('/pretaa-admin/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In');
  })

  it('Login with valid credential and verify as Pretaa Admin logged in', () => {
    loginPage.pretaaAdminLogin();
    getNavLink('Client Management')
  })

  it('Logout using logout link from nav', () => {
    logoutPage.logout()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })
})
