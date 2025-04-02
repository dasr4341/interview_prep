import React from 'react'

function TextFieldComponent({placeholder,icon,mY,pY,pX,nameData,values}) {
  return (
    <>
      <label className={`border hover:border-black rounded grid grid-cols-[10%,90%] grid-rows-1 my-${mY} py-${pY} px-${pX}`}>
      {/* <label className={`border hover:border-black rounded grid grid-cols-[10%,90%] grid-rows-1 my-2 py-2 px-2`}> */}
                        {icon }
        <input placeholder={placeholder} className='text-sm tracking-wide focus:outline-none px-3 py-2' name={nameData}  />
        </label>
      </>
  )
}

export default TextFieldComponent;