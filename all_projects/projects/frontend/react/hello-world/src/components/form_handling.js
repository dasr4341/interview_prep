import React from 'react'
import SS from './app.module.css'
export default function form_handling() {
    var val1 = "";
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        margin: 'auto'
    }
    const handler = (e) => {
        e.preventDefault();
        const p = e.target.parentElement;
        const value = p.getElementsByTagName('input')[0].value;
        console.log(value);
        }
    return <>
          <form style={formStyle}>
            <input type="text" placeholder='HEY ENTER YOUR NAME ' className={SS.input} onChange={
                (e) => {
                    val1 = e.target.value;
                    console.log(val1);
                }
            } />
            <input type="submit" value="ADD" className={SS.input}  onClick={handler} />
          </form>
    </>
  
}
