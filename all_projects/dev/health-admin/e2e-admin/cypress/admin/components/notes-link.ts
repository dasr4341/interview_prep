/// <reference types="cypress" />

export default function notesLinkFromDetails(){
  cy.get('[data-testid="note-link"]').scrollIntoView().click();
}