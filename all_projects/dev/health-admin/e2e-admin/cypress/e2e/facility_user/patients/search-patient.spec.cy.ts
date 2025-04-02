/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "page/login";
import pageTitleAssert from "components/page-title";
import searchData from "components/search-input";
import noDataFoundTextAssert from "components/no-result-assert";
import clearData from "actions/clear-search-data";
import { selectMenu } from 'components/nav';
import { faker } from "@faker-js/faker";
import patientsList from "page/patients/patients-list";
import specInit from "lib/spec.init";

describe('Search patient from patients list', () => {
  const loginPage = new login();
  const patientsPage = new patientsList();

  specInit();

  it('Facility user login', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();
  })

  it('Go to the patients listing page', () => {
    selectMenu('Patients');
    pageTitleAssert('Patients');
  })

 it('Search patients by existing patient name >> patient should be listed in patient list', () => {
    cy.get(patientsPage.locators.patientName).first().then(($pname) => {
      const selectedName = $pname.text().split(' ').slice(0,1).join(' ');
      cy.log(selectedName);
      searchData(selectedName.toLowerCase());
        cy.waitForNetworkIdle(2000);
        cy.get(patientsPage.locators.patientRow).find('a').each(($searchedName) => {
          const patientName = $searchedName.text().split(' ').slice(0,1).join(' ');
          console.log(patientName);
          expect(patientName.toLowerCase()).to.equal(selectedName.toLowerCase());
        })
      })
  })

  it('Search patients by invalid patient name >> patient should not listed in patient list', () => {
    clearData();
    searchData(faker.lorem.words());
    noDataFoundTextAssert('No results', 'Refine your search and try again');
    clearData();
    cy.get(patientsPage.locators.patientName);
  })
})