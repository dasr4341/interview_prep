/// <reference types="cypress" />

export default class Logout {
  locators ={
    logoutLink: '[data-testid="logoutLink"]',
    logoutButton: '[data-testid="logoutButton"]',
    signInButton: '[data-testid="submit-btn"]',

  }
     
  logout(){
    cy.get(this.locators.logoutLink).click();
    cy.get(this.locators.signInButton).should('contain.text', 'Sign In');
  }

  logoutFromProfilePage(){
    cy.get(this.locators.logoutButton).click();
  }
}
