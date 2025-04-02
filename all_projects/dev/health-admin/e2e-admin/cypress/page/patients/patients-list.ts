/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

export default class Patients {
  locators = {
    patientsMenu: '[data-testid="Patients"]',
    patientName: '[data-testid="patient-row"] a',
    patientRow: '[data-testid="patient-row"]',
    eyeballButton: 'body [data-testid="patient-row"] button',
  }
}