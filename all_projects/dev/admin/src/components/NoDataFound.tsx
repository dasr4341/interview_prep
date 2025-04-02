import React from 'react';

export default function NoDataFound({
  type,
  testId
}: {
  type?: 'h6' | 'h2';
  testId?: string
}) {
  return (
    <div data-test-id={testId}>
      <h2 className={`${type ? type : 'h2'} text-primary mt-2 mb-2`}>
        No Data Found!
      </h2>
    </div>
  );
}
