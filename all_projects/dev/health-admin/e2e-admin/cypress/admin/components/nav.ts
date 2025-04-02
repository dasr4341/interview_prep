/// <reference types="cypress" />

export  function selectMenu(menu: string) {
  cy.get(`[data-testid="${menu}"]`).click();
}
export  function getMenu(menu: string) {
  return cy.get(`[data-testid="${menu}"]`);
}

export  function getNavLink(link :string) {
  cy.get('[data-test-id="navLink-el"]').should('contain.text', link);
}

export  function selectNavLink(link :string) {
  cy.get('[data-test-id="navLink-el"]').should('contain.text', link).click();
}