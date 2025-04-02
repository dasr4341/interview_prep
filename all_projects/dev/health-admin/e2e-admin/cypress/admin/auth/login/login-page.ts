


export default class Login {
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

  visitTheLoginPage(url: string) {
    cy.visit(url);
    cy.waitForNetworkIdle(2000);
    cy.get(this.locators.signInButton).should('contain.text', 'Sign In');
  }

  useValidCredential(userType: string) {
    cy.location().then($ => {
      return $.href.includes('session-expired');
    }).then(isSessionExpired => {
      if (isSessionExpired) {
        cy.get('.link').click();
      }
    })

    const email = Cypress.env(userType).email;
    const password = Cypress.env(userType).password;
    cy.get(this.locators.emailInput).clear().click().type(email);
    cy.get(this.locators.passwordInput).clear().click().type(password);
    cy.get(this.locators.signInButton).click();
    cy.waitForNetworkIdle(2000);
    for (const assertUserType in this.userTypeAssertions) {
      if (userType === assertUserType) {
        cy.get('h1').should(
          'contain.text',
          this.userTypeAssertions[assertUserType]
        );
      }
    }
  }
}