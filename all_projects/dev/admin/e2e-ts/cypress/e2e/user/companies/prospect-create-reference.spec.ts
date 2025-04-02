/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import Reference from '../../../lib/pages/companies/reference';
import CompanyListPage from '../../../lib/pages/companies/company-page';
import DefaultPage from '../../../lib/pages/default-page';
import * as faker from 'faker';
import { ProspectReference } from '../../../lib/interfaces/prospect-reference.interface';

describe('Create reference test', () => {
  const randomDesc = faker.lorem.words();
  let selectedCompanyTitle = null;
  let formValues: ProspectReference = {
    offerOptionsFirstOption: '',
    servedAsReferenceAt: '',
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
  const createReference = new Reference();
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

  it('Filter Prospects', () => {
    createReference.filterProspects();
    cy.waitForNetworkIdle(2000);
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
        cy.get('body').contains('PROSPECT');
      }
    });
  });

  it('Goto reference page', () => {
    createReference.goToReference();
    cy.get('@selectCompanyTitle').then(c => selectedCompanyTitle = c);
  });

  it('Create and verify Reference', () => {
    cy.waitForNetworkIdle(1000);
    createReference.prospectRefFillUpForm(randomDesc).then(v => formValues = v);
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="company-list-link"]').should('contain.text', selectedCompanyTitle);
    createReference.verifyCreatedReferenceForOpportunity();
  });

  it('Go to reference details', () => {
    cy.waitForNetworkIdle(2000);
    createReference.referenceDetailsVerifyCompany(selectedCompanyTitle);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.offerOptionsFirstOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.servedAsReferenceAt);

    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.didTheyDoFirstOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.didTheyDoSecondOption);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.firstName);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.position);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.email);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.phone);
    cy.get('[data-testid="content-frame"]').should('contain.text', formValues.notes);
  });
});
