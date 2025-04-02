/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import event from "../../../page/events/event-list"
import pageTitleAssert from '../../../admin/components/page-title';
import specInit from "lib/spec.init";

describe('Event list search', () => {
  const loginPage = new login();
  const eventList = new event();

  specInit();

  it('Login with Valid Credentials', () => {
    loginPage.login();
    pageTitleAssert('Events');
  })

  it('Event search with existing event', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(eventList.locators.eventRow).length) {
      eventList.existingEventSearch()
      }
      else{
        cy.contains('No events yet');
      }
    })
  })

  it('Event search with non existing event', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(eventList.locators.eventRow).length) {
      eventList.nonExistingEventSearch()
      }
      else{
        cy.contains('No events yet');
      }
    })
  })
})

