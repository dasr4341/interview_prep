

/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "page/login";
import pageTitleAssert from "components/page-title";
import clearData from "actions/clear-search-data";
import { selectMenu } from 'components/nav';
import patientsList from "page/patients/patients-list";
import note from "page/notes/note-list";
import notesLinkFromDetails from "components/notes-link";
import specInit from "lib/spec.init";

describe("Notes search from patient's notes listing page", () => {
  const loginPage = new login();
  const patientsPage = new patientsList();
  const notesPage = new note();

  specInit();

  it('Facility user login', () => {
    cy.visit('/');
    loginPage.facilityUserLogin();
  })

  it('Go to the patients listing page', () => {
    selectMenu('Patients');
    pageTitleAssert('Patients');
  })

 it('Go to any patient details page', () => {
  cy.get(patientsPage.locators.patientName).its('length').then((patientsRow) => {
    const randomPatientName = (Math.floor(Math.random() * patientsRow))
    const selectedName = cy.get(patientsPage.locators.patientName).eq(randomPatientName);
    selectedName.then(el => {
      const patientName = el.text().split(' ').slice(0,1).join(' ');
      cy.log(patientName)
      cy.get(patientsPage.locators.patientName).eq(randomPatientName).click()
      pageTitleAssert(patientName)
    })
  })
  })

  it('Go to the notes listing page', () => {
      cy.waitForNetworkIdle(2000);
      notesLinkFromDetails();
      pageTitleAssert('My Notes');
  })
  
  it('Search with valid note title', () => {
    cy.get('body').then(($elm) => {
      if ($elm.has(notesPage.locators.notesRow).length) {
        notesPage.validNoteTitleSearch();
      } else {
        cy.contains('No notes yet');
      }
    })
 })

 it('Search with valid note details', () => {
  cy.get('body').then(($elm) => {
    if ($elm.has(notesPage.locators.notesRow).length) {
      clearData();
      cy.waitForNetworkIdle(2000);
      notesPage.validNoteDetailsSearch();
    } else {
      cy.contains('No notes yet');
    }
  })
})

it('Search with invalid data', () => {
  cy.get('body').then(($elm) => {
    if ($elm.has(notesPage.locators.notesRow).length) {
      clearData();
      cy.waitForNetworkIdle(2000)
      notesPage.invalidNoteSearch(); 
    } else {
      cy.contains('No notes yet');
    }
  })
})
})