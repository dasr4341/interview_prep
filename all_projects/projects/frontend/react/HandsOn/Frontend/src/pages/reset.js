import React  from 'react'
import NavBar from '../components/Navbar/navBar';
import PassIcon from '../components/Logo/passwordLogo';
import TextField from '../components/TextField/TextFieldComponent';
import MyButton from '../components/Mybutton/Mybutton';
import CompanyLogo from '../components/Logo/companLogo';
// import * as Yup from "yup";



function Reset() {
  
    
    const handler = (e) => {
        console.log(e);
        console.log(e.target.old_pass.value);
        console.log(e.target.new_pass.value);
        console.log(e.target.re_pass.value);
        e.preventDefault();
    }

   
 
  
  
   
   
    return <>
        <section className='bg-red'>
           <NavBar />
            <div className='absolute left-1/2 translate-y-501 translate-x-501 top-1/2 sm:w-1/2 md:w-3/6 lg:w-1/4 '>
                <form className='flex flex-col justify-items-center rounded-lg py-4 px-4 shadow-xl'  method='POST' onSubmit={handler}>
                   <CompanyLogo w="full" p="3" />
                   <h1 className='text-center font-bold py-4 text-lg text-hColor'>Reset Password</h1>
                   
                    <TextField placeholder="Old Password" icon={<PassIcon />} mY="2" pY="2" pX="2" nameData="old_pass"  />
                    <TextField placeholder="New Password" icon={<PassIcon />} mY="2" pY="2" pX="2" nameData="new_pass"   />
                    <TextField placeholder="Re-Enter Password" icon={<PassIcon />} mY="2" pY="2" pX="2" nameData="re_pass"   />
                   <MyButton name="SUBMIT" marginY='4' bg='black'/>
                </form>
            </div>
        </section>
    </>
}

export default Reset