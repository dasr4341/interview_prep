/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import EventsPage from "../../../lib/pages/events/events-page";

describe('Hide/Unhide events flow', () => {
  const login = new LoginPage();
  const events = new EventsPage();

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


  it('Hide the first event', () => {
    events.eventsListExist();
    cy.get('@eventCount').then(count => {
      if (count) {
        events.eventExposeMenu();
        events.hideUnhideOption();
        cy.waitForNetworkIdle(1000);
        events.alert().should('contain.text', 'Event successfully hidden');
      }
    });
  });

  it('Go to hidden events list by hidden option', () => {
    events.eventsListExist();
    cy.get('@eventCount').then(count => {
      if (count) {
        events.eventFilterButton();
        events.hiddenFilterOption();
        events.applyButton().should('contain.text', 'Apply').click();
        cy.waitForNetworkIdle(2000);
      }
    });
  });

  it('Unhide the first event', () => {
    events.eventsListExist();
    cy.get('@eventCount').then(count => {
      if (count) {
        events.eventExposeMenu();
        events.hideUnhideOption();
        events.alert().should('contain.text', 'Event successfully unhide');
      }
    });
  });
});
