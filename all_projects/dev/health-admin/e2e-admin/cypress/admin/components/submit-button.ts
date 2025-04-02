/// <reference types="cypress" />

export default function submitButton(){
  cy.get('[type="submit"]').click();
}