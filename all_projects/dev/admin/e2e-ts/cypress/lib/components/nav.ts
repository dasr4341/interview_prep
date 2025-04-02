/// <reference types="cypress" />

export default function NavElement() {
  return {
    companyList: () => cy.get('[data-test-id="navLink-el"]').contains('Companies'),
  }
}