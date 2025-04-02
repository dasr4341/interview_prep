/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
/// <reference types="cypress-network-idle" />

class LoginPage {
  logout() {
    const logoutLink = cy.get('[data-test-id="logout"]');
    logoutLink.click();
  }
  
  goToSuperAdminLoginPage() {
    cy.visit("/super-admin/login");
  }

  goToLoginPage() {
    cy.visit("/login");
  }

  fillEmail(value: string) {
    cy.get('[data-testid="email"]')
      .clear()
      .type(value);
  }

  fillOktaEmail(value: string) {
    cy.get('input#okta-signin-username')
      .clear()
      .type(value);
  }

  fillOktaPassword(value: string) {
    cy.get('input#okta-signin-password')
      .clear()
      .type(value);
  }

  fillChangePassword() {
    cy.get('input[name="currentPassword"]')
      .clear()
      .type('Password$22');

    cy.get('input[name="password"]')
      .clear()
      .type('Password$222');

    cy.get('input[name="passwordConfirmation"]')
      .clear()
      .type('Password$222');

    cy.contains('Save').click();
  }


  checkOkta() {
    cy.get('[data-testid="continue-btn"]')
      .click();
  }

  loginWithSso() {
    cy.get('[data-testid ="submit-btn"]').click();
  }


  fillPassword(value: string) {
    cy.get('[data-testid="password"]')
      .clear()
      .type(value);
  }

  login() {
    cy.get('[data-testid="submit-btn"]')
      .click();
  }

  signIn() {
    cy.get('input[type="submit"]')
      .click();
  }

  loginWithPassword() {
    cy.setLocalStorage('API_URL', Cypress.env("API_URL"));
    const loginDetails = Cypress.env("user_name_with_password").split(":");
    this.goToLoginPage();
    this.fillEmail(loginDetails[0]);
    this.checkOkta();
    this.fillPassword(loginDetails[1]);
    this.login();
    cy.waitForNetworkIdle(3000);
  }

  loginWithOktaEmail() {
    const loginDetails = Cypress.env("user_name_with_password_for_okta").split(":");
    this.goToLoginPage();
    this.fillEmail(loginDetails[0]);

  }

  loginWithOktaEmailPassword() {
    const loginDetailsOkta = Cypress.env("user_name_with_password_for_okta").split(":");
    this.fillOktaEmail(loginDetailsOkta[0]);
    this.fillOktaPassword(loginDetailsOkta[1]);
    this.signIn();

  }

  fillWithInvalidEmail() {
    this.goToLoginPage();
    this.fillEmail('test@user.com');
    this.checkOkta();
  }

  submitWrongPassword() {
    const loginDetails = Cypress.env("user_name_with_password").split(":");
    this.goToLoginPage();
    this.fillEmail(loginDetails[0]);
    this.checkOkta();
    this.fillPassword('passwords');
    this.login();
  }

  superAdminLogin() {
    cy.setLocalStorage('API_URL', Cypress.env("API_URL"));
    const loginDetails = Cypress.env("user_name_with_password_super_admin").split(":");
    this.goToSuperAdminLoginPage();
    this.fillEmail(loginDetails[0]);
    this.fillPassword(loginDetails[1]);
    this.login();
    cy.waitForNetworkIdle(3000);
  }

}

export default LoginPage;
