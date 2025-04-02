/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "page/login";
import searchData from "components/search-input";
import clearData from "actions/clear-search-data";
import { selectNavLink } from 'components/nav';
import { faker } from "@faker-js/faker";
import specInit from "lib/spec.init";
import SuperAdmin from "page/super-admin";

describe('Search facility user flow check', () => {
  const loginPage = new login();
  const superAdminPage = new SuperAdmin();

  specInit();

  it('Go to the login page', () => {
    cy.visit('/login')
    cy.waitForNetworkIdle(2000);
    cy.get(loginPage.locators.signInButton).should('contain.text','Sign In');
  })

  it('Login with valid credential and verify as Super Admin logged in', () => {
    loginPage.superAdminLogin();
    cy.get(superAdminPage.locators.adminMenu).click()  
    cy.waitForNetworkIdle(3000);
    selectNavLink('Facility Management');
  })

 it('Search facility by existing facility name', () => {
  cy.get(superAdminPage.locators.facilityNameLink).its('length').then((facilityCount) => {
    cy.log('event count', facilityCount)
    const randomFacilityName = (Math.floor(Math.random()*facilityCount))
    const selectedFacility = cy.get(superAdminPage.locators.facilityNameLink).eq(randomFacilityName);
    selectedFacility.then(el => {
      const facilityName = el.text()
      cy.log(facilityName)
      searchData(facilityName);
      cy.waitForNetworkIdle(3000);
      cy.get(superAdminPage.locators.facilityName).find('a').each(($facilityName) => {
      let searchedFacillity = $facilityName.text();
      console.log(searchedFacillity);
      expect(searchedFacillity.toLowerCase()).to.contain(facilityName.toLowerCase());
    })
  })
 })
 })

 it('Search facility by invalid data', () => {
  clearData();
  cy.waitForNetworkIdle(2000);
  cy.get(superAdminPage.locators.facilityName);
  searchData(faker.lorem.words());
  cy.get(superAdminPage.locators.valueInStatusBar).should('contain.text','0');
  clearData();
  cy.get(superAdminPage.locators.facilityName);
})
})