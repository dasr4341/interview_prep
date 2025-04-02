/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import UseCasePage from "../../../lib/pages/settings/use-case-page";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import * as faker from 'faker';

describe('Use case flow', () => {
  const login = new LoginPage();
  const settingsPage = new SettingsPage();
  const useCasePage = new UseCasePage();
  const useCaseName = 'CY-' + faker.lorem.words(2);

  before(() => {
    cy.clearLocalStorageSnapshot()
  })

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
    useCasePage.routes.list();
    settingsPage.headerText().should('contain.text', 'Use Case Management');
  })

  it('Create a Use Case collection', () => {
    settingsPage.createNewCollection();
    settingsPage.headerText().should('contain.text', 'Use case create');
    cy.url().should('include', '/settings/admin/use-cases/create');
    useCasePage.selectors.nameField().type(useCaseName);
    useCasePage.selectors.submit().click();
    cy.waitForNetworkIdle(1000);
    cy.url().should('include', 'settings/admin/use-cases/detail');
    cy.waitForNetworkIdle(4000);
    useCasePage.selectors.submit().click();
    useCasePage.toast.selectors.success().should('contain.text', 'Use case collection updated');
    cy.waitForNetworkIdle(1000);
  });

  it('Edit created Use Case', () => {
    useCasePage.routes.list();
    useCasePage.editUseCase(useCaseName);
    cy.waitForNetworkIdle(1000);
    useCasePage.routes.list();
    cy.waitForNetworkIdle(1000);
  });

  it('Delete the created Use Case', () => {
    useCasePage.deleteUseCase(useCaseName);
  });
});
