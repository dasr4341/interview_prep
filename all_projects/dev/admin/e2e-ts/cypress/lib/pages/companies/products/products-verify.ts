class verifyProduct {

  companyProduct() {
    return cy.get('[data-test-id="Products-link"]');
  }

  productName() {
    return cy.get('[data-test-id="products"]');
  }

  productNameInDetailPage(){
    return cy.get('[data-testid="content-frame"] h2');
  }

  checkProductExist() {
    cy.get('[data-test-id="products"]').then(el => el.length).as('productCount');
  }
}
export default verifyProduct;