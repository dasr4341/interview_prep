/* eslint-disable react-hooks/exhaustive-deps */
import { LabeledValue } from 'components/LabeledValue';
import DateFormat from 'components/DateFormat';
import './../../../scss/modules/_reference-card.scss';
import ReadableNumber from 'components/ReadableNumber';
import { Link } from 'react-router-dom';
import CompanyRating from 'screens/companies/components/company-rating';
import { useLazyQuery } from '@apollo/client';
import { getCompanyBlockQuery } from 'lib/query/company/get-company-block';
import { useEffect, useState } from 'react';
import {
  CompanyType,
  GetCompanyBlock,
  GetCompanyBlockVariables,
  GetCompanyBlock_pretaaGetCompany,
} from 'generatedTypes';
import CurrencyFormat from 'components/CurrencyFormat';
import LockIcon from 'components/icons/LockIcon';
import ReferenceBudge from 'components/ReferenceBudge';

export default function CompanyBlock({
  id,
  type,
}: {
  id: string;
  type: 'company' | 'event';
}) {
  const [companyDetail, setCompanyDetail] = useState<GetCompanyBlock_pretaaGetCompany>();
  const [getCompany, { data: company }] = useLazyQuery<GetCompanyBlock, GetCompanyBlockVariables>(getCompanyBlockQuery);
  useEffect(() => {
    if (id) {
      getCompany({
        variables: {
          companyId: id,
          where: {
            primary: {
              equals: true,
            },
          },
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (company?.pretaaGetCompany) {
      setCompanyDetail(company?.pretaaGetCompany);
    }
  }, [company]);

  const handleReferenceRemoved = () => {
    getCompany({
      variables: {
        companyId: id,
        where: {
          primary: {
            equals: true,
          },
        },
      },
    });
  };

  return (
    <div className="bg-white grid md:grid-cols-2 lg:grid-cols-3 gap-y-6 px-5 py-6 border border-gray-200 rounded-xl">
      {type === 'event' && (
        <LabeledValue label="Company">
          <Link to={`/companies/${companyDetail?.id}`} className="text-pt-blue-300 font-medium underline" data-test-id="company-name">
            {companyDetail?.name || 'NA'}
          </Link>
        </LabeledValue>
      )}

      {type === 'event' && (companyDetail?.offeredOn || companyDetail?.surveyedOn) && (
        <ReferenceBudge companyId={String(companyDetail?.id)} onRemoved={handleReferenceRemoved} />
      )}

      <LabeledValue label="Primary Contact">
        {companyDetail?.contacts?.map((c) => c.name).join(', ') || 'NA'}
      </LabeledValue>

      {companyDetail?.companyType === CompanyType.PROSPECT && (
        <>
          <LabeledValue label="Potential Revenue">
            {!companyDetail?.annualRecurringRevenueVal?.hasAccess && <LockIcon className="text-gray-600" />}
            {companyDetail?.annualRecurringRevenueVal?.hasAccess && (
              <>
                  { companyDetail?.annualRecurringRevenueVal.data ?
                   <CurrencyFormat price={companyDetail?.annualRecurringRevenueVal.data} /> : 'NA'}
              </>
            )}
          </LabeledValue>
          <LabeledValue label="Expected Close">
            {companyDetail?.expectedToCloseAt ? <DateFormat date={companyDetail?.expectedToCloseAt} /> : 'NA'}
          </LabeledValue>
        </>
      )}

      <LabeledValue label="Number Of Employees">
        {companyDetail?.employeeCount ? <ReadableNumber number={companyDetail?.employeeCount as number} /> : 'NA'}
      </LabeledValue>

      <CompanyRating companyId={String(companyDetail?.id)} />

      {companyDetail?.companyType === CompanyType.CUSTOMER && (
        <>
          <LabeledValue label="Renewal Date">
          {company?.pretaaGetCompany?.renewalDate ? <DateFormat date={company?.pretaaGetCompany.renewalDate} /> : 'NA'}
          </LabeledValue>
          <LabeledValue label="Revenue">
            {companyDetail?.annualRecurringRevenueVal?.hasAccess && (
              <>
                {companyDetail?.annualRecurringRevenueVal?.data ? (
                  <>
                    <CurrencyFormat price={companyDetail?.annualRecurringRevenueVal.data as number} />
                  </>
                ) : (
                  'NA'
                )}
              </>
            )}

            {!companyDetail?.annualRecurringRevenueVal?.hasAccess && <LockIcon className="text-gray-600" />}
          </LabeledValue>
          <LabeledValue label="Close Date">
            {companyDetail?.expectedToCloseAt && <DateFormat date={companyDetail?.expectedToCloseAt} />}
            {!companyDetail?.expectedToCloseAt && <>NA</>}
          </LabeledValue>
        </>
      )}
      <LabeledValue label="Industry">
        {companyDetail?.companyIndustries.map((i) => i.industry.sector).join(', ') || 'NA'}
      </LabeledValue>
      {companyDetail?.companyType === CompanyType.CUSTOMER && (
        <LabeledValue label="Average NPS Response">
          {companyDetail?.nps?.hasAccess && (
            <>{isNaN(companyDetail?.nps?.data as number) ? 'NA' : companyDetail?.nps?.data}</>
          )}

          {!companyDetail?.nps?.hasAccess && <LockIcon className="text-gray-600" />}
        </LabeledValue>
      )}
    </div>
  );
}
