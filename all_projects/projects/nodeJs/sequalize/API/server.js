const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// const corsOption = {
//     origin: 'http://localhost:3001/forget-password',
//     // method: (*)
// }

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
// app.use(cors(corsOption))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// router
const router = require('./routers/productRouter.js');
app.use('/api/product',router)

// test
app.get('/',(req,res)=>{
    // req
    res.status(200).json("Hello from api")
})
app.get('/api/user',async (req,res)=>{
    // req
    try {
        const d = await axios.get('http://localhost:3000/api/user');
        await res.status(200).json(d);
        
    } catch {
        res.end('hey bro');
        
    }

})

const PORT = process.env.PORT || 3000;
// server
app.listen(PORT,()=>{
    console.log('Listening from',PORT,"...");
})
