const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    baseUrl: 'https://example.cypress.io',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
