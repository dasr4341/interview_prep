/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import * as faker from 'faker';
import UsersPage from "../../../lib/pages/settings/users-page";

describe('User search flow from user management list', () => {
  const login = new LoginPage();
  const usersPage = new UsersPage();
  
  
  before(() => {
    cy.clearLocalStorageSnapshot();
  })

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
  
  it('Login', () => {
    login.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Go to User list', () => {
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/admin/user-list');
    cy.waitForNetworkIdle(3000);
    cy.url().should('include', '/user-list');
    cy.get('body h1').should('contain.text', 'User Management');
  });

  it('Search users from the list with valid and invalid data', () => {
    cy.waitForNetworkIdle(3000);
    usersPage.userName().then(($el) => {
      usersPage.fillUserName($el.text());
      cy.waitForNetworkIdle(3000);
      usersPage.userName().should('contains.text', $el.text());
    });
    usersPage.fillUserName(faker.lorem.words());
    cy.waitForNetworkIdle(3000);
    cy.contains('No Rows To Show')
  });
});
