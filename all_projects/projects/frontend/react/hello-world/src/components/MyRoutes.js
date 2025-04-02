import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useParams,
     NavLink,
    useNavigate,
    useLocation
} from "react-router-dom";
import MyForm from './form';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import SubProducts from './pages/SubProducts';
import NavBar from './navbar';
import Details from './Details';

function MyRoutes() {
  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<NavBar/>}/>
                {/* <Route path='/hey' element={<MyForm/>}/> */}
                <Route path='/home' element={<Home/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path='/product' element={<Product/>}>
                        <Route path="headphone" element={<SubProducts title='3' url='headphone'/>} >
                            <Route path=':name' element={<Details/>} />
                        </Route>
                        <Route path="mobile" element={<SubProducts title='2' url='mobile'/>} >
                            <Route path=':name' element={<Details/>} />
                        </Route>
                </Route>
            </Routes>
        </Router>
    
    
    </>
  )
}

export default MyRoutes;