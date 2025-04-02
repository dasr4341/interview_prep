/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import SettingsPage from "../../../lib/pages/settings/settings-page";
import * as faker from 'faker';
import RoleManagementPage from "../../../lib/pages/settings/role-management-page";

describe('Role Management flow', () => {
  const login = new LoginPage();
  const settingsPage = new SettingsPage();
  const roleManagementPage = new RoleManagementPage();
  const roleName = 'New role ' + faker.lorem.word();
  const editRole = 'edited role ' + faker.lorem.word();

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

  it('Go to Role Management page', () => {
    settingsPage.clickSettingsMenu();
    settingsPage.clickAdminMenu();
    settingsPage.clickRoleManagementMenu();
    cy.url().should('include', '/roles');
    settingsPage.headerText().should('contain.text', 'Role Management');
  });

  it('Validation check for role name field', () => {
    roleManagementPage.addRoleButton();
    settingsPage.headerText().should('contain.text', 'New Role');
    cy.url().should('include', '/settings/admin/roles/create');
    roleManagementPage.newRoleNameHeader().should('contain.text', 'New role name');
    roleManagementPage.privilegesHeader().should('contain.text', 'Privileges');
    settingsPage.saveButton();
    roleManagementPage.errorMsgForInvalidRole().should('contain.text', 'This field is required');
  });

  it('Create a Custom Role', () => {
    roleManagementPage.fillFieldName().type(roleName);
    roleManagementPage.privilegeOptions();
    settingsPage.saveButton();
    roleManagementPage.toast.selectors.success().should('contain.text', 'Role created');
  });

  it('Cancel to edit the created Role', () => {
    roleManagementPage.cancelToEditRole(roleName);
  });

  it('Edit the created Role', () => {
    roleManagementPage.editCustomRole(roleName);
    roleManagementPage.fillFieldName().clear().type(editRole);
    roleManagementPage.privilegeOptions();
    roleManagementPage.saveButton();
    roleManagementPage.toast.selectors.success().should('contain.text', 'Role updated');
  });

  it('verify cancel functionality to delete role and delete the created Role', () => {
    settingsPage.clickRoleManagementMenu();
    roleManagementPage.deleteCustomRole(editRole);
  });
});
