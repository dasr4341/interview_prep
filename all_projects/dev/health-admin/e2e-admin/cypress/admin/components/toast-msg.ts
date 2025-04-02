/// <reference types="cypress" />

export default function alertMessage(alert: string) {
  cy.get('[role="alert"]').should('contain.text', alert)
}

