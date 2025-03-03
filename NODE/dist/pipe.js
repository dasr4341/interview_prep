import * as fs from 'fs';
import zlib from 'zlib';
const gZip = zlib.createGzip();
const readableStreams = fs.createReadStream("./src/assets/file.txt", {
    encoding: 'utf-8',
});
const writableStreams = fs.createWriteStream('./src/assets/file1.txt');
const writableStreamsZip = fs.createWriteStream('./src/assets/file1.zip');
// readableStreams.pipe(writableStreams)
readableStreams.pipe(gZip).pipe(writableStreamsZip);
// pipe returns a destination stream, which enables streaming
// the destination stream needs to be a duplex, readable, or transform stream
//# sourceMappingURL=pipe.js.map