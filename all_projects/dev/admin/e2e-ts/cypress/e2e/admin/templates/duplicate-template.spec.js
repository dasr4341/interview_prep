/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import TemplatesPage from "../../../lib/pages/settings/templates-page";

describe('Duplicate template flow check', () => {
  const login = new LoginPage();
  const templatesPage = new TemplatesPage();
  const settingsPage = new SettingsPage();
  let templateName;

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

  it('Duplicate the first email template from templates list', () => {
    templatesPage.openTemplateListPage();
    cy.url().should('include', '/templates/list');
    settingsPage.headerText().should('contain.text', 'Templates');
    templatesPage.templatesListExist();
    cy.get('@templateLength').then(templateLength => {
      if (templateLength) {
        templatesPage.firstTemplateTitle().then(el => el.text()).as('templateTitle');
      } else {
        cy.log('no template found');
      }
    })

    cy.get('@templateTitle').then((title) => {
      templateName = 'Copy of ' + title;
      cy.log('templateName', templateName);
      templatesPage.firstTemplateExposeMenu();
      templatesPage.duplicateOption();
      settingsPage.alert().should('contain.text', 'Duplicate template created');
      templatesPage.templatesTitle().should('contain.text', templateName);
    })
  });

  it('Delete duplicated template', () => {
    templatesPage.templatesListExist();
    cy.get('@templateLength').then(() => {
      templatesPage.deleteTemplate();
    })
  });
});
