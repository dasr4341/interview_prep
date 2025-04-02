/// <reference types="cypress" />


export default class Onboarding {

  connectFitbit() {
    cy.get('[type="submit"]').should('contain.text', 'Connect Fitbit');
    cy.get('[type="submit"]').click();
  }

  joinProgram() {
    cy.get('.text-center h2').should('contain.text', 'Welcome to Pretaa Health program!');
    cy.get('[type="submit"]').click()
  }

  fillUserDetails() {
    const credentials = Cypress.env("user_name_with_password").split(":");
    cy.get('[data-testid="submit-btn"]').should('contain.text', 'Continue')
    cy.get('[name="email"]').click().type(credentials[0])
    cy.get('[name="password"]').type(credentials[1])
    cy.get('[name="passwordConfirmation"]').type(credentials[1])
    cy.get('[data-testid="submit-btn"]').click()
  }

  fitbitFillUserDetails(){
    cy.get(' h1:nth-child(1)').should('contain.text','Sign In')
    const credentials = Cypress.env("fitbit_user_name_with_password").split(":");
    cy.get('[type="email"]').click().type(credentials[0])
    cy.get('[type="password"]').click().type(credentials[1])
    cy.get('[id="ember695"]').click()
    cy.wait(2000);
  }

}
