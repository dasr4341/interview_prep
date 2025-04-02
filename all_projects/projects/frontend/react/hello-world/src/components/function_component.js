import React from 'react'
// rcf
// this way we import style in a module

function FC({ userName }) {
    // CONCEPT OF destructure 

    // function call of different types :

    // 1:
    // const handler = () =>{
    //     alert('good morning : '+userName)
    // }

    // 2:
    // function handler() {
    //     alert('good morning : ' + userName);
    // }

    return (
         // concept of using the Fragment
        <React.Fragment>

            <h2>HEY I AM function COMPONENT </h2>
            <p>USER : {userName}</p>
            <button onClick={() => {
                // 3:
                alert('good morning : ' + userName);
            }}>Alarm</button>
            <br />
            <br />
            
        </React.Fragment>
    )
}
export default FC