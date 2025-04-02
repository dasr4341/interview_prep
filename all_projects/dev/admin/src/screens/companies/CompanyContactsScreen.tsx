import { ContactRow } from 'components/ContactRow';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useParams } from 'react-router-dom';
import {
  GetContacts,
  GetContactsVariables,
  OrderType,
  GetOpportunityContacts,
  GetCompany,
  GetCompanyVariables,
  GetOpportunityHeader,
  GetOpportunityHeaderVariables,
} from 'generatedTypes';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GetContactsQuery } from 'lib/query/contacts/get-contacts';
import { GET_OPPORTUNITY_CONTACTS_QUERY } from 'lib/query/opportunity/get-opportunity-contacts';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useEffect } from 'react';
import { GetCompanyQuery } from '../../lib/query/company/get-company';
import useQueryParams from '../../lib/use-queryparams';
import _, { range } from 'lodash';
import { GetOpportunityHeaderQuery } from 'lib/query/opportunity/get-opportunity-header';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function CompanyContactsScreen(): JSX.Element {
  const { id } = useParams() as any;
  const query = useQueryParams();

  const [getContacts, { data: contactList, loading: contactLoading, error: contactError }] = useLazyQuery<GetContacts, GetContactsVariables>(GetContactsQuery);

  const [getOpportunityContacts, { data: opportunityContactList, loading: opportunityContactLoading, error: opportunityContactError }] =
    useLazyQuery<GetOpportunityContacts>(GET_OPPORTUNITY_CONTACTS_QUERY);

  const { data: companyDetail } = useQuery<GetCompany, GetCompanyVariables>(GetCompanyQuery, {
    variables: {
      companyId: String(id),
    },
  });
  const [getOpportunityDetail, { data: opportunityDetail }] = useLazyQuery<GetOpportunityHeader, GetOpportunityHeaderVariables>(GetOpportunityHeaderQuery);

  const contacts =
    contactList?.pretaaFindManyContacts ||
    _.cloneDeep(opportunityContactList?.pretaaGetOpprtunityContacts)?.map((el) => {
      return {
        ...el,
        primary: el.opportunityContact[0].isPrimary,
      };
    });
  const loading = contactLoading || opportunityContactLoading;
  const error = contactError || opportunityContactError;

  useEffect(() => {
    if (query?.opportunityId) {
      getOpportunityContacts({
        variables: {
          opportunityId: query?.opportunityId,
        },
      });
      getOpportunityDetail({
        variables: {
          opportunityId: query?.opportunityId,
        },
      });
    } else {
      getContacts({
        variables: {
          orderBy: OrderType.ASC,
          companyId: String(id),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, query?.opportunityId]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyContacts.name,
    });
  }, []);

  const contactRows = contacts && contacts.map((c) => <ContactRow key={c.id} contact={c as unknown as any} />);

  return (
    <>
      <ContentHeader
        title={query?.opportunityId ? `${opportunityDetail?.pretaaGetCompanyOpprtunity?.name} Contacts` || '' : `${companyDetail?.pretaaGetCompany?.name} Contacts` || ''}
      />
      <ContentFrame>
        {error && <ErrorMessage message={error.message} />}
        {loading &&
          range(0, 5).map((i, index) => (
            <div className="ph-item" key={index}>
              <div className="ph-col-12">
                <div className="ph-row">
                  <div className="ph-col-12"></div>
                </div>
              </div>
            </div>
          ))}
        {!loading && contactRows}
      </ContentFrame>
    </>
  );
}
