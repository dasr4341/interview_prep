import React from 'react'
import { useParams } from 'react-router-dom'
function Details() {
    const {name} = useParams();

  return (
    <div>Details-{name}</div>
  )
}

export default Details