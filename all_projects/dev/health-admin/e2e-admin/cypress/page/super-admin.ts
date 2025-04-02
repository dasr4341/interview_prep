/// <reference types="cypress" />

export default class SuperAdmin {
  locators ={
    adminMenu: '[data-testid="admin-link"]',
    facilityNameLink: '[col-id="facilitiesName"] a',
    facilityName: '[col-id="facilitiesName"]',
    valueInStatusBar: '[data-testid="content-frame"] [ref="eStatusBarLeft"] [ref="eValue"]'
  }
}
