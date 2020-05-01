/*
Node js Pros
*/
// Node application are perfect for building data intensive apps as it is so fast and and scalable
// Single threaded, based upon event driven,non blocking I/O model
// Entire stack of js on front-end and back-end
// NPM

/*
Node js use
*/
// API with database behind it (preferably non-realtional noSQL MongoDB)
// Data streaming (Youtube)
// Real time chat application
// Server side web application

// Don't use with heavy server side processing like image manipulation,video conversion,file compression (CPU intensive)
// Ruby on Rails,PHP,Python

// Node on cmd
// node REPL - read eval print loop

// Tab - Global variable available in Node
// _ variable is previous result
// fs. or http. Tab - all methods and properties

// File System
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

// In require ./ means current loction of module
const replaceTemplate = require('./modules/replaceTemplate');
/*
// Synchronous
// Blocking code
const textIn = fs.readFileSync(`./txt/input.txt`,'utf-8')
// Character EnCoding is needed otherwise we will get buffer

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
