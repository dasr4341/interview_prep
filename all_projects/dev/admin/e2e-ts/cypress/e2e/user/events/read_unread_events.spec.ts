/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import EventsPage from "../../../lib/pages/events/events-page";

describe('Read/Unread events flow check', () => {
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

    it('Change event status', () => {
      events.eventsListExist();
      cy.get('@eventCount').then(count => {
        if (count) {
          events.readUnreadEvent(); 
        }
      });
    });
});
