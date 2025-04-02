/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
import { isNumber } from 'lodash';
import _ = require('lodash');
import CompanyDetailsPage from '../companies/company-details-page';
import CompanyListPage from '../companies/company-page';
import EventsPage from '../events/events-page';

class UserRole {
  events: EventsPage;
  companies: CompanyListPage;
  opportunity: CompanyDetailsPage;
  index: number;

  constructor() {
    this.events = new EventsPage();
    this.companies = new CompanyListPage();
    this.opportunity = new CompanyDetailsPage();
    this.index = _.random(0,9);
  }

  getPrivilegesList({ token }) {
    return new Promise((resolve, reject) => {
      const myHeaders = new Headers();

      myHeaders.append(
        'Authorization',
        `Bearer ${token}`
      );
      myHeaders.append('Content-Type', 'application/json');

      const graphql = JSON.stringify({
        query: 'query GetPermissions {\n  pretaaGetPermissions\n}',
        variables: {},
      });
      const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      fetch(Cypress.env('API_URL'), requestOptions)
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    })
  }

  getPrivileges({ excludePrivilege, capabilities }: { excludePrivilege?: string, capabilities?: Array<string> }): Promise<{ capabilities: any, roleId: string; token: string }> {
    return new Cypress.Promise((resolve, reject) => {
      cy.getLocalStorage('token').then((token) => {
        cy.getLocalStorage('user_store').then(async (user: any) => {
          if (user) {
            user = JSON.parse(user);
            console.log('cy user', { user });
            const privilegesData: any = await this.getPrivilegesList({ token });
            console.log('cy privilegesData', { privilegesData });
            let caps = [];

            let privileges = privilegesData.data.pretaaGetPermissions.filter((p) => p.name !== excludePrivilege);

            if (capabilities && capabilities.length) {
               caps = [];
                const privilege = privilegesData.data.pretaaGetPermissions.find((p) => p.name === excludePrivilege);
                Object.keys(privilege.capabilities).forEach((k) => {
                  if (isNumber(privilege.capabilities[k]) && !capabilities.includes(k)) {
                    caps.push(String(privilege.capabilities[k]));
                  }
                });

            }
            
            console.log('filtered Privileges', { privileges });
            let privilegeIds = privileges
            .map((p) => {
              const ids = [];
              Object.keys(p.capabilities).forEach((k) => {
                if (isNumber(p.capabilities[k])) {
                  ids.push(p.capabilities[k]);
                }
              });
              return ids;
            })
            .join().split(',')

            if (capabilities && capabilities.length) {
              privilegeIds = privilegeIds.concat(caps)
            }

            resolve({
              capabilities: privilegeIds,
              token,
              roleId: user.currentUser.roles[0].roleId,
            });
          } else {
            reject('User not found');
          }
        });
      });
    });
  }
  updateRole({ roleId, capabilities, token }) {
    console.log('cy', { roleId, capabilities: _.sortBy(capabilities), token });

    return new Cypress.Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);
      myHeaders.append('Content-Type', 'application/json');

      const graphql = JSON.stringify({
        query:
          ' mutation UpdateRole(\n    $capabilities: [String!]!\n    $name: String!\n    $id: String!\n  ) {\n    pretaaUpdateRole(\n      capabilities: $capabilities\n      name: $name\n      id: $id\n    )\n  }',
        variables: { id: `${roleId}`, capabilities: capabilities.filter((p) => p.length > 0), name: "Prosenjit's Role" },
      });
      const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      fetch(Cypress.env('API_URL'), requestOptions)
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  navLinkEl() {
    return cy.get('[data-test-id="navLink-el"]');
  }

  opportunityNoteCheck() {
    this.opportunity.opportunityLink().click();
    cy.waitForNetworkIdle(3000);
    this.opportunity.opportunityName().click();
    cy.waitForNetworkIdle(3000);
    cy.get('[data-test-id="floating-btn"]').click();
  }

  getEventId() {
    const singleEvent = this.events.selectors.events().eq(this.index);
    singleEvent.then(el => {
      const url = el.attr('data-link-id');
      cy.visit(`/events/${url}`);
    });
    cy.waitForNetworkIdle(3000);
  }

  getCompanyId() {
    cy.get('[data-test-id="company-row"]').eq(this.index).then(companyName => {
      const url = companyName.find('[data-test-id="company-list-link"]').attr('href');
      cy.visit(url);
    });
    cy.waitForNetworkIdle(3000);
  }
}
export default UserRole;
