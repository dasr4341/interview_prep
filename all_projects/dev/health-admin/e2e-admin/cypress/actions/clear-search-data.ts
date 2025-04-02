/// <reference types="cypress" />

export default function clearData() {
  cy.get('header input').clear();
}
