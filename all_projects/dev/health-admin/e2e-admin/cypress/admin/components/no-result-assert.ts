/// <reference types="cypress" />

export default function noDataFoundTextAssert(noDataFoundText: string, refineSearchText: string) {
  cy.get('[data-testid="no-results"]').should('contain.text', noDataFoundText);
  cy.get('[data-testid="refine-search"]').should('contain.text', refineSearchText);
}

