/// <reference types="cypress" />

import * as faker from 'faker';
import GroupsPage from '../../../lib/pages/groups/groups-page';
import LoginPage from '../../../lib/pages/login/login';

describe('Create edit delete of a group', () => {
  const loginPage = new LoginPage();
  const groupsPage = new GroupsPage();
  const groupName: string = 'CY- ' + faker.lorem.words();

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
    loginPage.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Go to groups page from settings', () => {
    cy.visit('/settings/admin/user-groups');
    cy.waitForNetworkIdle(3000);
  });

  it('Go to new user group page', () => {
    cy.contains('Create User Group').click();
    cy.url().should('include', '/settings/admin/user-groups/create');
    cy.waitForNetworkIdle(2000);
  });

  it('Create new user group', () => {
    // Todo: API taking long time 
    // groupsPage.addUser();
    groupsPage.typeGroupName(groupName);
    groupsPage.addDataObjects();
    groupsPage.addUseCase();
    cy.contains('Save').click();
    cy.waitForNetworkIdle(2000);
    groupsPage.toast.selectors.success().should('contain.text', 'This user group is successfully created');
  });

  it('Edit new created user group', () => {
    groupsPage.editUserGroup(groupName);
  });

  it('Delete created user group', () => {
    groupsPage.deleteUserGroup();
    cy.get('[test-data-id="group_list"]').should('not.contain.text', groupName);
  });
});
