/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";

describe("Login email and password fields validation", () => {
  const login = new LoginPage();

  it("Okta login flow check", () => {
    login.goToLoginPage();
    login.loginWithOktaEmail();
    login.checkOkta();
    login.loginWithSso();
    login.loginWithOktaEmailPassword();
    cy.url().should('include', '/events');
  });  
  
});