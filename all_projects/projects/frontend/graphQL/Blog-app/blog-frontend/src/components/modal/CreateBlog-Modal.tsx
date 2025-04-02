import React from "react";
import CloseIcon from "../../Icons/Close-Icon";
import CreateBlogForm from "../form/CreateBlogForm";
export default function CreateBlogModal({
  CloseModal,
}: {
  CloseModal: () => void;
}) {
  return (
    <section
      className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-md overflow-hidden"
      onClick={() => CloseModal()}
    >
      <CloseIcon
        className="w-10 h-10 md:w-12 md:h-12 bg-theme-base4 rounded-3xl cursor-pointer absolute top-10 right-10"
        fill="white"
        onClick={() => CloseModal()}
      />
      <div
        className="bg-theme-base4 border border-slate-500 rounded p-6 flex flex-col md:w-1/2  w-[90%] "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-white text-4xl">Create Blog </div>
        <div className="text-blue-600 font-bold tracking-widest text-sm mt-2">
          Be the magic in some ones world
        </div>
        <CreateBlogForm />
      </div>
    </section>
  );
}
