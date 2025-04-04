import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
const Navbar = () =>{
  return (
     <>
     {/* navbar header */}
     
     <ul>
      <li><Link to='/home'>Home</Link></li>
      <li><Link to='/contact'>contact</Link></li>
      <li><Link to='/about'>About</Link></li>
      <li><Link to='/product'>Home</Link></li>
     </ul>
     {/* nav ends */}
     <button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-light">Light</button>
<button type="button" class="btn btn-dark">Dark</button>

<button type="button" class="btn btn-link">Link</button>     
     </>
     
  )
}
export const DD = () => {
    return <h1>from DD</h1>
}
export default Navbar;