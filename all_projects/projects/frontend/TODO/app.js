const express = require('express');
const server = express();
server.use(express.urlencoded({
    extended:false
}))
server.use(express.static('./files'))
server.get('/', (req, res) => {
    res.end()
})

server.post('/add/', (req,res) => {
    const data = req.body.todoData.trim();
    if (!data) {
        // user passes empty field
        return res.redirect('./?msg=Please enter something to add');
    }
    res.end();
})

server.listen(8080, () => {
    console.log('server is listening to Port 8080');
})