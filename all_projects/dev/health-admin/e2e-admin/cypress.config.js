const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  chromeWebSecurity: false,
  experimentalFetchPolyfill: true,
  // experimentalMemoryManagement: true,
  numTestsKeptInMemory: 1,
  video: false,
  "env": {
    "grepFilterSpecs": true,
    "grepOmitFiltered": true
  },
  e2e: {
    specPattern: 'cypress/admin/**/*.cy.ts',
    setupNodeEvents(on, config) {
      require("cypress-localstorage-commands/plugin")(on, config);
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
    baseUrl: process.env.baseURL || 'http://localhost:3000',
  },
  
});
