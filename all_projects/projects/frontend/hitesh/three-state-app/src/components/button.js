import React, { useState } from 'react'

function button({onClick, title, btnClass, value}) {
  return (
      <>
          <button className={btnClass} onClick={()=>onClick(value)} >{title}</button>
      </>  
        
  )
}

export default button