'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RegisterSchema from './register.validation';
import { CgDetailsMore } from 'react-icons/cg';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdOutlinePassword } from 'react-icons/md';

const SignIn = () => {
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  return (
    <div className=" min-h-screen flex flex-1 items-center justify-center ">
      <div className="shadow-lg md:min-w-96 px-10 py-8 rounded-lg">
        <div className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900  my-6">
          Register yourself
        </div>

        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit((data) => console.log(data))}
            >
              <Input id="Full Name" name="name">
                <CgDetailsMore size={'20px'} color="#d2d4d3" />
              </Input>
              <Input id="Email Address" name="email">
                <FaPhoneAlt size={'20px'} color="#d2d4d3" />
              </Input>
              <Input id="Password" name="password">
                <MdOutlinePassword size={'20px'} color="#d2d4d3" />
              </Input>
              <Input id="Confirm Password" name="confirmPassword">
                <MdOutlinePassword size={'20px'} color="#d2d4d3" />
              </Input>

              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm "
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-10 text-center text-sm text-gray-500">
            Already a member?
            <Link
              href="/register"
              className="font-medium underline leading-6 text-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
