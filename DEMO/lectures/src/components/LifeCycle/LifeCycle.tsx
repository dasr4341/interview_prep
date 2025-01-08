import { Children } from "react";

function Folder({ node }: {}) {

}

interface IDataInfo {
    hasChildren: boolean,
    name: string,
    info: string,
    children: {
        hasChildren: boolean,
        name: string,
        info: string,
        children: {
            hasChildren: boolean,
            name: string,
            info: string,
        }[]
    }
}
interface IData extends IDataInfo {
    children: IDataInfo[]
}

export const explorerData = {
    id: "1",
    name: "root",
    isFolder: true,
    items: [
      {
        id: "2",
        name: "public",
        isFolder: true,
        items: [
          {
            id: "3",
            name: "public nested 1",
            isFolder: true,
            items: [
              {
                id: "4",
                name: "index.html",
                isFolder: false,
                items: [],
              },
              {
                id: "5",
                name: "hello.html",
                isFolder: false,
                items: [],
              },
            ],
          },
          {
            id: "6",
            name: "public_nested_file",
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        id: "7",
        name: "src",
        isFolder: true,
        items: [
          {
            id: "8",
            name: "App.js",
            isFolder: false,
            items: [],
          },
          {
            id: "9",
            name: "Index.js",
            isFolder: false,
            items: [],
          },
          {
            id: "10",
            name: "styles.css",
            isFolder: false,
            items: [],
          },
        ],
      },
      {
        id: "11",
        name: "package.json",
        isFolder: false,
        items: [],
      },
    ],
  };

  
export default function LifeCycle() {
  const data = {
    types: [
      {
        hasChildren: true,
        name: "Mounting",
        info: "These methods are called in the following order when an instance of a component is being created and inserted into the DOM:",
        children: [
          {
                name: "constructor()",
                hasChildren: true,
                info: "These methods are called in the following order when an instance of a component is being created and inserted into the DOM:",
          },
          {
            name: "static getDerivedStateFromProps()",
          },
          {
            name: "render()",
          },
          {
            name: "componentDidMount()",
          },
        ],
      },
      {
        name: "Updating",
        hasChildren: false,
      },
      { name: "Unmounting", hasChildren: false },
    ],
  };

  return (
    <section className=" flex flex-col justify-center">
      <div className=" font-bold text-3xl">LifeCycle</div>
      <div>
        <div>3 Phases</div>
        {data.types.map((e) => {
          return <span>{e.name}</span>;
        })}

        {<Folder node={data.types} />}
      </div>
    </section>
  );
}
