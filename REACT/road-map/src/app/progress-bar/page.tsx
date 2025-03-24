"use client";
import ProgressBar from "@/components/progressBar/ProgressBar";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setValue((p) => p +1);
    }, 100);
  }, []);

  return (
    <div>
      <ProgressBar value={value} />
    </div>
  );
}
