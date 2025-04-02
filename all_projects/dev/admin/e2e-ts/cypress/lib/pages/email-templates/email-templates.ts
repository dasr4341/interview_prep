
import * as _ from 'lodash';

class EmailTemplatesPage{

  firstEmailRow(){
   return cy.get('[data-test-id="email_templates"]').first();
  }
  
}

export default EmailTemplatesPage;