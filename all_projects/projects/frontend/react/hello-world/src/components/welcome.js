import React, { Component } from 'react';

class HeyUser extends Component{
    constructor(){
            super();
            this.state = {
                data:"I am from class component"
            }
    }
    responce() {
        
        this.setState((prev) => ({
            data: "hey",
        }))
    }
    render() {
        return <button onClick={this.responce.bind(this)}> { this.state.data}</button>
    }
}
export default HeyUser;

