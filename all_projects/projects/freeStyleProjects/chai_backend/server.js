import express from 'express';

const port = process.env.PORT || 8001;
const app = express();

app.get('/', (req, res) => {
    res.send('server is ready')
});

app.get('/jokes', () => {
    const data = [];
    res.send(data)
});




app.listen(port, () => {
    console.log(`server at http://localhost:${port}`);
});