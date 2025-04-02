import React from 'react';
import classNames from 'classnames';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function ProductView({
  product,
  id,
}: {
  // product: GetProducts_pretaaCompanyProducts | PretaaGetOpprtunityProducts_pretaaGetOpprtunityProducts;
  // Todo: Fix typing
  product: any;
  id: number;
}): JSX.Element {
  return (
    <div
      key={id}
      className={classNames(
        `py-3 px-5 relative bg-white border-b last:border-b-0 
        last:rounded-b-xl first:rounded-t-xl`
      )}
      data-test-id="products">
      <Link to={routes.productDetail.build(`${product?.id}`)} className="flex items-center justify-between">
        <h3 className="h3 text-primary capitalize hover:text-primary-light">
          { product?.name ? product?.name : product?.product?.name }
        </h3>
        <DisclosureIcon />
      </Link>
    </div>
  );
}
