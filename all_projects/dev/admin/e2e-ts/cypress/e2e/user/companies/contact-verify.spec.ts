/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import ContactPage from '../../../lib/pages/companies/contact/contact-verify';

interface Response {
  title: string;
}

describe('Contacts list and detail page verification flow', () => {
  const login = new LoginPage();
  const contact = new ContactPage();

  before(() => {
    cy.clearLocalStorageSnapshot()
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  let title = null;

  it('Login', () => {
    login.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Check contacts list and detail page from company detail page', () => {
    cy.url().should('include', '/events');
    cy.waitForNetworkIdle(1000);
    contact.selectContact().then((response : Response) => {
      title = response.title;
      if (contact.contactExits) {
        contact.clickContactVerifyTitle({ title });
        contact.primaryContactHeader().should('contain.text', 'Primary Contact')
      } else {
        cy.log('No contacts exist');
      }
    })
  });
});
