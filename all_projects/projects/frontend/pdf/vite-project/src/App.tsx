import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { jsPDF } from 'jspdf';

function App() {
  const [count, setCount] = useState(0)
  function handler() {
    const doc = new jsPDF();


    doc.html(document.getElementById('saam') as HTMLElement, {
      callback: (d: any) => {
        d.save('myPdf.pdf');
      },
      autoPaging: 'text',
      margin: [10, 10, 10, 10],
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 600
    });
  }

  
  
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          setCount((count) => count + 1);
        
        
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button onClick={() => handler()}>Download</button>
      
      <div id='saam' style={{ color: 'black' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, minus! Ratione enim architecto nemo voluptas dolorum, eum ea impedit voluptates corrupti molestiae odit iure reprehenderit sit porro tempore itaque tenetur rem laudantium. Possimus dolorem impedit nulla fugiat placeat. Dicta, quas, possimus asperiores molestias esse minus dolorem fuga iure laboriosam modi quia ipsa eligendi animi repellendus saepe exercitationem doloremque adipisci est hic, maxime neque? Officia incidunt quis quo rerum assumenda iste expedita nesciunt modi maxime eum, exercitationem velit ipsam. Pariatur iusto, dolorum quod eveniet corrupti suscipit totam ut temporibus excepturi ea quis perspiciatis maiores similique ad voluptates dolorem exercitationem itaque aliquid!
      <div id="pdfArea" className='flex flex-row ' style={{ color: 'black' }} >
      {new Array(10).fill(10).map((d, i) => {
        return <div>{i}</div>;
      })}

      </div>
      
      </div>

   
    </>
  )
}

export default App
