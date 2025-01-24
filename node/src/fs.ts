import * as fs from 'fs';

const contents = fs.readFileSync('./src/assets/file.txt', 'utf-8')
console.log({ contents })

fs.readFile('./src/assets/file.txt', 'utf-8', (error, data) => {
    console.log({ data, error});
})

// fs.writeFileSync('./src/assets/file1.txt', 'acadcacdav')
fs.writeFile('./src/assets/file.txt', 'sdcdavcadcadcdac', { flag: 'a'}, (error) => {
    console.log({ error});
})