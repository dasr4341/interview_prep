/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import EventsPage from "../../../lib/pages/events/events-page";
import LoginPage from "../../../lib/pages/login/login";

describe('Check notification', () => {
  const login = new LoginPage();
  const eventPage = new EventsPage();
  let eventUrl: string | null = null;
  
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

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

  it('Go to first event details page', () => {
    eventPage.eventsListExist();
    cy.get('@eventCount').then((count) => {
      if(count) {
        eventPage.firstEvent().click();
        cy.waitForNetworkIdle(3000);
        cy.get('body').contains('Event Details');
        cy.waitForNetworkIdle(3000);
      }
    });

    cy.url().then(url => {
      eventUrl = url;
      return url;
    }).as('eventDetailsUrl');
  });

  it('Logout from the current session', () => {
    login.logout();
    cy.waitForNetworkIdle(3000);
  });

  it('Check current url', () =>{
    cy.visit(eventUrl);
    cy.waitForNetworkIdle(3000);
    login.loginWithPassword();
    cy.waitForNetworkIdle(3000);
    cy.url().should('eq', eventUrl);
  })
})
