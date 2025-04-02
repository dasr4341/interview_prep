/// <reference types="cypress" />

import CompanyPage from '../../../lib/pages/companies/company-page';
export default class CompanyTimelineVerifyPage extends CompanyPage {
  clickOnTimelineLink() {
    cy.get('[data-test-id="timeline-link"]').click();
    cy.waitForNetworkIdle(3000);
  }

  verifyTimelineFromCompanyDetails() {
    this.firstCompany().click();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="company-list-link"]').then(el => {
      const companyName = el.text();
      this.clickOnTimelineLink();
      this.pageTitle().should('include.text', companyName + `'s Timeline`);
      cy.get('[data-test-id="events_desc"]').should('include.text', companyName);
    });
  }

  firstEventClick() {
    cy.get('[data-test-id="events"]').first().click();
    cy.waitForNetworkIdle(3000);
    this.pageTitle().should('contain.text', 'Event Details');
    cy.waitForNetworkIdle(3000);
  }

  verifyTimelineFromEventDetails() {
    cy.get('[data-test-id="company-name"]').then(company => {
      const companyName = company.text();
      this.clickOnTimelineLink();
      this.pageTitle().should('include.text', companyName + `'s Timeline`);
      cy.get('[data-test-id="events_desc"]').should('include.text', companyName);
    });
  }
}
