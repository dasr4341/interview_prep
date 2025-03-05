"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

type TOptions = {
  id: number;
  title: string;
  selected: boolean;
};

const configOptions: TOptions[] = [
  {
    id: 0,
    title: "Include lower case alphabets",
    selected: false,
  },
  {
    id: 1,
    title: "Include upper case alphabets",
    selected: false,
  },
  {
    id: 2,
    title: "Include number",
    selected: false,
  },
  {
    id: 3,
    title: "Include special characters",
    selected: false,
  },
];
function Page() {
  const [length, setLength] = useState(2);
  const [options, setOptions] = useState(configOptions);
  const [password, setPassword] = useState("");

  const generatePassword = (length: number, options: TOptions[]) => {
    const selectedOptions = options.filter((e) => e.selected);

    let characters: string = "";
    let password: string = "";

    selectedOptions.forEach((e) => {
      switch (e.id) {
        case 0: {
          characters += "abcdefghijklmnop";
          break;
        }
        case 1: {
          characters += "ABCKEFGHIJKLMNOP";
          break;
        }
        case 2: {
          characters += "0123456789";
          break;
        }
        case 3: {
          characters += '<>?:"}{|+_)(*&^%$#@![];,./`~';
          break;
        }
        default: {
          break;
        }
      }
    });

    const len = characters.length - 1;

    for (let i = 1; i <= length; i++) {
      const rand = Math.floor(Math.random() * len);
      password += characters.charAt(rand);
    }

    setPassword(password);

    // return { password, error: '' };
  };
  const onChangeHandler = (
    element: ChangeEvent<HTMLInputElement>,
    option: TOptions
  ) => {
    setOptions((prev) =>
      prev.map((e) =>
        e.id === option.id ? { ...e, selected: !e.selected } : e
      )
    );
  };

  return (
    <section>
      <div className=" bg-gray-900 rounded-md flex gap-4 flex-col w-[700px] p-4 ">
        {!!password.length && (
          <div className=" font-bold text-xl text-white">{password}</div>
        )}
        <div className=" flex justify-between items-center">
          <div className="text-xl">Length</div>
          <div className="text-xl font-extrabold ">{length}</div>
        </div>
        <input
          type="range"
          value={length}
          className="range w-full"
          min={2}
          max={10}
          onChange={(e) => setLength(+e.target.value)}
        />

        <div className=" grid grid-cols-2 gap-6">
          {options.map((option) => (
            <div key={option.id} className="flex gap-4 items-center">
              <input
                checked={option.selected}
                onChange={(e) => onChangeHandler(e, option)}
                id={option.title}
                type="checkbox"
              />
              <label className=" font-bold text-xl" htmlFor={option.title}>
                {option.title}
              </label>
            </div>
          ))}
        </div>

        <div
          onClick={() => generatePassword(length, options)}
          className=" bg-green-800 py-4 px-6 rounded-md font-bold text-center cursor-pointer hover:bg-green-900  text-white"
        >
          Generate Password
        </div>
      </div>
    </section>
  );
}

export default Page;
