import React from 'react';

function HomePagePostCard({
    title,
}: {
    title: string,
}) {
    return (
      <>
        <div className="flex flex-col p-2 m-1  justify-start hover:cursor-pointer">
          {/* card to show the blog post */}
          <div className=" md:block  text-sm  text-slate-300">
             {title}
          </div>
        </div>
      </>
    );
}

export default HomePagePostCard;