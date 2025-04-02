import React from 'react'
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// so this is the yup validation - using useForm hook



interface FormData {
    name:string;
    email:string;
}

const defaultData = {
    name:'hey ali',
    jdcd:''
}

const schema = yup.object().shape({
    name: yup.string().email().required('This is a required field')
    // re-pass:yup.string().oneOf([yup.ref("pass"),null])
})

const YupMyForm:React.FC = () => {

    const {
        register,
        handleSubmit,
        formState:{errors},
        reset,
    } = useForm<FormData>({
        defaultValues:defaultData,
        resolver:yupResolver(schema)
    });



    const onFormSubmit = (data:FormData)=>{
        console.log(data);
        
    }

    return <>
        <form onSubmit={handleSubmit(onFormSubmit)}>

            {/* <input 
            type='text' 
            placeholder='name'  
            {...register('name',{
                required:true,
                maxLength:10,
                pattern:/[A-Za-z]/
            })}
            /> */}

             <input 
            type='text' 
            placeholder='name'  
                {...register('name')}
            />

            {/* {errors.name?.message} */}
            {errors.name?.type === 'email' && (
                <>
                    hey this is not a email
                </>
            )}

            <button type='submit' >Submit</button>

            <button onClick={()=>{
                reset();
            }} >Reset</button>

        </form>
       
    </>
}

export default YupMyForm