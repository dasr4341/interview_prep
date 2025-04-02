import React from 'react'
import { Outlet ,Link,NavLink} from 'react-router-dom'

function Product() {
  return (
    <div>Product
      {/* all the product details are shown here  */}
     <Link to='/product/headphone'> <button type="button" class="btn btn-primary">Primary 3</button></Link>
    
     <NavLink style={({isActive})=>{
      return {
        backgroundColor:isActive? "yellow":"pink",
      }
      }} to='/product/mobile'> <span className='text-white'>Primary 2</span></NavLink>
      
      <div style={
        {margin:'10px',
      backgroundColor:'red'}
      } >
      <Outlet/>
      </div>
    </div>
  )
}

export default Product