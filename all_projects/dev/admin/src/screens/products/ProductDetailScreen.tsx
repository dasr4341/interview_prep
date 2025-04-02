import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import CurrencyFormat from 'components/CurrencyFormat';
import DateFormat from 'components/DateFormat';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { LabeledValue } from 'components/LabeledValue';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { GetProductDetails, GetProductDetailsVariables } from 'generatedTypes';
import { GET_PRODUCT_DETAILS_QUERY } from 'lib/query/products/get-product-details';
import { Link, useParams } from 'react-router-dom';
import { routes } from 'routes';
import useQueryParams from 'lib/use-queryparams';
import { TrackingApi } from 'components/Analytics';

export default function ProductDetailScreen(): JSX.Element {
  const { id } = useParams() as any;
  const query = useQueryParams() as { companyId?: string; opportunityId?: string };

  const { data, loading, error } = useQuery<GetProductDetails, GetProductDetailsVariables>(GET_PRODUCT_DETAILS_QUERY, {
    variables: {
      productId: id,
      take: 1000,
      skip: 0,
      companyId: query.companyId ? String(query.companyId) : null,
      opportunityId: query.opportunityId ? String(query.opportunityId) : null,
    },
  } as any);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.productDetail.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Product Details" />
      <ContentFrame>
        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error.message} />}

        {data && (
          <React.Fragment>
            <div className="py-2 px-5 border rounded-xl bg-white">
              <h2 className="h2 text-primary capitalize">{data?.pretaaGetCompanyProduct?.name}</h2>
            </div>

            {Number(data?.pretaaGetProductOpportunities?.length) > 0 && (
              <div className="mt-6">
                {data?.pretaaGetProductOpportunities?.map((opt) => (
                  <React.Fragment key={opt.id}>
                    <div className="grid grid-cols-1 border rounded-xl py-3 p-3 mb-5 bg-white">
                      <div className="pb-2 ml-3 mr-3 lg:mr-14 border-b bg-white">
                        <h2 className="h2 text-primary capitalize">{opt.opportunity.name}</h2>
                      </div>

                      <div className="grid mt-3">
                        <LabeledValue label="Company" className="pb-4 lg:pb-6">
                          <Link
                            to={
                              query?.opportunityId
                                ? routes.companyOpportunityDetail.build(`${opt?.opportunity.company?.id}`, `${opt.opportunity.id}`)
                                : routes.companyDetail.build(query?.companyId || '')
                            }
                            className="text-primary-light underline font-medium">
                            {opt.opportunity.company.name || 'NA'}
                          </Link>
                        </LabeledValue>
                      </div>

                      <div className="bg-white grid lg:grid-cols-3 ">
                        <LabeledValue label="Order Start Date" className="pb-4 lg:pb-6">
                          {opt.orderStartDate ? <DateFormat date={opt.orderStartDate} /> : 'NA'}
                        </LabeledValue>
                        <LabeledValue label="Order End Date" className="pb-4 lg:pb-6">
                          {opt?.orderEndDate ? <DateFormat date={opt?.orderEndDate} /> : 'NA'}
                        </LabeledValue>
                        <LabeledValue label="Order Terms (Months)*" className="pb-4 lg:pb-6">
                          {opt?.orderTerms || 'NA'}
                        </LabeledValue>
                        <LabeledValue label="Monthly Unit Price" className="pb-4 lg:pb-6">
                          {opt?.monthlyUnitPrice ? <CurrencyFormat price={opt?.monthlyUnitPrice} /> : 'NA'}
                        </LabeledValue>
                        <LabeledValue label="Quantity" className="pb-4 lg:pb-6">
                          {opt?.quantity ? opt?.quantity : 'NA'}
                        </LabeledValue>
                        <LabeledValue label="Total Price" className="pb-4 lg:pb-6">
                          {opt?.totalPrice ? <CurrencyFormat price={opt.totalPrice} /> : 'NA'}
                        </LabeledValue>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </ContentFrame>
    </>
  );
}
