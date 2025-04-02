/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";

describe("Login email and password fields validation", () => {
  it("Email field validation client side", () => {
    const login = new LoginPage();
    login.goToLoginPage();
    login.checkOkta();
    cy.get('[data-testid="email-error"]').should(
      "contain.text",
      "email is a required field"
    );
  });

  it("Wrong email sent to server: and expect a error from server", () => {
    const login = new LoginPage();
    login.fillWithInvalidEmail();
    cy.get('[data-testid="server-side-login-error"]').should(
      "contain.text",
      "No valid user was found"
    );
  });

  it("Valid Email and invalid password check >> server side error", () => {
    const login = new LoginPage();
    login.submitWrongPassword();
    cy.get('[data-testid="server-side-login-error"]').should(
      "contain.text",
      "Invalid email or password."
    );
  });
});
