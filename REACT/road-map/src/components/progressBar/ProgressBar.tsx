"use client";
import React, { useEffect, useState } from "react";

function ProgressBar({ value }: { value: number }) {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    setLoading(Math.min(100, Math.max(value, 0)));
  }, [value]);

  return (
    <div className=" w-screen self-start text-center h-8 relative  rounded-sm bg-gray-300">
      <span className=" absolute flex items-center justify-center left-0 right-0 top-0 bottom-0 z-30 text-center ">
        {loading} %
      </span>
      <div
        style={{ transform: `scaleX(${loading / 100})` }}
        className={`transform bg-green-700 w-full h-full origin-top-left`}
      ></div>
    </div>
  );
}

export default ProgressBar;
