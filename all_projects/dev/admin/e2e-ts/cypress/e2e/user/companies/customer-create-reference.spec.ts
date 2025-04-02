/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import CreateReferencePage from '../../../lib/pages/companies/reference';
import CompanyListPage from '../../../lib/pages/companies/company-page';
import DefaultPage from '../../../lib/pages/default-page';
import * as faker from 'faker';
import { CustomerReference } from '../../../lib/interfaces/customer-reference.interface';

describe('Create reference test', () => {
  const randomDesc = faker.lorem.words();
  let selectedCompanyTitle = null;
  let formValuesCF: CustomerReference = {
    offeredTo: '',
    offerOptionsFirstOption: '',
    offerOptionsSecondOption: '',
    servedAsReferenceForId: '',
    servedAsReferenceAt: '',
    dealClosed: '',
    didTheyDoFirstOption: '',
    didTheyDoSecondOption: '',
    firstName: '',
    lastName: '',
    position: '',
    phone: 0,
    email: '',
    notes: ''
  };

  const login = new LoginPage();
  const defaultPage = new DefaultPage();
  const createReference = new CreateReferencePage();
  const companies = new CompanyListPage();

  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Login', () => {
    login.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Go to Company listing page', () => {
    cy.visit('/companies/list');
    cy.waitForNetworkIdle(3000);
    defaultPage.pageTitle().should('contain.text', 'Companies');
  });

  it('Filter Customers', () => {
    createReference.filterCustomers();
    companies.companiesListExist();
    cy.get('@companyCount').then((count) => {
      if (count) {
        cy.get('[data-test-id="company-row"]').should('have.length.at.least', 1);
      }
    });
  });

  it('Go to Company details', () => {
    companies.companiesListExist();
    cy.get('@companyCount').then((count) => {
      if (count) {
        companies.firstCompany().click();
        cy.waitForNetworkIdle(3000);
        cy.get('body').contains('Details');
        cy.get('body').contains('CUSTOMER');
      }
    });
  });

  it('Goto reference page', () => {
    createReference.goToReference();
    cy.get('@selectCompanyTitle').then(c => selectedCompanyTitle = c);
  });

  it('Create and verify Reference', () => {
    cy.waitForNetworkIdle(1000);
    createReference.customerRefFillUpForm(randomDesc).then(v => formValuesCF = v);
    cy.waitForNetworkIdle(3000);
    createReference.verifyCreatedReferenceAddedInTheList();
  });

  it('Go to reference details', () => {
    cy.waitForNetworkIdle(2000);
    createReference.referenceDetails(selectedCompanyTitle);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.offeredTo);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.didTheyDoFirstOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.didTheyDoSecondOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.servedAsReferenceForId);

    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.servedAsReferenceAt);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.offerOptionsFirstOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.offerOptionsSecondOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.dealClosed);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.firstName);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.position);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.email);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.phone);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValuesCF.notes);
  });
});
