import { SourceSystemTypes } from 'health-generatedTypes';
import { titleCase } from 'humanize-plus';
import React from 'react'

export default function EhrCell(props) {
  const data = props.data.ehrType as SourceSystemTypes;
  return (
    <div>
      {data === SourceSystemTypes.ehr ? 'Manual' : ''}
      {data !== SourceSystemTypes.ehr ? titleCase(data) : ''}
    </div>
  )
}
