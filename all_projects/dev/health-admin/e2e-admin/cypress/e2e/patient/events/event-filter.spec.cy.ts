/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "../../../page/login";
import Event from "../../../page/events/event-list";
import specInit from "lib/spec.init";
import pageTitleAssert from "components/page-title";
import noDataFoundTextAssert from "components/no-result-assert";


describe('Event filter checking', () => {
  const loginPage = new login();
  const eventPage = new Event();

  specInit();

  it('Go to Events page and assert page title', () => {
    loginPage.login();
    pageTitleAssert('Events');
  })

  it('Filter with "ALERT" event type', () => {
    eventPage.filterEventsByType({ type: 'ALERT' });
    cy.get('body').then(($elm) => {
      if ($elm.has(eventPage.locators.eventRow).length) {
      cy.get(eventPage.locators.eventRow).find('h3').each(($filter) => {
      console.log($filter);
      expect($filter.text().toUpperCase()).to.equal('ALERT');
       })
      cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
      else{
        noDataFoundTextAssert('No results', 'Refine your search and try again');
        cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
    })
  })

  it('Filter with "REPORT" event type', () => {
    eventPage.filterEventsByType({ type: 'REPORT' });
    cy.get('body').then(($elm) => {
      if ($elm.has(eventPage.locators.eventRow).length) {
      cy.get(eventPage.locators.eventRow).find('h3').each(($filter) => {
      console.log($filter);
      expect($filter.text().toUpperCase()).to.equal('REPORT');
       })
      cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
      else{
        noDataFoundTextAssert('No results', 'Refine your search and try again');
        cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
    })
  })

  it('Filter with "COMPLETED SURVEY" event type', () => {
    eventPage.filterEventsByType({ type: 'COMPLETED_SURVEY' });
    cy.get('body').then(($elm) => {
      if ($elm.has(eventPage.locators.eventRow).length) {
      cy.get(eventPage.locators.eventRow).find('h3').each(($filter) => {
      console.log($filter);
      expect($filter.text().toUpperCase()).to.equal('COMPLETED SURVEY');
       })
      cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
      else{
        noDataFoundTextAssert('No results', 'Refine your search and try again');
        cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
    })
  })

  it('Filter with "INCOMPLETE SURVEY" event type', () => {
    eventPage.filterEventsByType({ type: 'INCOMPLETE_SURVEY' });
    cy.get('body').then(($elm) => {
      if ($elm.has(eventPage.locators.eventRow).length) {
      cy.get(eventPage.locators.eventRow).find('h3').each(($filter) => {
      console.log($filter);
      expect($filter.text().toUpperCase()).to.equal('INCOMPLETE SURVEY');
       })
      cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
      else{
        noDataFoundTextAssert('No results', 'Refine your search and try again');
        cy.contains('Clear all').click();
      cy.get(eventPage.locators.eventRow);
      }
    })
  })
})