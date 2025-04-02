class CompanyFilter {
  filterIcon() {
      cy.get('[data-test-id="company-filter"]').click();
    }

  starredOptionCheck(){
      return cy.contains('STARRED').click();
  }

  filterButton(){
      return cy.get('[type="submit"]').click();
  }

  starredCompanyList(){
      return cy.get('[data-test-id="company_header"] button svg');
  }

  filteredCompanyName() {
      return cy.get('[data-test-id="company-list-link"]').first();
    }

  clearLink(){
      return cy.contains('Clear All').click();
  }
  
  starIcon(){
      return cy.get('[data-test-id="company_header"]:nth-child(1) button svg');
  }

  filteredCompanyListExist() {
      return new Cypress.Promise((res) => {
        cy.get('body').then(($elm) => {
          res($elm.has('[data-test-id="company-list-link"]').length);
        });
      });
    }

  filterClickForStarredOption(){
    this.filterIcon();
    cy.wait(1000);
    this.starredOptionCheck();
    cy.wait(1000);
    this.filterButton();
  }

  starredCompanyDetailCheck(companyName: string) {
    this.filteredCompanyName().click();
    cy.get('body h1').should('contain.text', 'Details');
    cy.waitForNetworkIdle(2000);
    cy.get('[data-testid="content-frame"] button svg').should('have.class', 'w-5 h-5 text-yellow');
    cy.waitForNetworkIdle(2000)
    cy.get('[data-test-id="company-list-link"]').should('contain.text', companyName);
  }

}

export default CompanyFilter;

