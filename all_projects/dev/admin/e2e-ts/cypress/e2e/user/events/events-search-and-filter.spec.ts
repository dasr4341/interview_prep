/// <reference types="cypress" />
///<reference types="cypress-network-idle" />

import LoginPage from "../../../lib/pages/login/login";
import EventsPage from "../../../lib/pages/events/events-page";
import * as faker from 'faker';

describe('Event search flow', () => {
  const login = new LoginPage();
  const events = new EventsPage();
  const invalidDataSearch = 'test search' + faker.lorem.words();

  before(() => {
    cy.clearLocalStorageSnapshot()
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

  it('Event search by description: with faker', () => {
    cy.wait(2000);
    events.eventsListExist()
    cy.get('@eventCount').then(count => {
      if (count) {
        cy.get('body input').clear().type(invalidDataSearch);
        cy.waitForNetworkIdle(2000);
        cy.get('[data-testid="no-events-text"]').should('contain.text', 'No results');
        cy.get('body input').clear();
        cy.waitForNetworkIdle(2000);
        events.getEventType().then((type) => {
          cy.log('search data: ', type);
          cy.get('body input').type(String(type));
          cy.waitForNetworkIdle(2000);
        }); 
      }
    })
  });

  it('Event Filter by Options', () => {
    cy.get('body input').clear();
    cy.wait(2000);
    events.getFilterOption().then(el => {
      cy.waitForNetworkIdle(2000);
      events.getFilterEvent(el);
    });
  });
});