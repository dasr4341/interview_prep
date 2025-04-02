/// <reference types="cypress-xpath" />

import SettingsPage from "./settings-page";

class CompaniesPage extends SettingsPage {

  alert() {
    return cy.get('.Toastify .Toastify__toast--success');
  }

  companyListFieldHeading() {
    return cy.get('[data-testid="content-frame"] h2');
  }

  createNew() {
    cy.contains('Create New').click();
  }

  createCompanyListButton() {
    cy.contains('Create Company List').click();
  }

  continueButton() {
    cy.contains('Continue').click();
  }

  selectAllCompaniesCheckBox() {
    cy.get('.ag-header-cell:nth-child(1) input').click();
  }

  manageCompaniesButton() {
    return cy.get('form h3');
  }
  CompaniesButton() {
    return cy.get('body header button');
  }
  companiesMenu() {
    cy.xpath('//div/a[6][text()="Companies"]').click();
  }

  firstCompaniesList() {
    return cy.get('[data-test-id="events"]:nth-child(1)');
  }

  firstCompanyListName() {
    return cy.get('[test-data-id="companies_List"]:nth-child(1) h3.text-primary');
  }

  pageHeader() {
    return cy.get('body h1');
  }

  searchField() {
    return cy.get('body input');
  }

  fillSearchField(value) {
    cy.get('body input')
      .clear()
      .type(value);
  }

  noDataFoundText() {
    return cy.get('body h1');
  }

  noResultsText() {
    return cy.get('[data-testid="content-frame"] h1');
  }

  refineSearchText() {
    return cy.get('[data-testid="content-frame"] p');
  }

  companyListName() {
    return cy.get('[test-data-id="companies_List"] h3');
  }

  deleteCompanyList(companyListName) {
    return new Promise((resolve) => {
      cy.log('company list name ', companyListName);
      cy.get('[test-data-id="companies_List"]').then(($el) => {
        let companyListIndex;
        $el.each((i, elm) => {
          if (elm.querySelector('h3')?.innerHTML === companyListName) {
            companyListIndex = i;
            cy.log(companyListIndex)
            if (companyListIndex % 2 == 0) {
              cy.log("The number is even.");
              cy.get(`[test-data-id="companies_List"]:nth-child(${companyListIndex + 1}) svg`).click();
              cy.get('[data-test-id="options"]:nth-child(2)').click();
              cy.get('[data-popup="modal"] .modal').should('contain.text', 'Did you want to delete this list?');
              this.deleteButton();
              this.alert().should('contain.text', 'List deleted successfully');
            }
            else {
              cy.log("The number is odd.");
              cy.get(`[test-data-id="companies_List"]:nth-child(${companyListIndex + 2}) svg`).click();
              cy.get('[data-test-id="options"]:nth-child(2)').click();
              cy.get('[data-popup="modal"] .modal').should('contain.text', 'Did you want to delete this list?');
              this.deleteButton();
              this.alert().should('contain.text', 'List deleted successfully');
            }
          }
          resolve(companyListIndex);
        });
      });
    });
  }
}




export default CompaniesPage;

