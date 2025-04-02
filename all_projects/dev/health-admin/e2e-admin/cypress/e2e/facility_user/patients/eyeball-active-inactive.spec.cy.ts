/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
/// <reference types="cypress-localstorage-commands" />

import login from "page/login";
import pageTitleAssert from "components/page-title";
import { selectMenu } from 'components/nav';
import patientsList from "page/patients/patients-list";
import specInit from "lib/spec.init";
import alertMessage from "components/toast-msg";

describe('Eyeball status flow check from patients list', () => {
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

it('Eyeball active/inactive check', () => {
  cy.wait(5)
  cy.get(patientsPage.locators.eyeballButton).first().then(el => {
    if (el.attr('data-testid') == 'open') {
      cy.get(patientsPage.locators.eyeballButton).first().click();
      alertMessage('Eyeball Not Highlighted');
      cy.get(patientsPage.locators.eyeballButton).first().click();
      alertMessage('Eyeball Highlighted');
    } else if(el.attr('data-testid') == 'close'){
      cy.get(patientsPage.locators.eyeballButton).first().click();
      alertMessage('Eyeball Highlighted');
      cy.get(patientsPage.locators.eyeballButton).first().click();
      alertMessage('Eyeball Not Highlighted');
    }
  });
})
})