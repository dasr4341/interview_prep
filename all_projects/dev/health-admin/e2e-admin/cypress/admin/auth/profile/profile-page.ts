export default class Profile {
  locators = {
    settingsLink: '[data-testid="settingsLink"]',
    loginEmail: '[data-testid="logged-in-email-id"]',
  };

  verifyEmail(email: string) {
    cy.get(this.locators.settingsLink).click();
    cy.get(this.locators.loginEmail).then((loginEmail) => {
      expect(loginEmail.text()).to.equal(email);
    });
  }
}
