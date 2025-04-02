/// <reference types="cypress" />

class UsersPage {

  totalUsersCount() {
    return cy.get('.ag-status-panel-total-and-filtered-row-count');
  }

  fillUserName(value) {
    cy.get('[data-testid="search-input"]')
      .clear()
      .type(value);
  }

  userName() {
    return cy.get('[data-test-id="name-col"]').first();
  }
}

export default UsersPage;
