import React, { useState } from 'react'
import ButtonComponent from '../components/button';

const Page = () => {
 const [count, setCount] = useState(1);
  const [message, setMessage] = useState(""); 
  
  const handler = (value) => {
      value = parseInt(value);
    if (value >= 0 && value < 100 ) {
      setCount(value);
      setMessage('');
    } else {
      setMessage('Limit exceeded');
    }
  }
    

    return (
       
        <>    <header className="text-h">
            Counter App using STATE
            </header>
            <h1 className='count'>{count}</h1>
            <span className='message'>{message}</span>
            <ButtonComponent title='Reset Counter' btnClass='btn' onClick={handler} value="0"/> 
            <ButtonComponent title='Increase Counter' btnClass='btn' onClick={handler} value={count+1}/> 
            <ButtonComponent title='Decrease Counter' btnClass='btn' onClick={handler} value={count-1}/> 
        </>
  )
}

export default Page;