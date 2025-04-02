import React from 'react'
import { Link, Outlet } from 'react-router-dom'


function SubProducts({title = "hey",url}) {
    const rand = new Date().getMilliseconds();
  return (

    <div>Product {title} {'< --'} title <br/>
            <Link to={`/product/${url}/${rand}`}>{rand}</Link>
        <Outlet/>
    </div>
    
  )
}

export default SubProducts