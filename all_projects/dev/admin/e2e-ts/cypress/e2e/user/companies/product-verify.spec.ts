/// <reference types="cypress" />

import LoginPage from '../../../lib/pages/login/login';
import CompanyPage from "../../../lib/pages/companies/company-page";
import verifyProduct from "../../../lib/pages/companies/products/products-verify";

describe('Product listing page and detail page verification from company', () => {
  const loginPage = new LoginPage();
  const companies = new CompanyPage();
  const product = new verifyProduct();

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
    loginPage.loginWithPassword();
    cy.url().should('include', '/events');
  });

  it('Go to Company listing page', () => {
    companies.companiesMenu();
    cy.waitForNetworkIdle(3000);
    companies.pageHeader().should('contain.text', 'Companies');
  });

  it('Go to first company detail page', () => {
    companies.firstCompanyName()
      .then(($el) => {
        const companyName = $el.text();
        cy.log(companyName);
        companies.firstCompanyName().click();
        companies.companyNameInDetailPage().should('contain.text', companyName);
      });
  });

  it('Go to products list and verify products exist', () => {
    product.companyProduct().click();
    cy.waitForNetworkIdle(3000);
    companies.pageTitle().should('contain.text', 'Products');
    product.checkProductExist();
    cy.get('@productCount').should('be.at.least', 1);
  });

  it('Go to first product details page and verify', () => {
    product.productName().first()
      .then(($el) => {
        const productName = $el.text();
        cy.log(productName);
        product.productName().first().click();
        cy.waitForNetworkIdle(3000);
        companies.pageTitle().should('contain.text', 'Product Details');
        product.productNameInDetailPage().first().should('contain.text', productName);
      });
  });
});