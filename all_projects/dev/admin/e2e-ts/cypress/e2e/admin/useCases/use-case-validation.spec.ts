/// <reference types="cypress" />

import * as faker from 'faker';
import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";

describe('Use case validation check', () => {
  const login = new LoginPage();
  const settingsPage = new SettingsPage();
  const useCaseName = 'CY' + faker.lorem.words(3);

  before(() => {
    cy.clearLocalStorageSnapshot()
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

  it('Go to Use Case list', () => {
    settingsPage.clickSettingsMenu();
    settingsPage.clickAdminMenu();
    settingsPage.clickUseCaseMenu();
    cy.url().should('include', '/use-cases');
    settingsPage.headerText().should('contain.text', 'Use Case Management');
    cy.waitForNetworkIdle(3000);
  })

  it('Validation check for use case name field', () => {
    settingsPage.createNewCollection();
    settingsPage.headerText().should('contain.text', 'Use case create');
    cy.get('[data-test-id="use-case-name"]').should('contain.text', 'Use case name');
    settingsPage.submitButton();
    settingsPage.validationCheck().should('contain.text', 'Use case name is required');
    settingsPage.fillFieldName('    ');
    settingsPage.submitButton();
    settingsPage.validationCheck().should('contain.text', 'Use case name is required');
  });

  it('Create use case collection', () => {
    settingsPage.fillFieldName(useCaseName);
    settingsPage.cancelButton();
    settingsPage.headerText().should('contain.text', 'Use Case Management');
    settingsPage.createNewCollection();
    settingsPage.fillFieldName(useCaseName);
    settingsPage.submitButton();
    settingsPage.alert().should('contain.text', 'Use case collection created successfully')
    cy.waitForNetworkIdle(3000);
    settingsPage.headerText().should('contain.text', useCaseName);
  });

});
