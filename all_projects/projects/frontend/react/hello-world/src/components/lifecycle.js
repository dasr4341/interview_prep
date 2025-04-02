import React, { Component } from 'react'

export class lifecycle extends Component {
    constructor(props) {
      super(props)
        console.log("hey 0");
      this.state = {
         nameS :""
      }
    }
    static getDerivedStateFromProps() {
        console.log("hey 1");
    }
    
    handler() {
        console.log("hey i am ");
        this.setState({
            nameS: this.props.name
       })
   }
    render() {
      console.log("hey 2");
        return <>
        <div onClick={this.handler.bind(this)}>lifecycle</div></>
    }
    static componentDidMount() {
        console.log("hey 3");
    }
    
}

export default lifecycle