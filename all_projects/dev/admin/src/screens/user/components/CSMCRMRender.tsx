import React from 'react';

export function CSMRender({ data }: { data: any }) {
  return <div>{data?.csmStatus === 'true' ? 'Active' : 'Inactive'}</div>;
}

export function CRMRender({ data }: { data: any }) {
  return <div>{data?.crmStatus === 'true' ? 'Active' : 'Inactive'}</div>;
}
