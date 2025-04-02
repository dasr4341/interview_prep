// ab6603deae8844638ebc0e7aa3db326a
const axios = require('axios').default;
const cors = require('cors');
const express = require('express');
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
}


app.use(express.json());
app.use(express.urlencoded({ extended:false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// cors(corsOptions)
app.post('/api', (req, res) => {
    const data = req.body;
    console.log(data);
    res.json(
        {
            id: 400,
            data : data
        }
    );
});




// app.get('/', async (req, res) => {
//   const d =  await axios.get('https://newsapi.org/v2/everything?q=tesla&from=2022-06-25&sortBy=publishedAt&apiKey=ab6603deae8844638ebc0e7aa3db326a')
//        .then((res) => {
//            return res.data.articles;
//        })
//    await res.json(d.map((item,value) => {
//        return item.title;
//     }))
// })


// app.get('/user', async (req, res) => {

//    await axios.post('/user', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   })
//   .then(function (response) {
    
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
    
    
//   const d =  await axios.get('/user')
//        .then((res) => {
//            return res;
//        }).catch(e => {
//            return 'not found';
//            console.log('not found');
//        })
    
//     await res.json(d);
   
// })





app.listen('301', () => {
    console.log('i am listening');
})