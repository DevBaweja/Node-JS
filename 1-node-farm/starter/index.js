/*
Node js Pros
*/
// Node application are perfect for building data intensive apps as it is so fast and and scalable
// Single threaded, based upon event driven, non blocking I/O model
// Entire stack of js on front-end and back-end
// NPM - Node Package Manager

/*
Node js use
*/
// API with database behind it (preferably non-realtional noSQL MongoDB)
// Data streaming (Youtube)
// Real time chat application (socket.io)
// Server side web application (Using Pug as view engine)

// Don't use with heavy server side processing like image manipulation, video conversion, file compression (CPU intensive)
// Ruby on Rails,PHP,Python

// Node on cmd
// node REPL - read eval print loop
//  NOTE:
// Tab - Global variable available in Node
/*

# Classes
Array
ArrayBuffer
BigInt
BigInt64Array
BigUint64Array
Boolean
Buffer
DataView
Date
Error
EvalError
Float32Array
Float64Array
Function
GLOBAL
Infinity
Int8Array
Int16Array
Int32Array
JSON
Map
Math
NaN
Number
Object
Promise
Proxy
RangeError
ReferenceError
Reflect
RegExp
Set
SharedArrayBuffer
String
Symbol
SyntaxError
TypeError
URIError
URL
URLSearchParams
WeakMap
WeakSet
WebAssembly

# Special Character
_
_error

# Modules
assert
async_hooks
buffer
child_process
clearImmediate
clearInterval
clearTimeout
cluster
console
crypto
decodeURI
decodeURIComponent
dns
domain
encodeURI
encodeURIComponent
escape
eval
events
fs
global
http
http2
https
inspector
isFinite
isNan
module
net
os
parseFloat
parseInt
path
perf_hooks
process
querystring
readline
repl
require
root
setImmediate
setInterval
setTimeout
stream
string_decoder
stream
trace_events
unescape
url
util
v8
vm
zlib

# Object
__defineGetter__
__defineSetter__
__lookupGetter__
__lookupSetter__
__proto__
hasOwnProperty
isPrototypeOf
propertyIsEnumerable
toLocaleString
toString
valueOf

constructor

*/
/*
__dirname gives absolute path always no matter from where it node app is runned

./ is relative path from where node app is runned when in file and other
so in that case we use __dirname with path.join(__dirname,'public')

In require ./ is current working directory and not where app is run 


path.join(__dirname,'public')

The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.

Zero-length path segments are ignored. If the joined path string is a zero-length string then '.' will be returned, representing the current working directory.

path.delimiter
; for Windows
*/
// _ variable is previous result
// fs. or http. Tab - all methods and properties

// File System
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

// In require ./ means current loction of module
const replaceTemplate = require('./modules/replaceTemplate');

// Synchronous
// Blocking code
// Character EnCoding is needed otherwise we will get buffer
/*
const textIn = fs.readFileSync(`./txt/input.txt`,'utf-8')

console.log('Reading File');

const textOut = `This is what we know about avocado ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);

console.log('Writing File');
*/

// Asynchronous
// Non Blocking code

// Node js is single thread application
// Callback Hell
/*
fs.readFile('./txt/start.txt', 'utf-8', (error, start) => {

    fs.readFile(`./txt/${start}.txt`,'utf-8',(error,readthis) => {
            console.log(readthis);

        fs.readFile('./txt/append.txt','utf-8',(error,append) => {
            console.log(append);

            fs.writeFile('./txt/final.txt',`${readthis}\n${append}`,'utf-8', error => {
                console.log('File has been written');
            })
        })
    })
});
// Asynchronous code require callback function
console.log('Reading File');
console.log('Writing file');

// ES6 promises or async await
*/

/**
    Server
*/
// Representing with ./ mean current directory of cmd
// So we use __dirname which means current directoro of file

// ./ means where script is running
// __dirname is where current file is located
// Top level code - so we can do synchronous task here

// NOTE:
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const slugs = dataObj.map((cur) =>
    slugify(cur.productName, {
        replacement: '~',
        lower: true,
    })
);
console.log(slugs);

// NOTE:
const server = http.createServer((req, res) => {
    // Browser make request for favicon.ico
    const reqUrl = url.parse(req.url, true);
    // Pass true in order to parse query into object

    // const pathName = reqUrl.pathname;
    const { pathname: pathName, query } = reqUrl;

    // Overview of all product
    if (pathName === '/overview' || pathName === '/') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const cardsHtml = dataObj.map((cur) => replaceTemplate(tempCard, cur)).join(' ');
        const overviewHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(`${overviewHtml}`);
    }
    // One specific product
    else if (pathName === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        // eval(reqUrl.query);
        const id = query.id;

        const product = dataObj[id];
        const productHtml = replaceTemplate(tempProduct, product);
        res.end(`${productHtml}`);
    }
    // Sending data
    else if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json',
        });
        res.end(data);
    }
    // Url not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-head-info': 'Please search properly',
        });
        // statusCode
        res.end(`<h1>Url not found</h1>`);
    }
});

// NOTE:
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
}); // Port Number,Ip of localhost

// App run forever due to event loop
// API - Service through which we can request data and it send us response

/*
NPM
*/
// package.json

// npm install
// npm install packageName or npm i packageName
// npm uninstall packageName

// Semantic version notation

/* Major.Minor.Patch */
// Patch - Intended to fix bugs
// Minor - Features with no breaking changes (Backward Compatible)
// Major - Huge Features which can have breaking changes

// npm outdated
// npm install packageName@version

// * - Accept major,minor and patch changes
// ^ - Accept minor and patch changes
// ~ - Accept only patch changes

// npm update packageName
