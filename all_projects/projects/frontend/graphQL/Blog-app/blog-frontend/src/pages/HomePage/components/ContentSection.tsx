import React from "react";
import HomePagePostCard from "../../../components/card/HomePagePostCard";
import AddIcon from "../../../Icons/Add-Icon";
import HomePagePreview from "../../../components/card/HomePagePreview";
import { useQuery } from "@apollo/client";
import { GET_ALL_POST } from "../../../Lib/query/getAllPost";

export default function ContentSection({ showModal }: { showModal: ()=>void }) {
  const { data, loading, error } = useQuery(GET_ALL_POST);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <section className="grid grid-cols-5 w-full header h-[50%]  ">
      <div className="hidden md:col-span-1 bg-theme-semiTransparent overflow-auto md:flex flex-col backdrop-blur-xl ">
        {/* this will contain all the blogs scrollable */}
        <div className="p-3 font-medium border-b  text-slate-100  border-slate-600 text-xl flex justify-between">
          <span> Our Latest Post</span>
          <AddIcon
            className="w-9 h-9 p-2 rounded hover:bg-blue-800 cursor-pointer bg-blue-600 ml-2"
            fill="white"
            onClick={() => showModal()}
          />
        </div>
        {/* here we will show all the blogs  */}
        {data &&
          data.getAllPost.map((e: any, i: number) => {
            return (
              <HomePagePostCard key={i} title={e.title} />
            );
          })}
      </div>

      <div className="md:col-span-4 col-span-6  md:block md:w-[80%] w-[90%] mx-auto overflow-auto">
        {/* preview section */}
        {data &&
          data.getAllPost.map((e:any, i:number) => {
            return (
              <HomePagePreview key={i} title={e.title} img={e.img} body={e.body} />
            );
          })}
      </div>
    </section>
  );
}
