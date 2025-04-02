/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import login from "../../../page/login";
import logout from "page/logout";
import { getNavLink } from "components/nav";
import SuperAdmin from "page/super-admin";

describe('Super admin login', () => {
  const loginPage = new login();
  const logoutPage = new logout();
  const superAdminPAge = new SuperAdmin();

  it('Go to the login page', () => {
    cy.visit('/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In');
  })

  it('Login with valid credential and verify as Super Admin logged in', () => {
    loginPage.superAdminLogin();
    cy.get(superAdminPAge.locators.adminMenu).click()  
    cy.waitForNetworkIdle(3000);
    getNavLink('Facility Management');
  })

  it('Logout using logout link from nav', () => {
    logoutPage.logout()
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In')
  })
})
