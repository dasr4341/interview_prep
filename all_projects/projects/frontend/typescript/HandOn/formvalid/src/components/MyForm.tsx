import React from 'react'
import {useForm} from "react-hook-form";


//  this is use-form hook validation stand alone

interface FormData{
    // created an interface 
    name:string;
    email:string;
}
const defaultData ={
    name:'',
    email:''
}
const Myform:React.FC = ()=>{
    // is going to return FC = function component 

    const {
        register,
        handleSubmit,
        clearErrors,
        formState:{errors},
        reset,
        watch,
        setFocus
    } = useForm<FormData>(); // the type is FormData

    const onFormSubmit = (data:FormData)=>{
        console.log(data);
    }
    const name = watch('name')
    const email = watch('email')

  return (
    <>
    <form onSubmit={handleSubmit(onFormSubmit)}>
        <input type="text" placeholder ="name" {...register('name',{required:true,maxLength:10})}/>

        <div>{errors.name?.type === "required" && (<span>This is a required field</span>)}</div>

        <input type="text" placeholder ="email" 
        {...register(
                'email',
                {maxLength:10,
                required:true }
            )
        }/>
        {errors.email?.type}
        {/* <div>{errors.email?.type === "pattern" && (
            <>
            <span>Invalid Characters</span>
            <button type="button" onClick={()=>{
                clearErrors('email');
            }}> X</button>
            </>
        )}
        </div>
        <div>{errors.email?.type === "maxLength" && (<span>Max Len exceed</span>)}</div>
        <div>{errors.email?.type === "required" && (<span>Hey this is required</span>)}</div> */}
        <button type="submit"> Submit</button>
        <button type="button" onClick={()=>reset()}> Reset</button>

    </form>
    {/* <div>
       
        {(name || email) && (
            <>
                <p>Preview</p>
                <h1 onClick={()=> setFocus('name')}>{name}</h1>
                <h1 onClick={()=> setFocus('email')}>{email}</h1>
            </>
        )}
    </div> */}
    </>
  )
}

export default Myform;