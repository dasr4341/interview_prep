import React, { useReducer, useState } from 'react';
import './home.scoped.scss';
import Navbar from '../../lib/Routes/components/Navbar/Navbar';

enum actions {
  'ADD_TASK' = 'add_task',
  'REMOVE_TASK' = 'remove_task'
}

export default function Home() {

  function reducer(state: {
    value: string;
    read: boolean
  }[], action: any) {

    switch (action.type) {
      case actions.ADD_TASK: {
        console.log('hii');
        return [...state, { value: action?.data, read: false}];
      }
      case actions.REMOVE_TASK: {
        console.log('hee');

        return state.map((e, i:number) => {
          if (i === action.payload.id) {
            return {...e, read : !e.read}
          }
          return e;
        });
      }
      default:
        throw new Error('Invalid action type');
    }
  }

  const [inputValue, setInputValue] = useState('');
  const [state, dispatch] = useReducer(reducer, []);
  
  function onSubmit(e: any) {
    e.preventDefault();
    setInputValue('');
    dispatch({ type: actions.ADD_TASK, data: (Object.values(e.target)[0] as HTMLInputElement).value });
  }
  return (
    <>
      <Navbar header='Use Reducer' />
      <section className='container'>
        <form onSubmit={onSubmit}>
          <input placeholder='Add task' id="input-field" className='input' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        </form>
        <br />
        <div className='header'>Listed task</div>
        {state.map((e, i) => {
          return <div key={i} className="row" >{i+1}. {e.value}</div>
        })}
      </section>
    </>
  )
};
