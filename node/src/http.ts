import * as http from 'http';
import * as fs from 'fs';


const server = http.createServer((req, res) => {
    // req.url
    // req.method
    const obj = {
        name: 'Rahul'
    }
    // res.writeHead(200, {});
    // console.log({ res, req });


    // res.writeHead(200, { 'content-type': 'application/json' });
    // res.end(JSON.stringify(obj))

    res.writeHead(200, { 'content-type': 'text/html' });
 
    let html = fs.readFileSync('./src/assets/index.html', 'utf-8')
    html = html.replace("{{name}}", 'Rahul')
    res.end(html)

    // fs.createReadStream('./src/assets/index.html').pipe(res)
   
})

server.listen(300, () => {
    console.log('listening to port 300');
})