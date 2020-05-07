/*
Request Response Model
Client Server Architecture
TCP/IP
Static vs Dynamic 
API
*/

// Request Response Model
/*
Http/Https - Protocol
Hyper Text Transfer Protocol Secure
Allow client and server to communicate by sending req and res 

Domain Name - google.com
Resourse - maps
https://google.com/maps

DNS - Domain Name Server
Domain name into real IP address
ISP - Internet Service Provider

https:// IP : Port
Protocol :// IP address : Port Number
Port number is defined for different protocols
Default 443 for https 80 for http
*/

// TCP/IP socket connection is established between browser and server
/* Transmission Control Protocol (TCP) Internet Protocol (IP)

HTTP Request

GET /map HTTP/1.1
Http method + request target + Http Version
Host : www.google.com
User Agent : Mozilla/5.0 (Macintosh; Intel Mac OS X 10)
Accept-Language : en-US,en.
<BODY>

Http Methods
GET - Request data
POST - Response data
PUT and PATCH - Modify data

HTTP Response
HTTP/1.1 200 OK
Http Version + status code + status message
Date : Fri,18 Jan 2021
Content-Type : text/html
Transfer-Encoding : chunked
<BODY>

HTTPS is encrypted using TLS or SSL

*/

// Server
/*
Just computer
Static - Http Server,Files
Dynamic - Http Server,Files,App,Databases
Databases - User profiles,perform log in,send email,handle payments
retrive and send data from database to client,manipulate data in database
fill up website template

Nodejs
MongoDB

Php 
Mysql

Python
PostgreSql

Ruby on Rail
*/

/*
Static vs Dynamic
*/

/*
Static - Developer serve final and ready to be served file on server (Html,Css,Js,Image)
No application running on server and No database attached to it

Dynamic - Files are genereated on server and website is build with template and served to client
Application running on server and connected to database
Server-side Rendering
Dynamic websites and Web application - Dynamic websites + Functionality

Client Side
API - Application running on server and connected to database(Application Program Interface)
Building Api
Send only data/json and not entire website to client
Consuming Api
Then website is build using template and data/json on client side
Client side Rendering

Main advanctage of Api
It can be consumed anywhere in any platform
*/

/*
Event
Event Loop
Streams
Module
*/

/*
Node Architecture
*/
/*
V8 js engines (Js and C++)
libuv - focus on asynchronous IO,os,file system,networking (C++)
Event loop and Thread Pool

Event Loop - executing callbacks,network io
Thread Pool - file access and compression

http-parser - parsing http
c-ares - DNS request
OpenSSL - Cryptography
zlib - Compression
*/

/*
Thread Pool - Provided by libuv
*/
/*
Node process running on computer
Program in execution
process variable
Nodejs run on single thread - Sequence of instructions

Execute top-level code
Require modules
Register event callbacks
Start event loop

Thread Pool 4-128 threads
Event loop can offload heavy task to thread pool
Heavy stuff - File system,Cryptography,Compression,DNS lookup(Domain name to real IP addresses)
*/

/*
Event Loop - Provided by libuv
*/
/*
All application code that is inside callback function

Event driven architecture : 

Events are emitted
Event loop picks them up
Callbacks are called

New http request
Timer expired 
Finished file reading
Orchestration

Callback queue

Phases
1. Expired timer Callbacks - setTimeout()
2. IO Polling and execution callbacks - file access,networking
3. setImmediate callbacks
4. Close callbacks

// These are called after any phase right after current event loop phase
Process.nexttick() Queue
Other Microtasks Queue (Resolved promises)

Nodejs
Single thread with event loop - Scalable
Danger of blocking single thread

Php on Apache server
New thread for each new user - Resource Intensive
No danger of blocking 

*/

/*
Don't block event loop
*/
/*
Don't use sync verison of function in fs,crypto,zlib modules in your callbacks functions
Don't perform complex calculations
Be careful with Json in large object ( parse and stringify )
Don't use too complex regular exPressions ( nested quantifiers or back references )

Manully offloading to thread pool or child processes

Sync version of function can be used in top level code 
Async version with callbacks can be used inside event loop
JSON.parse(json)
JSON.stringify(js object)
*/

/*
Events and Event-Driven Architecture
*/
/*
Event Emitters - emits events and then Event Listeners - listen events and calls attached callbacks functions
// NOTE:
const http = require('http');
const server = http.createServer();
server.on('request',(req,res) => {
    console.log('Request Received');
    res.end('Request Received');
})
server.listen(8000,'localhost',() => {
    console.log('Listening to requests on http://localhost:8000');
})

server is instance of Nodejs EventEmitter class
OBSERVER Pattern - there is an observer (Event Listener) which keeps observing the subject (Event Emitter) 
which will eventually emit event that listener is waiting for
*/
