/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import TemplatesPage from "../../../lib/pages/settings/templates-page";
import * as faker from 'faker';

describe('Create, edit, delete template flow check', () => {
  const login = new LoginPage();
  const templatesPage = new TemplatesPage();
  const settingsPage = new SettingsPage();
  const templateTitle = 'new template ' + faker.lorem.word();
  const templateSubject = 'new template subject' + faker.lorem.word();
  const templateText = 'new template text' + faker.lorem.word();
  const editTemplateTitle = 'edit template' + faker.lorem.word();
  const editTemplateSubject = 'edit template subject ' + faker.lorem.word(2);
  const editTemplateText = 'edit template text' + faker.lorem.word();

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

  it('Go to templates list', () => {
    templatesPage.openTemplateListPage();
    cy.url().should('include', '/templates/list');
    settingsPage.headerText().should('contain.text', 'Templates');
  });

  it('Create new template', () => {
    templatesPage.createNewBlueButton();
    settingsPage.headerText().should('contain.text', 'New email template');
    cy.waitForNetworkIdle(1000);

    templatesPage.templateTitleField().type(templateTitle);
    templatesPage.templateSubjectField().type(templateSubject);
    templatesPage.templateTextField().type(templateText);
    settingsPage.savesButton();
    cy.waitForNetworkIdle(1000);
    settingsPage.alert().should('contain.text', 'Template created');
  });

  it('Verify created template in the templates list', () => {
    cy.get('[href="/settings/templates/list"]').click();
    cy.url().should('include', '/templates/list');
    cy.waitForNetworkIdle(1000);
    templatesPage.firstTemplateTitle().should('contain.text', templateTitle);
  });

  it('Edit created template title', () => {
    settingsPage.editsButton();
    settingsPage.headerText().should('contain.text', 'Edit email template');
    cy.waitForNetworkIdle(1000);
    templatesPage.templateTitleField().clear().type(editTemplateTitle);
    templatesPage.templateSubjectField().clear().type(editTemplateSubject);
    templatesPage.templateTextField().clear().type(editTemplateText);
    settingsPage.savesButton();
    settingsPage.alert().should('contain.text', 'Template updated');
    cy.waitForNetworkIdle(1000);
  });

  it('Verify edited template title in the templates list', () => {
    cy.get('[href="/settings/templates/list"]').click();
    cy.waitForNetworkIdle(1000);
    templatesPage.firstTemplateTitle().should('contain.text', editTemplateTitle);
  });

  it('Delete  edited templates ', () => {
    cy.get('[href="/settings/templates/list"]').click();
    templatesPage.deleteTemplate();
    templatesPage.templatesTitle().should('not.contain.text', editTemplateTitle);
  });
});