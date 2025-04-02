import React from 'react'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from "../message/ErrorMessage";

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required()
})

interface SignInFormInterface {
    email: string;
    password: string;
}

export default function SignInForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInterface>({ resolver: yupResolver(schema), mode: 'onChange'});
    const onSubmit = (data: SignInFormInterface) => console.log(data);
    return (
        <form className="flex flex-col mt-10" onSubmit={handleSubmit(onSubmit)} >
            <input
                {...register('email')}
                type="text"
                placeholder="Email"
                className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
            />
            <input
                {...register('password')}
                type="text"
                placeholder="Password"
                className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
            />

            <button type="submit" className="font-bold tracking-widest bg-blue-600 hover:bg-blue-700 hover:text-black mt-8 py-2 text-lg text-white rounded">
                Submit
            </button>
            {(errors.email || errors.password) && <ErrorMessage message={String(errors.email?.message || errors.password?.message)} className='mt-4' />}
        </form>
    );
}
