interface IDataInfo {
  hasChildren: boolean;
  name: string;
  info: string;
  children: IDataInfo[];
}

function Folder({ explorerData }: { explorerData: IDataInfo }) {
    
  return (
    <div className=" flex gap-4 flex-col max-w-96 overflow-hidden">
      <button className="px-3 py-2 flex border bg-gray-200 rounded-md items-center justify-between">
        {explorerData.name}
        <div className="flex flex-row items-center gap-2">
          <button className=" bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded-md capitalize">+ method</button>
          <button className=" bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded-md capitalize">+ list</button>
        </div>
      </button>
      {explorerData.hasChildren && <div className=" pl-8 flex flex-col gap-1 ">
        {explorerData.children.map((e) =>
          e.hasChildren ? <Folder explorerData={e} /> : <div>{e.name}</div>
        )}
      </div>}
    </div>
  );
}

export default function LifeCycle() {
  const data: IDataInfo[] = [
    {
      hasChildren: true,
      name: "Mounting",
      info: "These methods are called in the following order when an instance of a component is being created and inserted into the DOM:",
      children: [
        {
          name: "constructor()",
          hasChildren: true,
          info: "Before the initialization of the component, this method is invoked",
          children: [{
            hasChildren: true,
            name: "Mounting",
            info: "These methods are called in the following order when an instance of a component is being created and inserted into the DOM:",
            children: [
              {
                name: "constructor()",
                hasChildren: true,
                info: "Before the initialization of the component, this method is invoked",
                children: [],
              },
              {
                name: "getDerivedStateFromProps()",
                hasChildren: false,
                info: "this method is invoked in every rerender, to update the state",
                children: [],
              },
              {
                name: "constructor()",
                hasChildren: false,
                info: "this method is responsible for the rendering the contents to the ui",
                children: [],
              },
              {
                name: "componentDidMount()",
                hasChildren: false,
                info: "this method is invoked, after the component is rendered",
                children: [],
              },
            ],
          },],
        },
        {
          name: "getDerivedStateFromProps()",
          hasChildren: false,
          info: "this method is invoked in every rerender, to update the state",
          children: [],
        },
        {
          name: "render()",
          hasChildren: false,
          info: "this method is responsible for the rendering the contents to the ui",
          children: [],
        },
        {
          name: "componentDidMount()",
          hasChildren: false,
          info: "this method is invoked, after the component is rendered",
          children: [],
        },
      ],
    },
    {
      name: "Updating",
      hasChildren: true,
      info: "",
      children: [
        {
          name: "getDerivedStateFromProps()",
          hasChildren: false,
          info: "",
          children: [],
        },
        {
          name: "shouldComponentUpdate()",
          hasChildren: false,
          info: "",
          children: [],
        },
        {
          name: "getSnapSort()",
          hasChildren: false,
          info: "",
          children: [],
        },
        {
          name: "componentDidUpdate()",
          hasChildren: false,
          info: "",
          children: [],
        },
      ],
    },
    {
      name: "Unmounting",
      hasChildren: true,
      info: "",
      children: [
        {
          name: "componentWillUnMount()",
          info: "",
          hasChildren: false,
          children: [],
        },
      ],
    },
  ];

  return (
    <section className=" flex flex-col justify-center">
      <div className=" font-bold text-3xl">LifeCycle</div>
      <div className=" flex flex-col gap-4">
        {data.map((e) => (
          <Folder explorerData={e} />
        ))}
      </div>
    </section>
  );
}
