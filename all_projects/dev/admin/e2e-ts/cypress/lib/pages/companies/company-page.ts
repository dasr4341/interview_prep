class CompanyListPage {
  companiesMenu() {
    cy.contains('Companies').click();
  }

  companiesListExist() {
    cy.get('[data-test-id="company-row"]').then(els => els.length).as('companyCount');
   }

  firstCompany() {
    return cy.get('[data-test-id="company-row"]').first();
  }

  firstCompanyName() {
    return cy.get('[data-test-id="company-list-link"]').first();
  }

  getTitle(){
    cy.get('[data-test-id="Products-link"]').as('productTitle');
  }

  verifyProductTitle({ product }) {
    cy.get('[data-test-id="page-title"]')
      .then(($productTitle) => {
        const companyProducts = $productTitle.text().trim();
        const cleanString = companyProducts.trim()
        console.log({ cleanString, product });
        expect(cleanString).to.equal(product);
      });
  }
  searchField() {
    return cy.get('body input');
  }

  fillSearchField(value) {
    cy.get('body input')
      .clear()
      .type(value);
  }
  pageHeader() {
    return cy.get('body');
  }

  noDataFoundText() {
    return cy.get('body h1');
  }

  alert() {
    return cy.get('.Toastify .Toastify__toast--success');
  }

  companyName() {
    cy.get('[data-test-id="company_header"]').then(el => el.length).as('companyCount');
  }

  companyNameInDetailPage() {
    return cy.get('[data-test-id="company-list-link"]');
  }

  addCommentField() {
    return cy.get('[data-testid="content-frame"] textarea');
  }

  pageTitle() {
    return cy.get('[data-test-id="page-title"]');
  }

  id() {
    return cy.get('[data-test-id={company?.id}]');
  }

}

export default CompanyListPage;
