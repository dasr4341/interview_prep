import React from 'react'

function Mybutton({name,marginY,bg}) {
  return (
    <button className={`rounded-md bg-${bg} text-white py-4  text-center my-${marginY} hover:shadow-lg`}>{name}</button>
    // <button className={`rounded-md bg-black text-white py-4  text-center my-4 hover:shadow-lg`}>{name}</button>
  )
}

export default Mybutton