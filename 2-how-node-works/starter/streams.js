/*
Streams - Used to process(read and write) data piece by piece (chunks)
without completing the whole read or write operation and therefore
without keeping all the data in memory

Perfect for handling large volumes of data
More efficient data processing in term of memory(no need to keep all data in memory) 
and time(no need to wait untill all data is available)
*/

/*

Streams are instance of EventEmitter class  
All streams can emit and listen to named events

Readable Streams - Consume data
ex - http requests, fs read streams

Events
data - New piece of data is available to consume 
end - No more data to consume

Functions
pipe() - Plugs streams together, passing data from one stream to another
read()


Writable Streams - Write data
ex - http responses, fs write streams

Events
drain - 
finish - 

Functions 
write() - New piece of data is written
end() - No more data to write



Duplex Streams
Readable and Writeable Streams at same time
ex - net web socket
web socket from net module is just communication channel btw client and server that works in both direction

Transform Streams
Duplex Streams also modify and transform data as it is read or written
ex - zlib Gzip creation
zlib is used to compress data 

*/
const fs = require('fs');
// NOTE:
const server = require('http').createServer();
server.on('request', (req, res) => {
    // Using readFile
    /*
        fs.readFile('test-file.txt', (err, data) => {
            if (err) console.log('Error');
            res.end(data);
        });
    */

    // Using createReadStream
    /*
    const readable = fs.createReadStream('test-file.txt');
    readable.on('data', (chunk) => {
        res.write(chunk);
    });
    readable.on('end', () => {
        res.end();
    });
    readable.on('error', (err) => {
        console.log(err);
        res.statusCode = 500;
        res.end('File not found');
    });
    */

    // Backpressure Condition
    // Readable stream is much faster than Response Writable stream
    // Using Pipe
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);

    // readableStream.pipe(writeableStream)
});

server.on('close', () => {
    console.log('Server Closed');
});

server.listen(8000, 'localhost', () => {
    console.log('Listening to http://localhost:8000');
});
