import React from 'react'

export default function HomePagePreview({ title, img, body }: { title: string, img:string, body:string }) {
  return (
    <div className="m-4  p-4 rounded-xl border border-slate-700">
            {/* preview card */}
            <div className="text-3xl font-semibold text-white">
              {title}
            </div>
            <figure className="h-[300px] w-full mt-6">
              <img
                src={img}
                className="w-full h-[100%] object-cover"
                alt="img"
              />
            </figure>
            <div className="mt-4  text-slate-400 text-md"> {body} </div>
          </div>
  )
}
