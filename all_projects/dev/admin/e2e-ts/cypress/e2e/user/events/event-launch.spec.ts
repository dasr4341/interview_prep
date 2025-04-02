/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import * as queryString from 'query-string';
import LoginPage from '../../../lib/pages/login/login';
import EventsPage from '../../../lib/pages/events/events-page';
import FloatingButton from "../../../lib/components/floating-button";
import LaunchPage from "../../../lib/pages/launch/launch-page";

describe('Event launch test', () => {
  const login = new LoginPage();
  const eventPage = new EventsPage();
  const floatingButton = new FloatingButton();
  const launchPage = new LaunchPage();
  let templateName = null;

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

  it('Event exists and open an event', () => {
    eventPage.filterEventByNotInLaunch();
    eventPage.eventsListExist();
    cy.get('@eventCount').then(count => {
      if (count) {
        eventPage.firstEvent().click();
        cy.waitForNetworkIdle(3000);
        cy.get('body').contains('Event Details');
      }
    })
  });

  it('Go to Launch page', () => {
    floatingButton.open();
    launchPage.selectLaunch();
    cy.waitForNetworkIdle(1000);
    cy.get('body').contains('Launch');
  });

  it('Selecting a template for a new message', ()=>{
    launchPage.selectingATemplate();
    cy.get('@selectedTemplate').then(t => templateName = t);
    cy.location('search').then((s) => {
      const parsed = queryString.parse(s);
      const selectedTemplate = queryString.parse(parsed.selectedTemplate as string);
      cy.log(templateName, selectedTemplate.label);
      expect(templateName).to.eq(selectedTemplate.label)
    });
  });

  it('Filling user emails to send the new message to', () => {
    launchPage.setEmailAndUsers();
  });

  it('Previewing the new message written',()=>{
    launchPage.previewTheEvent();
    //Verifying if the selected template matches in the preview.
    cy.get('[data-test-id="email-input-template"]')
    .should('have.attr', 'placeholder')
    .and('equal', templateName)
  });

  it('Launching the event',()=>{
    launchPage.launch();
  });

  it('Verifying if the event is created',()=>{
    launchPage.seeTheLaunchedEvent();
  });
});
