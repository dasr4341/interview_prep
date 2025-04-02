/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from '../../components/content-frame/ContentFrame';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GET_PRODUCTS_QUERY } from 'lib/query/products/get-products';
import { GetProducts, GetProductsVariables } from 'generatedTypes';
import { range } from 'lodash';
import { useEffect } from 'react';
import useQueryParams from 'lib/use-queryparams';
import classNames from 'classnames';
import { routes } from 'routes';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { TrackingApi } from 'components/Analytics';

export default function ProductsScreen(): JSX.Element {
  const query = useQueryParams() as { opportunityId?: string };
  const { id } = useParams() as any;
  const [getProducts, { data: productsList, loading: productLoading }] = useLazyQuery<GetProducts, GetProductsVariables>(GET_PRODUCTS_QUERY);

  useEffect(() => {
    getProducts({
      variables: {
        companyId: id,
        opportunityId: query.opportunityId ? query.opportunityId : null,
      },
    });
  }, []);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.products.name,
    });
  }, []);

  const products = productsList?.pretaaCompanyProducts;

  return (
    <>
      <ContentHeader title="Products" />
      <ContentFrame>
        {productLoading &&
          !products?.length &&
          range(0, 5).map((i, index) => (
            <div className="ph-item" key={index}>
              <div className="ph-col-12">
                <div className="ph-row">
                  <div className="ph-col-12"></div>
                </div>
              </div>
            </div>
          ))}
        {!productLoading &&
          products?.map((p) => (
            <div
              key={id}
              className={classNames(
                `py-3 px-5 relative bg-white border-b last:border-b-0 
            last:rounded-b-xl first:rounded-t-xl`
              )}
              data-test-id="products">
              <Link
                to={routes.companyProductDetail.build(p.customerProductId, {
                  companyId: id,
                  opportunityId: query.opportunityId,
                })}
                className="flex items-center justify-between">
                <h3 className="h3 text-primary capitalize hover:text-primary-light">{p?.name}</h3>
                <DisclosureIcon />
              </Link>
            </div>
          ))}
      </ContentFrame>
    </>
  );
}
