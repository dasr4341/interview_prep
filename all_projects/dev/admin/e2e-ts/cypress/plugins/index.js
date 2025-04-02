/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars


const emailClient = require('./email-client');

module.exports = (on, config) => {

  // This is for rettrive OTP with Imap protocol 
  // Usage 
  //  cy.task("getOtp", { email: 'pretaae2e@gmail.com', email_credential: Cypress.env("automation_email_password") }, { timeout: 30000 });

  on('task', {
    getOtp(options) {
      return emailClient.getOtp(options)
    }
  });

  return config;
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  
}
