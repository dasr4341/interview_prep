/// <reference types="cypress" />

import * as queryString from 'query-string';
import LoginPage from '../../../lib/pages/login/login';
import CompanyPage from '../../../lib/pages/companies/company-page';
import FloatingButton from "../../../lib/components/floating-button";
import LaunchPage from "../../../lib/pages/launch/launch-page";

describe('Company launch test', () => {
  const login = new LoginPage();
  const companyPage = new CompanyPage();
  const floatingButton = new FloatingButton();
  const launchPage = new LaunchPage();
  
  let templateName = null;
  
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

  it('Go to Company Details page', () => {
    cy.visit('/companies/list?options=%5B%5D');
    companyPage.companiesListExist();
    cy.get('@companyCount').then((count) => {
      if(count) {
        companyPage.firstCompany().click();
        cy.waitForNetworkIdle(3000);
        cy.get('body').contains('Details');
      }
    })
  });

  it('Go to Launch page', () => {
    floatingButton.open();
    launchPage.selectLaunch();
    cy.waitForNetworkIdle(1000);
    cy.get('body').contains('Launch');
  });

  it('Selecting a template for a new message', ()=>{
    launchPage.selectingATemplate();
    cy.get('@selectedTemplate').then(t => templateName = t);
    cy.location('search').then((s) => {
      const parsed = queryString.parse(s);
      const selectedTemplate = queryString.parse(parsed.selectedTemplate as string);
      cy.log(templateName, selectedTemplate.label);
      expect(templateName).to.eq(selectedTemplate.label)
    });
  });

  it('Filling user emails to send the new message to', () => {
    launchPage.setEmailAndUsers();
  });

  it('Previewing the new message written',()=>{
    launchPage.previewTheEvent();
    //Verifying if the selected template matches in the preview.
    cy.get('[data-test-id="email-input-template"]')
    .should('have.attr', 'placeholder')
    .and('equal', templateName)
  });

  it('Launching the event',()=>{
    launchPage.launch();
  });

  it('Verifying if the event is created',()=>{
    launchPage.seeTheLaunchedEvent();
  });

});