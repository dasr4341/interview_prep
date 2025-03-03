import * as fs from 'fs';
const readableStreams = fs.createReadStream('./src/assets/file.txt', {
    encoding: 'utf-8',
    highWaterMark: 2
});
const writableStreams = fs.createWriteStream('./src/assets/file1.txt', { flags: 'a' });
readableStreams.on('data', (...data) => {
    console.log({ data });
    writableStreams.write(...data);
});
// 4 types of streams
// 1. readable streams 
// 2. writable streams
// 3. duplex streams for both read and write / sockets
// 4. transform streams that can modify the data or transform streams as it is written or read / file zipping
//# sourceMappingURL=streams.js.map