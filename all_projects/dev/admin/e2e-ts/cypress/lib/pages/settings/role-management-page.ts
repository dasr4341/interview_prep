/// <reference types="cypress" />

import _ = require("lodash");
import DefaultPage from "../default-page";

class RoleManagementPage extends DefaultPage {

  addRoleButton() {
    cy.contains('Add').click();
  }

  cancelButton() {
    cy.contains('Cancel').click();
  }

  editButton() {
    cy.contains('Edit').click();
  }

  deleteButton() {
    cy.contains('Delete').click();
  }

  saveButton() {
    cy.contains('Save').click();
  }

  newRoleNameHeader() {
    return cy.get('[data-testid="content-frame"] h2:nth-child(1)');
  }

  privilegesHeader() {
    return cy.get('[data-testid="content-frame"] h2:nth-child(2)');
  }

  fillFieldName() {
    return cy.get('[data-testid="content-frame"] [data-testid="roleName"]');
  }

  roleNameList() {
    return cy.get('[test-data-id="role_data_row"]');
  }

  errorMsgForInvalidRole() {
    return cy.get('[data-testid="roleName-error"]');
  }

  privilegeOptions() {
    const index = _.random(0,5);
    cy.get('[data-testid="option"]').find('input').eq(index).click();
  }

  checkingRoleName(role_name: string) {
    this.roleNameList().then(($el) => {
      let index: number;
      $el.each((i, elm) => {
        if (elm.querySelector('[data-test-id="role-name"]')?.innerHTML === role_name) {
          index = i + 2;
          cy.log(index.toString())
          cy.get(`[test-data-id="role_data_row"]:nth-child(${index + 1}) svg`).click();
        }
      });
    }).as('roleName');
  }

  clickOnPopover(role_name: string) {
    this.checkingRoleName(role_name);
    cy.get('@roleName').then(el => {
      if (el) {
        cy.get('[data-test-id="edit-btn"]').click();
        cy.wait(3000);
      }
    })
  }

  randomOptionClick() {
    cy.get('[data-testid="option"]')
    .then(($elm) => {
      let rolePrivileges = $elm.find('input').get().length;
      cy.wrap($elm).get('input')
        .eq(Math.floor(Math.random() * rolePrivileges))
        .click();
    });
  }

  editCustomRole(role_name: string) {
    cy.waitForNetworkIdle(3000);
    cy.log('Role name ', role_name);
    this.clickOnPopover(role_name);
  }

  cancelToEditRole(roleName: string) {
    cy.wait(5000);
    cy.log('Role name ', roleName);
    this.clickOnPopover(roleName);
    this.randomOptionClick();
    this.cancelButton();
  }

  clickOnDelete(CustomerRoleName: string) {
    this.checkingRoleName(CustomerRoleName);
    cy.get('@roleName').then(el => {
      if (el) {
        cy.get('[data-test-id="delete-btn"]').click();
        cy.get('[data-popup="modal"] .modal').should('contain.text', 'Did you want to delete this role?');
      }
    })
  }

  deleteCustomRole(CustomerRoleName: string) {
    cy.waitForNetworkIdle(3000);
    cy.log('Role Name: ', CustomerRoleName);
    this.clickOnDelete(CustomerRoleName);
    this.cancelButton();
    this.clickOnDelete(CustomerRoleName);
    this.deleteButton();
    this.toast.selectors.success().should('contain.text', 'Role deleted successfully');
  }
}

export default RoleManagementPage;
