import { useState } from 'react';
import './home.scss';

interface IData {
  name: string;
  id: string;
  haveChildren: boolean;
  children: IData[];
}

const data: IData = {
  name: "First",
  id: "1",
  haveChildren: true,
  children: [
    {
      name: "First-children",
      id: "1-1",
      haveChildren: false,
      children: [],
    },
    {
      name: "SEC-children",
      id: "1-2",
      haveChildren: true,
      children: [
        {
          name: "First-child-children",
          id: "1-1-1",
          haveChildren: false,
          children: [],
        },
        {
          name: "SEC--child-children",
          id: "1-1-2",
          haveChildren: false,
          children: [],
        },
      ],
    },
    {
      name: "SEC-children",
      id: "1-2",
      haveChildren: true,
      children: [
        {
          name: "First-child-children",
          id: "1-1-1",
          haveChildren: false,
          children: [],
        },
        {
          name: "SEC--child-children",
          id: "1-1-2",
          haveChildren: false,
          children: [],
        },
      ],
    },
  ],
};



function Explorer({ data }: { data: IData }) {
  const [showList, setShowList] = useState(false);
  return (
    <section className="explorer-container">
      <div className="explorer-header" onClick={() => { setShowList((p) => !p) }}>
        <div>{data.haveChildren ? '🗂️' : '📂'}{data.name}</div>
         {data.haveChildren && <div>{showList ?  '△' : '▽'}</div>}
      </div>
      {showList && data.haveChildren && <div className="explorer-list">{data.children.map(e => <Explorer data={e} />)}</div>}
    </section>
  );
}
function Home() {


  return (
    <div>
      Home
      <Explorer data={data} />
    </div>
  );
}

export default Home;
