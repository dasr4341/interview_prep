import userEvent from '@testing-library/user-event';
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useParams, NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";
import './style.css';

export default function MYroute() {

  return ( 
   
    <Router>
      <Routes>
          {/* <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<Navigate replace to='/contact' />} /> */}
          <Route path="/product" element={<Product />}>
            {/* to load the page into another page without loading */}
                <Route path="product1" element={<Product1 />} >
                  <Route path=":id" element={<Details/>} />
                </Route>
          </Route>
          {/* to load the page seperately */}
          {/* <Route path="product/product2" element={<Product2/>} />
          <Route path="/contact" element={<Contact/> }/>
          <Route path="product/product2/:id" element={<Details/>} />
          <Route path="/moredetails" element={<MoreDetails/>} /> */}
          
        
      </Routes>
    </Router>


  )
}
function Home() {
    return <h1>Home : HEY welcome to the routes</h1>
}
function Abt() {
    return <h1>ABOUT : HEY welcome to the routes</h1>
}
function Contact() {
    return <h1>Contact : HEY welcome to the routes</h1>
}
function Product() {
  const arr = ['sam', 'ram','jamuna'];
  const rand = arr[Math.floor(Math.random()*arr.length)]
  return <>
    <h1 className='header'>Product
      <img className = 'product-Image' src='https://cdn.vox-cdn.com/thumbor/HBXE9mH2j3XK34btt7Wppk5h8LM=/0x0:2040x1360/1820x1213/filters:focal(857x517:1183x843):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/63876329/acastro_180427_1777_0001.0.jpg' alt="Not Found"/>
    </h1>
    <Link to='/product/product1' className='items'>First Product </Link>
 
    <Link to='/product/product2' className='items'>Second Product</Link>

    <NavLink 
    style={
      ({ isActive }) => {
      return {backgroundColor : isActive ? "Green" : "Yellow"};
    }
    } to={`/product/product1/${rand}`} >Some NavLink</NavLink>

    {/* content of product will be shown using this outlet */}
       <Outlet/>
  </>
}
function Product1() {
  return <h1>P1 : HEY welcome to the routes
      <Outlet/>
    </h1>
}
function Product2() {
    return <h1>p2 : HEY welcome to the routes</h1>
}
function Details() {
  // to access the query
  const navigate = useNavigate();
  const { id } = useParams();

  return <h1>Details : {id}
    <span
      onClick={() => {
        navigate('/moredetails',{state:id})
      }}
      className='items'>More Details</span>

    {/* <link to='/moredetails' state={"hey"}>More Details 1 </link> */}
  </h1>
}
function MoreDetails() {
  // to access the query
  const location = useLocation();

    return <h1>Details : {location.state} </h1>
}
