import LoginPage from '../../../lib/pages/login/login';
import RolesPage from '../../../lib/pages/roles/roles';
import EmailTemplatesPage from '../../../lib/pages/email-templates/email-templates';
import * as faker from 'faker';

describe('Email message templates page flow', () => {
  const login = new LoginPage();
  const rolesPage = new RolesPage();
  const emails = new EmailTemplatesPage();
  

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

  it(' disable  and enable VIEW  email message templates and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES', capabilities: ['VIEW'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="navLink-el"]').should('not.contain.text', 'Templates');
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/unauthorized');

    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(5000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
  });

  it(' disable and enable EDIT  Email Message Templates  and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES', capabilities: ['EDIT'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .should('not.contain.text', 'EDIT');

    cy.waitForNetworkIdle(1000);
    cy.visit('settings/templates/list/edit/sdf');
    cy.waitForNetworkIdle(1000)
    cy.url().should('contain', '/unauthorized');

    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .get('[data-test-id="options"]')
      .should('contain.text', 'Edit');
  });

  it('disable and enable CREATE  Email Message Templates  and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES', capabilities: ['CREATE'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="create-new"]').should('not.exist');

    cy.visit('/settings/templates/add');
    cy.waitForNetworkIdle(1000);
    cy.reload();
    cy.url().should('contain', '/unauthorized');


    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="create-new"]').should('exist');
  });

  it('disable and enable DELETE  Email Message Templates  and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES', capabilities: ['DELETE'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .should('not.contain.text', 'Delete');

    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .get('[data-test-id="options"]')
      .should('contain.text', 'Delete');
  });

  it('disable and enable  EXECUTE EMAIL MESSAGE TEMPLATES ASSIGN and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES_ASSIGN', capabilities: ['EXECUTE'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .should('not.contain.text', 'Assign');

    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .get('[data-test-id="options"]')
      .should('contain.text', 'Assign');
  });

  it('disable and enable  EXECUTE EMAIL MESSAGE TEMPLATES SHARE and verify UI', () => {
    rolesPage.getPrivileges({ excludePrivilege: 'EMAIL_MESSAGE_TEMPLATES_SHARE', capabilities: ['EXECUTE'] }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.waitForNetworkIdle(2000);
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .should('not.contain.text', 'Share');

    rolesPage.getPrivileges({ excludePrivilege: '' }).then((response: any) => rolesPage.updateRole(response));
    cy.reload();
    cy.waitForNetworkIdle(3000);
    cy.visit('/settings/templates/list');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-test-id="navLink-el"]').should('contain.text', 'Templates');
    cy.url().should('contain', '/settings/templates/list');
    emails
      .firstEmailRow()
      .then(($el) => $el.find('[data-test-id ="share-or-assign"]'))
      .click()
      .get('[data-test-id="options"]')
      .should('contain.text', 'Share');
  });
});
