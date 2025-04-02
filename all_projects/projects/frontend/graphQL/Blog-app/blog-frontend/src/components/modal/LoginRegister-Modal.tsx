import React, { useState } from "react";
import CloseIcon from "../../Icons/Close-Icon";
import SignInForm from "../form/SignInForm";
import SignUpForm from "../form/SignUpFrom";

export default function LoginRegisterModal({
  CloseModal,
}: {
  CloseModal: () => void;
}) {
  // info :
  // # currentFormMode === true => login mode
  // # currentFormMode === false => register mode
  const [currentFormMode, steCurrentFormMode] = useState(true);

  return (
    <section
      className="absolute  top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-md overflow-hidden"
      onClick={() => CloseModal()}
    >
      <CloseIcon
        className="w-10 h-10 md:w-12 md:h-12 bg-theme-base4 rounded-3xl cursor-pointer absolute top-10 right-10"
        fill="white"
        onClick={() => CloseModal()}
      />
      <div
        className="bg-theme-base4 border border-slate-500 rounded p-6 flex flex-col md:w-1/2 lg:w-1/3  w-[90%] "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex">
          <div
            className={`font-bold text-4xl p-2 border-slate-500 rounded cursor-pointer
            ${
              currentFormMode
                ? "text-white  bg-theme-base2  border-b"
                : "text-slate-800 "
            } `}
            onClick={() => steCurrentFormMode(true)}
          >
            Sign In
          </div>

          <div
            className={`font-bold text-4xl p-2 ml-2 cursor-pointer  border-slate-500 rounded ${
              currentFormMode
                ? "text-slate-800 "
                : "text-white  bg-theme-base2  border-b"
            } `}
            onClick={() => steCurrentFormMode(false)}
          >
            Sign Up
          </div>
        </div>
        <div className="text-blue-600 font-bold tracking-widest text-sm mt-2">
          Lets get started !!
        </div>
        {currentFormMode ? <SignInForm /> : <SignUpForm />}
      </div>
    </section>
  );
}
