/// <reference types="cypress" />

import { routes } from '../../components/page-routes';
import DefaultPage from '../default-page';

class SettingsPage extends DefaultPage {
  clickSettingsMenu() {
    cy.contains('Settings').click();
  }

  clickAdminMenu() {
    cy.contains('Admin').click();
  }

  clickUseCaseMenu() {
    cy.contains('Use Cases').click();
  }

  createNewCollection() {
    cy.get('[data-testId="create-use-case-button"]').click();
  }

  submitButton() {
    cy.contains('Submit').click();
  }

  saveButton() {
    cy.contains('Save').click();
  }

  cancelButton() {
    cy.contains('Cancel').click();
  }

  headerText() {
    return cy.get('body h1');
  }

  fieldName() {
    return cy.contains('form label');
  }

  fillFieldName(value) {
    cy.get('input').clear().type(value);
  }

  validationCheck() {
    return cy.get('[data-testid="error-id"]');
  }

  deleteButton() {
    cy.contains('Delete').click();
  }

  alert() {
    return cy.get('.Toastify .Toastify__toast--success');
  }

  editButton() {
    cy.contains('Edit').click();
  }

  savesButton() {
    cy.get('.bg-white > button[type="submit"]').click();
  }

  editsButton() {
    cy.get('[data-test-id="email_templates"] button').first().click();
    cy.contains('Edit').click();
  }

  backButton() {
    cy.get('[data-testid="page-back-button"]').click();
  }

  clickCompaniesMenu() {
    const link = `[href="${routes.companyGroup}"]`;
    cy.get(link).click();
  }

  clickRoleManagementMenu() {
    cy.contains('Role Management').click();
  }

  clickGroupsMenu() {
    cy.contains('Groups').click();
  }

  clickMyNOtesMenu() {
    cy.contains('My Notes').click();
  }
}

export default SettingsPage;
