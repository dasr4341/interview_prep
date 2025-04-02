/// <reference types="cypress" />

export default function searchData(searchText: string) {
  cy.get('header input').click().clear().type(searchText);
}
