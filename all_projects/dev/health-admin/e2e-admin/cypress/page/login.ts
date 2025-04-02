/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import logout from './logout';
import { map } from 'cypress/types/bluebird';

const logoutPage = new logout();

export default class login {
  locators = {
    signInButton: '[data-testid="submit-btn"]',
    emailInput: '[name="email"]',
    passwordInput: '[name="password"]',
    errorId: '[data-testid="error-id"]',
    emailError: '[data-testid="email-error"]',
    passwordError: '[data-testid="password-error"]',
  };
  userTypeAssertions = {
    patient: 'Events',
    facilityUser: 'Events',
    facilityAdmin: 'Assessment Templates',
    superAdmin: 'Facility Management',
    pretaaAdmin: 'Client Management',
  };

  withOutCredential() {
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.emailError).should(
      'contain.text',
      'This field is required'
    );
    cy.get(this.locators.passwordError).should(
      'contain.text',
      'This field is required'
    );
  }

  wrongEmailCredential(password: any) {
    cy.get(this.locators.emailInput).click().type(faker.internet.email());
    cy.get(this.locators.passwordInput).click().type(password);
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.errorId).should(
      'contain.text',
      'Invalid email or password'
    );
    cy.get(this.locators.emailInput).clear().click().type(faker.lorem.word());
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.emailError).should(
      'contain.text',
      'email must be a valid email'
    );
  }

  wrongPasswordCredential(email: any) {
    cy.get(this.locators.emailInput).clear().click().type(email);
    cy.get(this.locators.passwordInput)
      .clear()
      .click()
      .type(faker.internet.password());
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.errorId).should(
      'contain.text',
      'Invalid email or password'
    );
  }

  login() {
    cy.visit('/login');
    this.useValidCredential('patient');
  }

  visitTheLoginPage(url: string) {
    cy.visit(url);
    cy.waitForNetworkIdle(2000);
    cy.get(this.locators.signInButton).should('contain.text', 'Sign In');
  }

  useValidCredential(userType: string) {
    const email = Cypress.env(userType).email;
    const password = Cypress.env(userType).password;
    cy.get(this.locators.emailInput).clear().click().type(email);
    cy.get(this.locators.passwordInput).clear().click().type(password);
    cy.get(this.locators.signInButton).click();
    cy.waitForNetworkIdle(10000);
    for (const assertUserType in this.userTypeAssertions) {
      if (userType === assertUserType) {
        cy.get('h1').should(
          'contain.text',
          this.userTypeAssertions[assertUserType]
        );
      }
    }
  }

  facilityUserLogin() {
    const credentials = Cypress.env('facility_user_name_with_password').split(
      ':'
    );
    cy.get(this.locators.emailInput).clear().click().type(credentials[0]);
    cy.get(this.locators.passwordInput).clear().click().type(credentials[1]);
    cy.get(this.locators.signInButton).click();
    cy.waitForNetworkIdle(5000);
  }

  loginWithSpacesInFields() {
    cy.get(this.locators.emailInput).clear().click().type('      ');
    cy.get(this.locators.passwordInput).clear().click().type('         ');
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.emailError).should(
      'contain.text',
      'This field is required'
    );
    cy.get(this.locators.passwordError).should(
      'contain.text',
      'This field is required'
    );
  }

  pretaaAdminLogin() {
    const credentials = Cypress.env('pretaa_admin_with_password').split(':');
    cy.get(this.locators.emailInput).clear().click().type(credentials[0]);
    cy.get(this.locators.passwordInput).clear().click().type(credentials[1]);
    cy.get(this.locators.signInButton).click();
    cy.waitForNetworkIdle(5000);
  }

  invalidCredentials() {
    cy.get(this.locators.emailInput)
      .clear()
      .click()
      .type(faker.internet.email());
    cy.get(this.locators.passwordInput)
      .clear()
      .click()
      .type(faker.internet.password());
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.errorId).should(
      'contain.text',
      'Invalid email or password'
    );
  }

  onlyEmailCredential(email: any) {
    cy.get(this.locators.emailInput).clear().type(email[0]);
    cy.waitForNetworkIdle(2000);
    cy.get(this.locators.passwordInput).clear();
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.passwordError).should(
      'contain.text',
      'password is a required field'
    );
  }

  onlyPasswordCredential(password: any) {
    cy.get(this.locators.passwordInput).click().type(password[1]);
    cy.get(this.locators.emailInput).clear();
    cy.get(this.locators.signInButton).click();
    cy.get(this.locators.passwordError).should(
      'contain.text',
      'email is a required field'
    );
  }

  superAdminLogin() {
    const credentials = Cypress.env('super_admin_with_password').split(':');
    cy.get(this.locators.emailInput).clear().click().type(credentials[0]);
    cy.get(this.locators.passwordInput).clear().click().type(credentials[1]);
    cy.get(this.locators.signInButton).click();
    cy.waitForNetworkIdle(5000);
  }
}
