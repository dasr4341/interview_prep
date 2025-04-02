/// <reference types="cypress" />

export default class insightsPage {
  filterAndVerifyUsingDropdown() {
    cy.get('.my-insights-label').should('contains.text', 'Filter By');
    cy.get('.basic-single').click();
    cy.get('[data-test-id="title"]').should('contains.text', 'ALL');
  }
  verifyNumberInsights() {
    cy.get('.text-gray-150').eq(2).as('numberTitle');
  }
  selectWeekOption() {
    cy.get('.my-insights-label').should('contains.text', 'Filter By');
    cy.waitForNetworkIdle(3000);
    cy.get('.basic-single').contains('1 Week').click();
    cy.get('[data-test-id="title"]').should('contains.text', '1 Week');
  }
  VerifyWeeksNumberInsights({ numberInfo }) {
    cy.get('.text-gray-150')
      .eq(2)
      .then(($numberInsight) => {
        const insightsNumber = $numberInsight.text();
        console.log({ insightsNumber, numberInfo });
        expect(insightsNumber).not.to.equal(numberInfo);
      });
  }
}
