/// <reference types="cypress" />

export default function pageTitleAssert(title: string) {
  cy.get('header h1').should('contain.text', title);
}

