import logo from './logo.svg';
import './App.css';
import Icons from './components/icon'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, CardBody, Col, Row, Container, Button } from 'reactstrap';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const itemArray = new Array(9).fill('pen');




function App() {
  const [isCross, setIsCross] = useState(false);
  const [winMessage, setWinMessage] = useState('');

  const reload = () => {
    setIsCross(false);
    itemArray.fill('pen')
  }
  const checkWinner = () =>{
    
  }

  const changeItem = (index) => {
    console.log(itemArray[index])
    if (winMessage) {
      toast(winMessage, {type:"success"})
    }
    if (itemArray[index] == 'pen') {
      // 1. set the icon
      itemArray[index] = isCross ? "cross" : "circle";
      setIsCross(!isCross)
    } else {
       toast("Already Filled", {type:"error"})
    }
  }

  return (
    <>
      <Container className='p-5'>
        <ToastContainer className='bottom-center' />
        <Row className='col-md-6 lg-col-8 m-auto' >
            <div className='text-center'>
            {winMessage ? (
              <>   <h3 className='text-cnter text-success text-uppercase'>{winMessage}</h3>
            <Button color='success' block onClick={reload} > Reload the Game</Button></>
            ) : (
            <h3 className='text-center text-danger text-uppercase'>{isCross ? "Corss" : "Circle"} turn</h3>
            )}
            </div>
          <div className='grid p-4'>
                 {
                    itemArray.map((item, key) => {
                      return  <Card color="success" outline  onClick={()=>changeItem(key)}>
                                <CardBody className='box' ><Icons iconType={item} className='icon'/> </CardBody>
                              </Card>
                    })
                  }
          </div>
        </Row>
      </Container>
    </>
  );
}

export default App;
