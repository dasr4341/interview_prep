/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import Event from "../../../page/events/event-list";
import specInit from "lib/spec.init";
import pageTitleAssert from "components/page-title";


describe('Event read unread functionality checking', () => {
  const loginPage = new login();
  const eventPage = new Event();

  specInit();

  it('Go to Events page and assert page title', () => {
    loginPage.login();
    pageTitleAssert('Events');
  })

  it('Event check status read or unread', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(eventPage.locators.eventRow).length) {
        eventPage.eventPopover();
        eventPage.toggleReadUnread();
      }
    })
  })

})