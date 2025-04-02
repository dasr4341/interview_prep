import registerCypressGrep from '@cypress/grep/src/support'
registerCypressGrep();

afterEach(function onAfterEach() {
  if (this.currentTest.state === 'failed' ) {
    // eslint-disable-next-line no-undef
    cy.setCookie('shouldSkip', 'true' );
    //set cookie to skip tests for further specs
    // eslint-disable-next-line no-undef
    Cypress.runner.stop();
    //this will skip tests only for current spec
  }
});
