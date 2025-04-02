import { GetCompanyMngtList_getFilteredCompaniesAdmin } from 'generatedTypes';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function CompanyNameCell({ data }: { data: GetCompanyMngtList_getFilteredCompaniesAdmin }) {
  return (
    <Link to={routes.companyMgmtDetail.build(String(data.id))} className="link">
      {data.name}
    </Link>
  );
}
