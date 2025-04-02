import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../message/ErrorMessage";
import SuccessMessage from "../message/SuccessMessage";

interface SignUpFormInterface {
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
}

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  phone: yup.string().required().max(10).min(10),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Password and Confirm password must be same"
    ),
});

interface SignUpStatusInterface {
  loading: boolean;
  error?: string;
  data?: string;
}
export default function SignUpForm() {

  const [signUpStatus, setSignUpStatus] = useState<SignUpStatusInterface>({ loading: false});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInterface>({ resolver: yupResolver(schema), mode: "onChange" });

  async function onSubmit({ confirmPassword, ...signUpFormData }: SignUpFormInterface) {
    console.log('submit');
    setSignUpStatus({loading: false})
  };
  

  return (
    <form className="flex flex-col mt-10" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name")}
        type="text"
        placeholder="Name"
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />
      <input
        {...register("email")}
        type="text"
        placeholder="Email"
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />
      <input
        {...register("phone")}
        type="number"
        placeholder="+91 xxxxx xxxxx"
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />
      <input
        {...register("password")}
        type="text"
        placeholder="Password"
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />
      <input
        {...register("confirmPassword")}
        type="text"
        placeholder="Confirm Password"
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />

      <button
        type="submit"
        className="font-bold tracking-widest bg-blue-600 hover:bg-blue-700 hover:text-black mt-8 py-2 text-lg text-white rounded"
      >
        Submit
      </button>
      {(errors.email ||
        errors.name ||
        errors.password ||
        errors.confirmPassword) && (
        <ErrorMessage
          message={
            errors.email?.message ||
            errors.password?.message ||
            errors.name?.message ||
            String(errors.confirmPassword?.message)
          }
          className="mt-4"
              />
              )}
             {signUpStatus?.error &&  <ErrorMessage
          message={
            signUpStatus?.error
          }
          className="mt-4"
          />}

          {signUpStatus?.data &&  <SuccessMessage
          message={
           'Successfully SignUp !!'
          }
          className="mt-4"
              />}
    </form>
  );
}
