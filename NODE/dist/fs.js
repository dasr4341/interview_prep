// import * as fs from 'fs';
// const contents = fs.readFileSync('./src/assets/file.txt', 'utf-8')
// console.log({ contents })
// fs.readFile('./src/assets/file.txt', 'utf-8', (error, data) => {
//     console.log({ data, error});
// })
// fs.writeFileSync('./src/assets/file1.txt', 'acadcacdav')
// fs.writeFile('./src/assets/file.txt', 'sdcdavcadcadcdac', { flag: 'a'}, (error) => {
//     console.log({ error});
// })
// --------------- FS PROMISES --------------------
import { log } from 'console';
import * as fs from 'fs/promises';
// fs.readFile('./src/assets/file.txt', 'utf-8').then(e => {
//     log({ data: e})
// }).catch(e => {
//     log({ data: e})
// })
async function read() {
    try {
        const data = await fs.readFile('./src/assets/file.txt', 'utf-8');
        log({ data });
    }
    catch (e) {
        log({ error: e });
    }
}
read();
//# sourceMappingURL=fs.js.map