import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorMessage from "../message/ErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";

interface CreateBlogFormInterface {
  title: string; 
  content: string;
}

interface CreatePostStateInterface {
  loading: boolean;
  data?: string;
  error?: string;
}

const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Please enter something to "),
});

export default function CreateBlogForm() {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlogFormInterface>({ resolver: yupResolver(schema), mode: "onChange" });

  const [createPostState, setCreatePostState] = useState<CreatePostStateInterface>({ loading: false });

  async function OnSubmit(formData: CreateBlogFormInterface) {
    setCreatePostState({ loading: false });
  }

  return (
    <form className="flex flex-col mt-10" onSubmit={handleSubmit(OnSubmit)}>
      <input
        type="text"
        placeholder="Title"
        {...register("title")}
        className="bg-slate-700 text-base text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
      />
      {errors.title && (
        <ErrorMessage message={String(errors.title?.message)} className="mt-4" />
      )}

      <textarea
        className="bg-slate-700  text-white rounded mt-2 py-2 px-1 outline-none border border-slate-500"
        {...register("content")}
      ></textarea>
      {errors.content && (
        <ErrorMessage message={String(errors.content?.message)} className="mt-4" />
      )}

      <input
        type="file"
        className="bg-slate-700 rounded  mt-2 p-1 outline-none border border-slate-500"
      />

      <button className="font-bold tracking-widest bg-blue-600 hover:bg-blue-700 hover:text-black mt-8 py-2 text-lg text-white rounded">
        Publish
      </button>
     {createPostState.data && <div className="text-green-300">{createPostState.data}</div>}
    </form>
  );
}
