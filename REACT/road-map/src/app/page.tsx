"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const routes = [
    {
      name: "Road map",
      path: "/road-map",
    },
    {
      name: "ProgressBar",
      path: "/progress-bar",
    },
    {
      name: "Password Generator",
      path: "/password-generator",
    },
  ];
  return (
    <div className=" flex flex-row gap-6 py-4 px-6 rounded-sm border border-gray-500">
      {routes.map((r, i) => (
        <div className=" hover:bg-gray-600 rounded-sm  cursor-pointer px-4 py-2" key={i} onClick={() => router.push(r.path)}>
          {r.name}
        </div>
      ))}
    </div>
  );
}
