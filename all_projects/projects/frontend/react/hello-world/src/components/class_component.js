import React, { Component } from 'react';
// rce
class CC extends Component{
    
    constructor() {
        super();
        this.state = {
          msg:"hey class"
      }
    }
    render() {
    // this is jsx  
        return <><h1 className='sammy'>
                ({this.state.msg}
                <span id="tusar">the user id is :</span>
                {this.state.userID})
               </h1></>;

        // jsx with react 
        // return React.createElement('h1',{},this.state.msg+" : "+this.state.userID)
    }
}
export default CC;

