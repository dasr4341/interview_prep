/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />
import login from 'auth/login/login-page';
import logout from 'auth/logout/logout-page';
import MenuLinksVisibility from './menu-visiblity-checks';

describe('Menu options visibility based on privilages @happy-path', () => {
  const loginPage = new login();
  const logoutPage = new logout();
  const menuVisibility = new MenuLinksVisibility();

  const userTypeArray = [
    'supporter',
    'patient',
    'facilityUser',
    'facilityAdmin',
    'superAdmin',
    'pretaaAdmin',
  ];

  userTypeArray.forEach((userType) => {
    it(`Check privileges for user type : ${userType}`, () => {
      loginPage.visitTheLoginPage(
        userType === 'pretaaAdmin' ? '/pretaa-admin/login' : '/login'
      );
      // Get credentials based on env key name.
      // type mapped as key name in cypress.env.json
      loginPage.useValidCredential(userType);

      cy.get(menuVisibility.locators.menuLinks).then(($) => {
        for (const link in menuVisibility.menuLinks[userType]) {
          if (menuVisibility.menuLinks[userType][link] !== '') {
            cy.wrap($).contains(link).click();
            // Use with recursion function 
            for (const nestedLink in menuVisibility.menuLinks[userType][link]) {
              cy.wrap($).should(
                'contain.text',
                menuVisibility.menuLinks[userType][link][nestedLink]
              );
            }
          } else {
            cy.wrap($).should('contain.text', link);
          }
        }
      })

      logoutPage.logout();
    });

  });

});
