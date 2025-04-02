/// <reference types="cypress" />

import LoginPage from "../../../lib/pages/login/login";
import notification from "../../../lib/pages/settings/preference/notification"
import { routes } from "../../../lib/routes";

describe('Notification section flow', () => {
  const login = new LoginPage();
  const notificationPage = new notification();
  
  before(() => {
    cy.clearLocalStorageSnapshot()
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Login', () => {
    login.loginWithPassword();
  });

  it('Go To Notification under Preference section check-out toggle',()=>{
    cy.visit(routes.settingsNotifications.match);
    notificationPage.defaultPage.selectors.pageTitle();
    cy.contains('Summary Notification');
  })

  it('Deactivate notification and should be hide all fields',() => {
    notificationPage.toggleNotificationSettings();
    notificationPage.selectors.scheduleTimeRow().should('not.exist');
  
  })
  it('Enable notification',()=>{
    notificationPage.toggleNotificationsEnable();
  })
  it('Add schedule list',() =>{
    cy.waitForNetworkIdle(4000);
    notificationPage.addSchedule();
   })

   it('Delete schedule items and check existence of schedule',()=>{
    notificationPage.deleteScheduleItem();
    notificationPage.selectors.scheduleTimeRow().should('exist');


   })

  it('Enable notification and should be hide all fields',() => {
    notificationPage.selectors.scheduleTimeRow().should('exist');
  })

 

});