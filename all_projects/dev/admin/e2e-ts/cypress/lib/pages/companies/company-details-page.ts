export default class CompanyDetailsPage {
  checkOpportunity() {
    cy.get('[data-test-id="opportunities-link"]').then(el => el.length).as('opportunityCount');
  }

  opportunityLink() {
    return cy.get('[data-test-id="opportunities-link"]');
  }
  opportunityName() {
    return cy.get('[data-test-id="opportunity-name"]');
  }
}
