/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />


import login from "page/login";
import Event from 'page/events/event-list';
import specInit from "lib/spec.init";

describe('Snooze Events', () => {
  const loginPage = new login();
  const event = new Event();

  specInit();

  it('Login', () => {
    loginPage.login();
  })

  it('Go to events popover menu and set reminder for random event', () => {
    cy.get(event.locators.eventPopOver).eq(0).click();
    event.eventSnoozeOption();
    event.assertSuccessfullyReminderSet();
  })
})