/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  GetCompany,
  GetCompanyVariables,
  GetReference,
  GetReferenceVariables,
  CompanyType,
  GetCompany_pretaaGetCompany,
} from 'generatedTypes';
import { LabeledValue } from 'components/LabeledValue';
import { GetOneReference } from 'lib/query/company/reference';
import { GetCompanyQuery } from 'lib/query/company/get-company';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import SwiperCore, { Pagination } from 'swiper';
import DateFormat from 'components/DateFormat';
import './../../../scss/modules/_reference-card.scss';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CompanyRating from 'screens/companies/components/company-rating';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import ReadableNumber from 'components/ReadableNumber';
import CurrencyFormat from 'components/CurrencyFormat';
import LockIcon from 'components/icons/LockIcon';
import ReferenceBudge from 'components/ReferenceBudge';

dayjs.extend(customParseFormat);

SwiperCore.use([Pagination]);

export function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ReferenceCard({ id }: { id: string; }) {
  const [getReference, { data: reference, loading }] = useLazyQuery<GetReference, GetReferenceVariables>(
    GetOneReference
  );
  const [getCompany, { data: companyDetails, loading: companyLoading }] = useLazyQuery<GetCompany, GetCompanyVariables>(
    GetCompanyQuery
  );
  const [getReferenceCompany, { data: referenceCompanyDetails }] = useLazyQuery<GetCompany, GetCompanyVariables>(
    GetCompanyQuery
  );
  const [companyDetail, setCompanyDetail] = useState<GetCompany_pretaaGetCompany>();
  const [referenceCompanyDetail, setReferenceCompanyDetail] = useState<GetCompany_pretaaGetCompany>();

  useEffect(() => {
    if (id) {
      getReference({
        variables: {
          referenceId: id,
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (reference?.pretaaGetReference?.id) {
      getCompany({
        variables: {
          companyId: reference?.pretaaGetReference?.companyId,
          contactsWhere: {
            primary: {
              equals: true,
            },
          },
        },
      });
    }
    if (reference?.pretaaGetReference?.servedAsReferenceForId) {
      getReferenceCompany({
        variables: {
          companyId: reference?.pretaaGetReference?.servedAsReferenceForId,
          contactsWhere: {
            primary: {
              equals: true,
            },
          },
        },
      });
    }
  }, [reference]);

  useEffect(() => {
    if (companyDetails?.pretaaGetCompany) {
      setCompanyDetail(companyDetails?.pretaaGetCompany);
    }
    if (referenceCompanyDetails?.pretaaGetCompany) {
      setReferenceCompanyDetail(referenceCompanyDetails?.pretaaGetCompany);
    }
  }, [companyDetails, referenceCompanyDetails]);

  const handleReferenceRemoved = (type: string) => {
    if (type === 'reference') {
      getReferenceCompany({
        variables: {
          companyId: String(reference?.pretaaGetReference?.servedAsReferenceForId),
          contactsWhere: {
            primary: {
              equals: true,
            },
          },
        },
      });
    } else {
      getCompany({
        variables: {
          companyId: String(reference?.pretaaGetReference?.companyId),
          contactsWhere: {
            primary: {
              equals: true,
            },
          },
        },
      });
    }
  };

  return (
    <div>
      {loading && <Loading />}
      {companyLoading && <Loading />}

      {reference?.pretaaGetReference && (
        <div
          className="bg-white gap-y-6 
          border border-gray-200 rounded-xl" >
          {reference?.pretaaGetReference?.companyType === CompanyType?.PROSPECT && (
            <>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-3
                px-5 py-1 mt-4">
                <LabeledValue label="What company served as your reference?">
                  {reference?.pretaaGetReference?.servedAsReferenceForName  ? (
                    <Link
                      to={`/companies/${reference?.pretaaGetReference?.servedAsReferenceForId}`}
                      className="text-pt-blue-300 font-medium underline cursor-pointer">
                      {reference?.pretaaGetReference?.servedAsReferenceForName}
                    </Link>
                  ) : (
                    'NA'
                  )}
                </LabeledValue>
                <LabeledValue label="When did they served as a reference?">
                  {reference?.pretaaGetReference?.servedAsReferenceAt
                    ? dayjs(reference?.pretaaGetReference?.servedAsReferenceAt).format('MM/DD/YY')
                    : 'NA'}
                </LabeledValue>
              </div>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-3
                px-5 py-1 mt-4">
                <LabeledValue label="What did they do?">
                  {reference?.pretaaGetReference?.offerOptions?.map((x) => x.offerOption.offerType).join(', ') || 'NA'}
                </LabeledValue>
                <LabeledValue label="Person from Reference Company Info">
                  {reference?.pretaaGetReference?.firstName ||
                  reference?.pretaaGetReference?.lastName ||
                  reference?.pretaaGetReference?.position ||
                  reference?.pretaaGetReference?.email ||
                  reference?.pretaaGetReference?.phone ? (
                    <>
                      <p>
                        {reference?.pretaaGetReference?.firstName} {reference?.pretaaGetReference?.lastName}
                      </p>
                      <p>{reference?.pretaaGetReference?.position} </p>
                      <p>{reference?.pretaaGetReference?.email} </p>
                      <p>{reference?.pretaaGetReference?.phone}</p>
                    </>
                  ) : (
                    'NA'
                  )}
                </LabeledValue>
              </div>
            </>
          )}
          {reference?.pretaaGetReference?.companyType === CompanyType?.CUSTOMER && (
            <>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6
                px-5 py-1 mt-4">
                <LabeledValue label="Did they offer to be a reference?">
                  {reference?.pretaaGetReference?.offeredTo || 'NA'}
                </LabeledValue>
                <LabeledValue label="What did they offer to do?">
                  {reference?.pretaaGetReference?.offerOptions
                    ?.filter((o) => !o.offerOptionBefore)
                    .map((x) => x.offerOption.offerType)
                    .join(', ') || 'NA'}
                </LabeledValue>
              </div>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6
                px-5 py-1 mt-4">
                <LabeledValue label="Have they served as a reference before?">
                  {reference?.pretaaGetReference?.servedAsReferenceBefore ? 'Yes' : 'No'}
                </LabeledValue>
                <LabeledValue label="Who did they serve as reference for?">
                  {reference?.pretaaGetReference?.servedAsReferenceForName && referenceCompanyDetail && (
                    <Link
                      to={`/companies/${reference?.pretaaGetReference?.servedAsReferenceForId}`}
                      className="text-pt-blue-300 font-medium underline cursor-pointer">
                      {reference?.pretaaGetReference?.servedAsReferenceForName}
                    </Link>
                  )}
                  {reference?.pretaaGetReference?.servedAsReferenceForName && !referenceCompanyDetail && (
                    <>
                      {reference?.pretaaGetReference?.servedAsReferenceForName || 'NA'}
                    </>
                  )}
                  {!reference?.pretaaGetReference?.servedAsReferenceForName && (
                    <>NA</>
                  )}
                </LabeledValue>
              </div>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6
                px-5 py-1 mt-4">
                <LabeledValue label="When did they serve as a reference?">
                  {reference?.pretaaGetReference?.servedAsReferenceAt
                    ? dayjs(reference?.pretaaGetReference?.servedAsReferenceAt).format('MM/DD/YY')
                    : 'NA'}
                </LabeledValue>
                <LabeledValue label="Did the deal close?">
                  {reference?.pretaaGetReference?.dealClosed ? 'Yes' : 'No'}
                </LabeledValue>
              </div>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6
                px-5 py-1 mt-4">
                <LabeledValue label="Person from Reference Company Info">
                  {reference?.pretaaGetReference?.firstName ||
                  reference?.pretaaGetReference?.lastName ||
                  reference?.pretaaGetReference?.position ||
                  reference?.pretaaGetReference?.email ||
                  reference?.pretaaGetReference?.phone ? (
                    <>
                      <p>
                        {reference?.pretaaGetReference?.firstName} {reference?.pretaaGetReference?.lastName}
                      </p>
                      <p>{reference?.pretaaGetReference?.position} </p>
                      <p>{reference?.pretaaGetReference?.email} </p>
                      <p>{reference?.pretaaGetReference?.phone}</p>
                    </>
                  ) : (
                    'NA'
                  )}
                </LabeledValue>
                <LabeledValue label="What did they do?">
                  {reference?.pretaaGetReference?.offerOptions
                    ?.filter((o) => o.offerOptionBefore)
                    .map((x) => x.offerOption.offerType)
                    .join(', ') || 'NA'}
                </LabeledValue>
              </div>
            </>
          )}
          <div className="pt-0 px-5 py-6 mt-4">
            <LabeledValue label="Comments">
              {reference?.pretaaGetReference?.notes ? reference?.pretaaGetReference?.notes : 'NA'}
            </LabeledValue>
          </div>
          <div className="pt-2 px-5 py-6 text-base italic text-gray-700 capitalize">
            Credit For This Entry Goes To {reference?.pretaaGetReference?.user?.firstName}{' '}
            {reference?.pretaaGetReference?.user?.lastName}
          </div>
        </div>
      )}
      {(companyDetail || referenceCompanyDetail) && (
        <>
          <Swiper
            className="reference-card-slider flex flex-col h-96"
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            watchOverflow={true}>
            {companyDetail?.id && (
              <SwiperSlide className="flex flex-col bg-white border border-gray-200 rounded-xl h-auto mt-4">
                <div className="gap-y-6 mt-6 flex">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6 px-5 py-6">
                    <LabeledValue label="Company">
                      <Link
                        to={`/companies/${companyDetail?.id}`}
                        className="text-pt-blue-300 font-medium underline cursor-pointer" data-test-id="company-name">
                        {companyDetail?.name || 'NA'}
                      </Link>
                    </LabeledValue>
                    {(companyDetail?.offeredOn || companyDetail?.surveyedOn) && (
                      <ReferenceBudge
                        companyId={String(companyDetail?.id)}
                        type="company"
                        onRemoved={handleReferenceRemoved}
                      />
                    )}
                    {companyDetail.id && <CompanyRating companyId={companyDetail.id} />}
                    <LabeledValue label="Primary Contact">
                      {companyDetail?.contacts?.map((c) => c.name).join(', ') || 'NA'}
                    </LabeledValue>
                    <LabeledValue label="Industry">
                      {companyDetail?.companyIndustries?.map(({ industry: { sector } }) => sector).join(', ') || 'NA'}
                    </LabeledValue>
                    <LabeledValue label="NPS Score">
                      {isNaN(companyDetail.NPSScore as number) ? 'NA' : companyDetail.NPSScore}
                    </LabeledValue>
                    <LabeledValue label="Close Date">
                      {companyDetail?.expectedToCloseAt ? <DateFormat date={companyDetail?.expectedToCloseAt} /> : 'NA'}
                    </LabeledValue>
                    <LabeledValue label="Renewal Date">
                      {companyDetail?.renewalDate ? <DateFormat date={companyDetail?.renewalDate} /> : 'NA'}
                    </LabeledValue>
                    <LabeledValue label="Revenue As Of">
                      {companyDetail.annualRecurringRevenueVal?.hasAccess && (
                        <>
                          {companyDetail.annualRecurringRevenueVal?.data ? (
                            <>
                              <CurrencyFormat price={companyDetail.annualRecurringRevenueVal.data as number} />
                            </>
                          ) : (
                            'NA'
                          )}
                        </>
                      )}

                      {!companyDetail.annualRecurringRevenueVal?.hasAccess && <LockIcon className="text-gray-600" />}
                    </LabeledValue>
                    <LabeledValue label="Number Of Employees">
                      {companyDetail.employeeCount ? (
                        <ReadableNumber number={companyDetail.employeeCount as number} />
                      ) : (
                        'NA'
                      )}
                    </LabeledValue>
                  </div>
                </div>
              </SwiperSlide>
            )}
            {referenceCompanyDetail?.id && (
              <SwiperSlide className="flex flex-col bg-white border border-gray-200 rounded-xl h-auto mt-4">
                <div className="gap-y-6 mt-6 h-full">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-6  px-5 py-6">
                    <LabeledValue label="Company">
                      <Link
                        to={`/companies/${referenceCompanyDetail?.id}`}
                        className="text-pt-blue-300 font-medium underline cursor-pointer" data-test-id="company-name">
                        {referenceCompanyDetail?.name || 'NA'}
                      </Link>
                    </LabeledValue>
                    {(referenceCompanyDetail?.offeredOn || referenceCompanyDetail?.surveyedOn) && (
                      <ReferenceBudge
                        companyId={String(companyDetail?.id)}
                        type="reference"
                        onRemoved={handleReferenceRemoved}
                      />
                    )}
                    {referenceCompanyDetail.id && <CompanyRating companyId={referenceCompanyDetail.id} />}
                    <LabeledValue label="Primary Contact">
                      {referenceCompanyDetail?.contacts?.map((c) => c.name).join(', ') || 'NA'}
                    </LabeledValue>
                    <LabeledValue label="Industry">
                      {referenceCompanyDetail?.companyIndustries
                        ?.map(({ industry: { sector } }) => sector)
                        .join(', ') || 'NA'}
                    </LabeledValue>
                    <LabeledValue label="NPS Score">
                      {isNaN(referenceCompanyDetail?.NPSScore as number) ? 'NA' : referenceCompanyDetail?.NPSScore}
                    </LabeledValue>
                    <LabeledValue label="Close Date">
                      {referenceCompanyDetail?.expectedToCloseAt ? (
                        <DateFormat date={referenceCompanyDetail?.expectedToCloseAt} />
                      ) : (
                        'NA'
                      )}
                    </LabeledValue>
                    <LabeledValue label="Renewal Date">
                      {referenceCompanyDetail?.renewalDate ? (
                        <DateFormat date={referenceCompanyDetail?.renewalDate} />
                      ) : (
                        'NA'
                      )}
                    </LabeledValue>
                    <LabeledValue label="Revenue As Of">
                      {referenceCompanyDetail.annualRecurringRevenueVal?.hasAccess && (
                        <>
                          {referenceCompanyDetail.annualRecurringRevenueVal?.data ? (
                            <>
                              <CurrencyFormat price={referenceCompanyDetail.annualRecurringRevenueVal.data as number} />
                            </>
                          ) : (
                            'NA'
                          )}
                        </>
                      )}

                      {!referenceCompanyDetail.annualRecurringRevenueVal?.hasAccess && (
                        <LockIcon className="text-gray-600" />
                      )}
                    </LabeledValue>
                    <LabeledValue label="Number Of Employees">
                      {referenceCompanyDetail.employeeCount ? (
                        <ReadableNumber number={referenceCompanyDetail.employeeCount as number} />
                      ) : (
                        'NA'
                      )}
                    </LabeledValue>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </>
      )}
    </div>
  );
}
